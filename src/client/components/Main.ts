import { Component, hooks, tags } from "@odoo/owl";
import { OwlEvent } from "@odoo/owl/dist/types/core/owl_event";
import { drawDot, floodFillPixels, range } from "../../common/utils";
import { Environment } from "../services/Environment";
import { DropdownItem } from "./Dropdown";
import { ImageComponent } from "./ImageComponent";

type Extension = "all" | "gif" | "png";
type EditorTool = "backgroundEraser" | "crop" | "brush";

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
const URL_PREFIX = "https://";
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

const useCustomStyle = (
  refString: string,
  calcStyle: (el: HTMLElement) => string
): void => {
  const ref = useRef(refString);
  let isStyleApplied: boolean = false;
  let style: string | null = null;

  const applyStyle = () => {
    if (isStyleApplied && !ref.el) {
      isStyleApplied = false;
    } else if (!isStyleApplied && ref.el) {
      isStyleApplied = true;
      if (!style) style = calcStyle(ref.el);
      ref.el.setAttribute("style", style);
    }
  };

  hooks.onMounted(applyStyle);
  hooks.onPatched(applyStyle);

  let resizeTimeout: number = 0;
  useExternalListener(window, "resize", () => {
    style = null;
    isStyleApplied = false;
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(applyStyle, 250);
  });
};

