import { Component, hooks, tags } from "@odoo/owl";
import { OwlEvent } from "@odoo/owl/dist/types/core/owl_event";
import { drawDot, floodFillPixels, range } from "../../common/utils";
import { name } from "../../package.min.json";
import { Environment } from "../services/Environment";
import { DropdownItem } from "./Dropdown";
import { Main } from "./Main";
import { ModalManager } from "./Modal";
import { Navbar } from "./Navbar";
import { NotificationManager } from "./Notification";
import { Settings } from "./Settings";
import { WindowControls } from "./WindowControls";

type Extension = "all" | "gif" | "png";
type EditorTool = "backgroundEraser" | "crop" | "brush";
type anyFn = (...args: any) => any;

interface ImageMetadata {
  size: [number, number];
  mimetype: string | null;
}

interface ImageMutation {
  tool: EditorTool;
  args: any;
}

interface ImageState {
  imageData?: ImageData;
  mutations: ImageMutation[];
  params?: any;
}

interface HistoryItem {
  action: anyFn;
  cancel: anyFn;
}

const { xml: html, css } = tags;
const {
  onMounted,
  onPatched,
  onWillStart,
  useExternalListener,
  useRef,
  useState,
} = hooks;

const EXTENSIONS: Extension[] = ["all", "gif", "png"];
const EDITABLE_EXTENSIONS = ["png", "jpg", "jpeg"];
const IMAGE_COLS = 5;
const IMAGE_ROWS = 5;
const IMAGE_MTYPE_RE = /(image|text)\/(\w+);?/i;
const QUERY_EXTENSION_RE = /\b(gif|png)\b/gi;
const NOTIFICATION_DELAY = 2500;