export class Main extends Component<{}, Environment> {
  //---------------------------------------------------------------------------
  // PROPS / COMPONENTS
  //---------------------------------------------------------------------------
  static components = { ImageComponent };
  static props = {};

  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <div class="Main">
      <main class="main container-fluid">
        <t t-if="state.urls.length">
          <section class="col me-2">
            <nav class="pager nav mb-2">
              <ul class="pagination m-0 me-auto">
                <li class="page-item" t-on-click.prevent="pagePrev()">
                  <button
                    class="page-link"
                    t-att-disabled="state.pageIndex lte 0"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                <li
                  t-foreach="range(pageCount)"
                  t-as="page"
                  t-key="page"
                  class="page-item"
                  t-att-class="{ active: state.pageIndex === page }"
                  t-on-click.prevent="pageSet(page)"
                >
                  <button class="page-link" t-esc="page + 1"></button>
                </li>
                <li class="page-item" t-on-click.prevent="pageNext">
                  <button
                    class="page-link"
                    t-att-disabled="state.pageIndex gte pageCount - 1"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
              <span
                class="input-group-text ms-auto"
                t-esc="getPagerValue()"
              ></span>
            </nav>
            <ul class="image-gallery" t-ref="image-gallery">
              <li
                t-foreach="getCurrentPageUrls()"
                t-as="url"
                t-key="url_index"
                class="image-wrapper"
                tabindex="1"
                t-att-class="{ empty: !url, selected: focusedImage and focusedImage.src === url }"
                t-on-mouseenter="setHoveredImage(true)"
                t-on-mouseleave="setHoveredImage(false)"
                t-on-focus="setFocusedImage(true)"
                t-on-click="copyActiveImage"
                t-on-keydown="onImageKeydown(url_index)"
              >
                <ImageComponent src="url" onReady="onImageReady" />
              </li>
            </ul>
          </section>
          <section class="col">
            <div
              class="preview me-0"
              t-if="activeImage"
              t-on-mouseenter="state.showImageOptions = true"
              t-on-mouseleave="state.showImageOptions = false"
            >
              <div class="image-preview" t-ref="image-preview">
                <canvas
                  t-if="isActiveImageEditable()"
                  t-ref="preview-canvas"
                  t-on-click="editPreview"
                ></canvas>
                <ImageComponent
                  t-else=""
                  src="activeImage.src"
                  alt="'Image preview'"
                  preload="false"
                />
              </div>
              <div class="preview-top">
                <div
                  t-if="state.showImageOptions"
                  class="image-actions btn-group"
                >
                  <a
                    class="btn btn-outline-primary bg-white"
                    title="Download"
                    download="download"
                    t-att-href="activeImage.src"
                    ><i class="fas fa-download"></i
                  ></a>
                  <button
                    class="btn btn-outline-primary bg-white"
                    title="Copy image"
                    t-on-click="copyActiveImage"
                  >
                    <i class="fas fa-copy"></i>
                  </button>
                  <button
                    class="btn btn-outline-primary bg-white"
                    title="Copy URL"
                    t-on-click="copyActiveImageUrl"
                  >
                    <i class="fas fa-code"></i>
                  </button>
                </div>
                <div class="image-badges ms-auto">
                  <span
                    class="badge border border-primary text-secondary bg-white me-2"
                    t-esc="getActiveImageSize()"
                  ></span>
                  <span
                    class="badge border border-primary text-secondary bg-white"
                    t-esc="getActiveImageExtension().toUpperCase()"
                  ></span>
                </div>
              </div>
              <div t-if="state.showImageOptions" class="preview-bottom mb-3">
                <div
                  t-if="state.editorTool === 'backgroundEraser'"
                  class="input-group"
                >
                  <div class="form-control">
                    <input
                      type="range"
                      class="form-range h-100"
                      title="Tolerance"
                      min="configGet('tolerance').min"
                      max="configGet('tolerance').max"
                      step="1"
                      t-att-value="getImageParam('tolerance')"
                      t-on-change="setImageParam('tolerance')"
                    />
                  </div>
                </div>
                <div t-elif="state.editorTool === 'brush'" class="input-group">
                  <div class="form-control">
                    <input
                      type="range"
                      class="form-range h-100"
                      title="Radius"
                      min="configGet('radius').min"
                      max="configGet('radius').max"
                      step="1"
                      t-att-value="getImageParam('radius')"
                      t-on-change="setImageParam('radius')"
                    />
                  </div>
                </div>
              </div>
              <div class="preview-left">
                <div
                  t-if="state.showImageOptions and isActiveImageEditable()"
                  class="image-tools btn-group-vertical"
                >
                  <button
                    t-attf-class="btn {{ state.editorTool === 'brush' ? 'btn-primary' : 'btn-outline-primary bg-white' }}"
                    title="Paint"
                    t-on-click="state.editorTool = 'brush'"
                  >
                    <i class="fas fa-paint-brush"></i>
                  </button>
                  <button
                    t-attf-class="btn {{ state.editorTool === 'backgroundEraser' ? 'btn-primary' : 'btn-outline-primary bg-white' }}"
                    title="Background eraser"
                    t-on-click="state.editorTool = 'backgroundEraser'"
                  >
                    <i class="fas fa-magic"></i>
                  </button>
                  <button
                    t-attf-class="btn {{ state.editorTool === 'crop' ? 'btn-primary' : 'btn-outline-primary bg-white' }}"
                    title="Crop image"
                    t-on-click="state.editorTool = 'crop'"
                  >
                    <i class="fas fa-crop"></i>
                  </button>
                  <button
                    class="btn btn-outline-primary bg-white"
                    title="Reset image"
                    t-on-click="resetPreview"
                  >
                    <i class="fas fa-redo"></i>
                  </button>
                </div>
              </div>
            </div>
            <div t-else="" class="default-message">
              <span class="message text-muted">Source unavailable</span>
            </div>
          </section>
        </t>
        <div t-elif="state.searching" class="default-message">
          <span class="message text-muted">Searching ...</span>
        </div>
        <div t-else="" class="default-message">
          <span class="message text-muted me-3">No images to display</span>
        </div>
      </main>
    </div>
  `;

  //---------------------------------------------------------------------------
  // STYLE
  //---------------------------------------------------------------------------
  static style = css``;

  //---------------------------------------------------------------------------
  // PROPERTIES
  //---------------------------------------------------------------------------

  state = useState(getDefaultState());

  currentSearch: string = "";
  favoritesManager = new StorageManager<string[]>("fav", {
    parse: (urls) => urls.split(",").map((u) => URL_PREFIX + u),
    serialize: (urls) => urls.map((u) => u.slice(URL_PREFIX.length)).join(","),
  });
  focusedImage: HTMLImageElement | null = null;
  hasClipboardAccess = false;
  hoveredImage: HTMLImageElement | null = null;
  imageStates: { [url: string]: ImageState } = {};
  imageMimeTypes: { [url: string]: string | null } = {};
  notifyTimeout: number = 0;
  toFocus: number | null = null;
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
    useCustomStyle("image-gallery", (el) => {
      const { x, y } = el.getBoundingClientRect();
      return `height: ${window.innerHeight - y - x}px;`;
    });
    useCustomStyle("image-preview", (el) => {
      const { x, y, width } = el.getBoundingClientRect();
      const padding = window.innerWidth - x - width;
      return `height: ${window.innerHeight - y - padding}px;`;
    });

    onPatched(() => this.onPatched());
  }

  onPatched() {
    const img = this.activeImage;
    if (this.willUpdateCanvas && img && this.previewCanvasRef.el) {
      this.willUpdateCanvas = false;
      if (img.complete) {
        this.drawPreview();
      } else {
        img.addEventListener("load", () => this.drawPreview(), { once: true });
      }
    }
    if (this.toFocus !== null) {
      this.focusImage(this.toFocus);
    }
  }

  //---------------------------------------------------------------------------
  // PRIVATE
  //---------------------------------------------------------------------------

  applyMutations(): void {
    if (!this.previewCanvasRef.el || !this.activeImage) return;
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

  configGet(key: string) {
    return configManager.get(key);
  }

  async copyActiveImage(): Promise<void> {
    const img = this.activeImage;
    if (!img || !this.hasClipboardAccess) return;
    if (!this.isActiveImageEditable()) {
      return this.copyActiveImageUrl();
    }
    if (!this.previewCanvasRef.el) return;
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
    if (!img || !this.hasClipboardAccess) return;
    await navigator.clipboard.writeText(img.src);
    this.notify("URL copied!");
  }

  drawPreview(): void {
    const img = this.activeImage;
    const canvas = this.previewCanvasRef.el as HTMLCanvasElement;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    const imageState = this.imageStates[img.src];
    if (imageState?.imageData) {
      ctx.putImageData(imageState.imageData, 0, 0);
    } else {
      ctx.drawImage(img, 0, 0);
    }
  }

  editPreview(ev: MouseEvent) {
    if (this.state.editorTool === null) return;
    const canvas = ev.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const img = this.activeImage!;

    const ratioX = img.naturalWidth / rect.width;
    const ratioY = img.naturalHeight / rect.height;

    const x = Math.floor((ev.clientX - rect.x) * ratioX);
    const y = Math.floor((ev.clientY - rect.y) * ratioY);

    const state = this.imageStates[img.src];
    const mutation: ImageMutation = {
      tool: this.state.editorTool,
      args: [x, y],
    };
    historyManager.add(
      () => state.mutations.push(mutation),
      () => state.mutations.pop()
    );
    this.applyMutations();
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
    if (!target) return;
    this.setFocusedImage(true, target);
    if (this.focusedImage) {
      target.focus();
      this.toFocus = null;
    }
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