const cleanQuery = (query: string): string =>
  query
    .toLowerCase()
    .replace(QUERY_EXTENSION_RE, "")
    .replace(/['"\<\>]+/g, "") // removes invalid characters
    .replace(/[\s\n_-]+/g, " ") // unifies white spaces
    .trim();

const getDefaultState = () => ({
  activeSuggestion: <number | null>null,
  editorTool: <EditorTool | null>null,
  ext: <Extension>"all",
  imageMetadata: <{ [url: string]: ImageMetadata | null }>{},
  pageIndex: <number>0,
  query: <string>"",
  searching: <boolean>false,
  showImageOptions: <boolean>false,
  showSuggestions: <boolean>false,
  updateId: <number>0,
  urls: <string[]>[],
});

export class Root extends Component<{}, Environment> {
  //---------------------------------------------------------------------------
  // PROPS / COMPONENTS
  //---------------------------------------------------------------------------
  static components = {
    Main,
    ModalManager,
    Navbar,
    NotificationManager,
    Settings,
    WindowControls,
  };
  static props = {};

  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <div class="Root">
      <WindowControls t-if="env.isDesktop" />
      <NotificationManager />
      <ModalManager />
      <Navbar />
      <Main />
    </div>
  `;

  //---------------------------------------------------------------------------
  // PROPERTIES
  //---------------------------------------------------------------------------

  state = useState(getDefaultState());

  currentSearch: string = "";
  focusedImage: HTMLImageElement | null = null;
  hasClipboardAccess = false;
  hoveredImage: HTMLImageElement | null = null;
  imageStates: { [url: string]: ImageState } = {};
  imageMimeTypes: { [url: string]: string | null } = {};
  modalManager = useAnimation<boolean>("settings", "slide-top");
  notifyTimeout: number = 0;
  notificationManager = useAnimation<string>("notification", "slide-right");
  toFocus: number | null = null;
  searchInputRef = useRef("search-input");
  previewCanvasRef = useRef("preview-canvas");
  willUpdateCanvas: boolean = false;

  extensionItems: DropdownItem[] = EXTENSIONS.map((ext) => ({
    id: ext,
    value: ext.toUpperCase(),
  }));
  cols: number = IMAGE_COLS;
  rows: number = IMAGE_ROWS;

  get activeImage(): HTMLImageElement | null {
    return this.hoveredImage || this.focusedImage;
  }

  get pageCount(): number {
    return Math.ceil(this.state.urls.length / (this.cols * this.rows));
  }

  //---------------------------------------------------------------------------
  // LIFECYCLE
  //---------------------------------------------------------------------------

  setup() {
    useExternalListener(window, "keydown", this.onWindowKeydown);

    onMounted(() => this.onMounted());
  }

  onMounted() {
    document.title = name;
  }

  //---------------------------------------------------------------------------
  // PRIVATE
  //---------------------------------------------------------------------------

  applyFavorite({ detail }: OwlEvent<DropdownItem>): void {
    this.state.query = detail.value;
    this.state.ext = detail.badge
      ? (detail.badge.toLowerCase() as Extension)
      : "all";
    this.search();
  }

  applyMutations(): void {
    if (!this.previewCanvasRef.el || !this.activeImage) {
      return;
    }
    if (this.imageStates[this.activeImage.src]?.mutations.length) {
      const imageState = this.imageStates[this.activeImage.src];
      const canvas = this.previewCanvasRef.el as HTMLCanvasElement;
      const { width, height } = canvas;
      const ctx = canvas.getContext("2d")!;

      // Draw initial image
      ctx.drawImage(this.activeImage, 0, 0);
      imageState.imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageState.imageData.data;

      for (const { tool, args } of imageState.mutations) {
        switch (tool) {
          case "backgroundEraser": {
            const tolerance = this.getImageParam("tolerance");
            floodFillPixels(pixels, width, args, tolerance);
            break;
          }
          case "brush": {
            const radius = this.getImageParam("radius");
            drawDot(pixels, width, args, radius);
          }
        }
      }
    } else {
      delete this.imageStates[this.activeImage.src].imageData;
    }
    this.forceUpdate(true);
  }

  applySearchExtension({ detail }: OwlEvent<DropdownItem>): void {
    this.state.ext = detail.id as Extension;
  }

  clearFavorites(): void {
    this.favoritesManager.clear();
    this.state.query = "";
    this.forceUpdate();
  }

  closeSettings() {
    if (!this.modalManager.value) {
      return;
    }
    this.modalManager.value = null;
    this.forceUpdate(true);
  }

  configGet(key: string) {
    return configManager.get(key);
  }

  async copyActiveImage(): Promise<void> {
    const img = this.activeImage;
    if (!img || !this.hasClipboardAccess) {
      return;
    }
    if (!this.isActiveImageEditable()) {
      return this.copyActiveImageUrl();
    }
    if (!this.previewCanvasRef.el) {
      return;
    }
    const canvas = this.previewCanvasRef.el as HTMLCanvasElement;
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    const data = [new ClipboardItem({ "image/png": blob })];
    await navigator.clipboard.write(data);
    this.notify("Image copied!");
  }

  async copyActiveImageUrl(): Promise<void> {
    const img = this.activeImage;
    if (!img || !this.hasClipboardAccess) {
      return;
    }
    await navigator.clipboard.writeText(img.src);
    this.notify("URL copied!");
  }

  focusImage(index: number, lazy: boolean = false): void {
    if (lazy) {
      this.toFocus = index;
      return;
    }
    const images = this.el!.querySelectorAll<HTMLDivElement>(
      ".image-gallery .image-wrapper"
    );
    const target = images[index];
    if (!target) {
      return;
    }
    this.setFocusedImage(true, target);
    if (this.focusedImage) {
      target.focus();
      this.toFocus = null;
    }
  }

  focusSearchBar(): void {
    return this.searchInputRef.el?.focus();
  }

  forceUpdate(updatePreview = false): void {
    if (updatePreview) this.willUpdateCanvas = true;
    this.state.updateId++;
  }

  getActiveImageExtension(): string {
    const img = this.activeImage;
    let extension: string | null = null;
    if (img) {
      const metadata = this.state.imageMetadata[img.src];
      if (metadata?.mimetype) {
        const match = metadata.mimetype.match(IMAGE_MTYPE_RE);
        if (match && match[1] === "image") {
          extension = match[2];
        }
      }
      if (!extension) {
        extension = img.src.split(".").pop() || null;
      }
    }
    return extension || "unknown";
  }

  getActiveImageSize(): string {
    const { src } = this.activeImage!;
    const data = this.state.imageMetadata[src];
    return data ? `${data.size[0]}x${data.size[1]}` : "loading...";
  }

  getCurrentPageUrls(): string[] {
    const count = this.rows * this.cols;
    const start = this.state.pageIndex * count;
    return this.state.urls.slice(start, start + count);
  }

  getFavorites(): DropdownItem[] {
    return this.env.favorites.keys().map((favorite) => {
      let badge: string | null = null;
      const id = favorite;
      const value = favorite
        .replace(QUERY_EXTENSION_RE, (ext: string) => {
          badge = ext.toUpperCase();
          return "";
        })
        .trim();
      return { id, value, badge };
    });
  }

  getFullQuery(clean: boolean = true): string {
    let query = clean ? cleanQuery(this.state.query) : this.state.query;
    if (query && this.state.ext !== "all") {
      query += " " + this.state.ext;
    }
    return query;
  }

  getImage(target: HTMLElement | Event): HTMLImageElement | null {
    if (target instanceof Event) {
      target = target.target as HTMLElement;
    }
    if (target instanceof HTMLImageElement) {
      return target;
    } else {
      return target.querySelector<HTMLImageElement>("img");
    }
  }

  getImageParam(prop: string): number {
    const { src } = this.activeImage!;
    const { params } = this.imageStates[src];
    return (params && params[prop]) ?? this.configGet(prop);
  }

  getPagerValue(): string {
    const count = this.cols * this.rows;
    const total = this.state.urls.length;
    const startIndex = this.state.pageIndex * count;
    const endIndex = Math.min(startIndex + count, total);
    return `${startIndex + 1}-${endIndex} / ${total}`;
  }

  getSuggestions(): string[] {
    const query = cleanQuery(this.state.query);
    if (query) {
      return [
        ...new Set(searchCache.getKeys().map(cleanQuery).filter(Boolean)),
      ].filter((q) => q !== query && q.startsWith(query));
    } else {
      return [];
    }
  }

  isActiveImageEditable(): boolean {
    return EDITABLE_EXTENSIONS.includes(this.getActiveImageExtension());
  }

  notify(message: string): void {
    this.notificationManager.value = message;
    window.clearTimeout(this.notifyTimeout);
    this.notifyTimeout = window.setTimeout(() => {
      this.notificationManager.value = null;
    }, NOTIFICATION_DELAY);
  }

  onImageKeydown(index: number, ev: KeyboardEvent): void {
    const target = ev.target as HTMLDivElement;
    const total = this.rows * this.cols;
    switch (ev.key) {
      case "ArrowUp": {
        const newIndex = index - this.cols;
        if (newIndex >= 0) this.focusImage(newIndex);
        return;
      }
      case "ArrowDown": {
        const newIndex = index + this.cols;
        if (newIndex < total) this.focusImage(newIndex);
        return;
      }
      case "ArrowRight": {
        const newIndex = index + 1;
        if (newIndex < total) {
          this.focusImage(newIndex);
        } else {
          this.pageNext();
        }
        return;
      }
      case "ArrowLeft": {
        const newIndex = index - 1;
        if (newIndex >= 0) {
          this.focusImage(newIndex);
        } else {
          this.pagePrev();
        }
        return;
      }
      case "Escape": {
        target.blur();
        return;
      }
      case "c": {
        if (ev.ctrlKey) this.copyActiveImage();
        return;
      }
    }
  }

  onImageReady(
    ev: OwlEvent<{ img: HTMLImageElement; contentType: string }>
  ): void {
    const { img, contentType } = ev.detail;
    this.state.imageMetadata[img.src] = {
      size: [img.naturalWidth, img.naturalHeight],
      mimetype: contentType,
    };
  }

  onSearchKeydown(ev: KeyboardEvent): void {
    const { activeSuggestion } = this.state;
    const notNull = activeSuggestion !== null;
    switch (ev.key) {
      case "ArrowUp": {
        ev.preventDefault();
        if (notNull && activeSuggestion! > 0) {
          this.state.activeSuggestion!--;
        } else {
          this.state.activeSuggestion = this.getSuggestions().length - 1;
        }
        return;
      }
      case "ArrowDown": {
        ev.preventDefault();
        const suggestions = this.getSuggestions();
        if (notNull && activeSuggestion! < suggestions.length - 1) {
          this.state.activeSuggestion!++;
        } else {
          this.state.activeSuggestion = 0;
        }
        return;
      }
      case "Enter": {
        if (notNull) {
          const suggestion = this.getSuggestions()[activeSuggestion!];
          if (suggestion) {
            this.state.query = suggestion;
          }
        }
        this.search();
        return;
      }
      case "Escape": {
        this.state.query = "";
        return;
      }
    }
  }

  onWindowKeydown({ key, ctrlKey }: KeyboardEvent): void {
    switch (key) {
      case "F12": {
        this.env.api.send("toggle-dev-tools");
        return;
      }
      case "F5": {
        location.reload();
        return;
      }
      case "Escape": {
        this.state.showSuggestions = false;
        this.closeSettings();
        this.focusSearchBar();
        return;
      }
      case "Enter": {
        const focused = document.activeElement;
        if (
          focused === document.body || // No focus
          focused?.classList.contains("image-wrapper") // Focus on image
        ) {
          this.copyActiveImage();
        }
        return;
      }
      case "f": {
        if (ctrlKey) this.focusSearchBar();
        return;
      }
      case "I": {
        if (ctrlKey) this.env.api.send("toggle-dev-tools");
        return;
      }
      case "r": {
        if (ctrlKey) location.reload();
        return;
      }
      case "y": {
        if (ctrlKey) this.redo();
        return;
      }
      case "z": {
        if (ctrlKey) this.undo();
        return;
      }
    }
  }

  openSettings() {
    this.modalManager.value = true;
  }

  pageNext(): void {
    return this.pageSet(this.state.pageIndex + 1);
  }

  pagePrev(): void {
    return this.pageSet(this.state.pageIndex - 1, this.rows * this.cols - 1);
  }

  pageSet(pageIndex: number, focusIndex: number = 0): void {
    if (
      pageIndex < 0 ||
      pageIndex >= this.pageCount ||
      this.state.pageIndex === pageIndex
    ) {
      return;
    }
    this.state.pageIndex = pageIndex;
    this.focusImage(focusIndex, true);
  }

  range(n: number): number[] {
    return range(n);
  }

  redo() {
    historyManager.redo();
    this.applyMutations();
  }

  removeFavorite({ detail }: OwlEvent<DropdownItem>): void {
    this.favoritesManager.remove(detail.id);
    this.forceUpdate();
  }

  reset(...whiteListed: string[]): void {
    const newState = getDefaultState();
    for (const key of whiteListed) {
      delete newState[key as keyof typeof newState];
    }
    Object.assign(this.state, newState);
    this.currentSearch = "";
    if (!whiteListed.includes("urls")) {
      this.imageStates = {};
    }
    historyManager.clear();
  }

  resetPreview() {
    const imgState = this.imageStates[this.activeImage!.src];
    const { mutations } = imgState;
    delete imgState.imageData;
    historyManager.add(
      () => (imgState.mutations = []),
      () => (imgState.mutations = mutations)
    );
    this.forceUpdate(true);
  }

  async search(): Promise<void> {
    const extMatch = this.state.query.match(QUERY_EXTENSION_RE);
    if (extMatch) {
      // Applies implicit query extension
      this.state.ext = extMatch[0] as Extension;
    }
    // Cleans final query
    this.state.query = cleanQuery(this.state.query);
    const query = this.getFullQuery(false);
    if (query === this.currentSearch) {
      return;
    }
    this.reset("query", "ext");
    this.currentSearch = query;
    if (!query.length) {
      this.setUrls([]);
      return;
    }
    let result: string[] | null = null;
    let error: Error | null = null;
    this.state.searching = true;
    try {
      result = await searchCache.get(query);
    } catch (err) {
      error = err as Error;
    }
    if (query === this.currentSearch) {
      if (result) {
        this.setUrls(result);
        this.focusImage(0, true);
      } else {
        throw error;
      }
      this.state.searching = false;
    }
  }

  setFocusedImage(set: boolean, target: HTMLElement | Event): void {
    this.focusedImage = set ? this.getImage(target) : null;
    this.forceUpdate(true);
  }

  setImageParam(prop: string, ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const { src } = this.activeImage!;
    const params = this.imageStates[src].params || {};
    params[prop] = input.value;
    this.imageStates[src].params = params;
    this.applyMutations();
  }

  setHoveredImage(set: boolean, target: HTMLElement | Event): void {
    this.hoveredImage = set ? this.getImage(target) : null;
    this.forceUpdate(true);
  }

  setUrls(urls: string[]): void {
    this.state.urls = urls;
    this.imageStates = {};
    historyManager.clear();
    for (const url of urls) {
      this.imageStates[url] = { mutations: [] };
    }
  }

  toggleFavorite() {
    const query = this.currentSearch;
    if (!this.favoritesManager.remove(query)) {
      this.favoritesManager.set(query, this.state.urls);
    }
    this.forceUpdate();
  }

  undo() {
    historyManager.undo();
    this.applyMutations();
  }
}
