import { Component, hooks, tags } from "@odoo/owl";
import { OwlEvent } from "@odoo/owl/dist/types/core/owl_event";
import { getApi, getGoogleImageUrl, log, range } from "../../common/utils";
import Cache from "../classes/Cache";
import { StorageManager } from "../classes/StorageManager";
import Dropdown, { DropdownItem } from "./DropdownComponent";
import ImageComponent from "./ImageComponent";

type Extension = "all" | "gif" | "png";

const api = getApi(window as any);
const { xml: html, css } = tags;
const { useExternalListener, useRef, useState } = hooks;

const IMAGE_COLS = 5;
const IMAGE_ROWS = 5;
const IMAGE_URL_RE = /"https:\/\/[\w\/\.-]+\.(png|jpg|jpeg|gif)"/g;
const EXTENSION_RE = /\b(gif|png)\b/g;
const HIGHTLIGHT_COLOR = "#ff0080";
const URL_PREFIX = "https://";

function cleanQuery(query: string): string {
  return query
    .replace(EXTENSION_RE, "")
    .replace(/['"\<\>]+/g, "") // removes invalid characters
    .replace(/[\s\n_-]+/g, " ") // unifies white spaces
    .trim()
    .toLowerCase();
}

function getDefaultState() {
  return {
    activeSuggestion: <number | null>null,
    ext: <Extension>"all",
    focusedImage: <string | null>null,
    hoveredImage: <string | null>null,
    imageSizes: <{ [url: string]: number[] | null }>{},
    pageIndex: <number>0,
    query: <string>"",
    searching: <boolean>false,
    settingsOpen: <boolean>false,
    showSuggestions: <boolean>false,
    updateId: <number>0,
    urls: <string[]>[],
  };
}

export default class App extends Component {
  static components = { ImageComponent, Dropdown };

  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <div class="app container-fluid">
      <t t-set="favorites" t-value="getFavorites()" />
      <t t-if="state.settingsOpen">
        <div class="modal-backdrop show"></div>
        <div class="modal" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Settings</h5>
                <button
                  type="button"
                  class="close"
                  t-on-click="state.settingsOpen = false"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">Download path</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    t-on-change="onDownloadPathChanged"
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  t-on-click="state.settingsOpen = false"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </t>
      <nav class="navbar my-3">
        <h1 class="navbar-brand m-0">
          <span class="text-primary">i</span>mage
          <span class="text-primary">S</span>earch from
          <span class="text-primary">H</span>uman
          <span class="text-primary">I</span>nput
          <span class="text-primary">T</span>ext
        </h1>
        <form class="form-inline ml-auto mr-3" t-on-submit.prevent="search">
          <select class="form-control text-primary mr-3" t-model="state.ext">
            <option
              t-foreach="exts"
              t-as="ext"
              t-key="ext"
              t-att-value="ext"
              t-esc="ext.toUpperCase()"
            ></option>
          </select>
          <div class="input-group">
            <input
              class="form-control search-input"
              type="text"
              placeholder="Search on Google Image"
              aria-label="Search"
              t-ref="search-input"
              t-model="state.query"
              t-on-focus="state.showSuggestions = true"
              t-on-blur="state.showSuggestions = false"
              t-on-keydown="onSearchKeydown"
            />
            <t t-set="suggestions" t-value="getSuggestions()" />
            <div
              t-if="state.showSuggestions and suggestions.length"
              class="dropdown-menu"
            >
              <a
                t-foreach="suggestions"
                t-as="query"
                t-key="query_index"
                t-att-class="{ active: state.activeSuggestion === query_index }"
                class="dropdown-item"
                href="#"
                t-esc="query"
              ></a>
            </div>
            <div class="input-group-append">
              <button class="btn btn-primary" type="submit">Search</button>
              <button class="btn text-primary" type="button" t-on-click="reset">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </form>
        <button
          type="button"
          class="btn btn-outline-primary"
          t-on-click="state.settingsOpen = true"
        >
          <i class="fas fa-cog"></i>
        </button>
      </nav>
      <div class="row" t-if="state.urls.length">
        <div class="col">
          <nav class="nav mb-3">
            <ul class="pagination m-0 mr-auto">
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
                t-on-click.prevent="pageSet(page, null)"
              >
                <button class="page-link" t-esc="page + 1"></button>
              </li>
              <li class="page-item" t-on-click.prevent="pageNext()">
                <button
                  class="page-link"
                  t-att-disabled="state.pageIndex gte pageCount - 1"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
            <button class="btn text-warning mr-2" t-on-click="toggleFavorite">
              <i
                t-if="favoritesManager.has(currentSearch)"
                class="fas fa-star"
              ></i>
              <i t-else="" class="far fa-star"></i>
            </button>
            <Dropdown
              t-if="favorites.length"
              title="'Favorites'"
              items="favorites"
              t-on-select.stop="applyFavorite"
              t-on-clear.stop="clearFavorites"
              t-on-remove.stop="removeFavorite"
            />
          </nav>
          <div class="response-wrapper">
            <div
              t-foreach="getCurrentPageUrls()"
              t-as="url"
              t-key="url_index"
              class="image-wrapper"
              tabindex="1"
              t-att-class="{ empty: !url }"
              t-on-mouseenter="setHoveredImage(true)"
              t-on-mouseleave="setHoveredImage(false)"
              t-on-focus="setFocusedImage(true)"
              t-on-click="copyImage"
              t-on-keydown="onImageKeydown(url_index)"
            >
              <ImageComponent src="url" t-on-load.stop="onImageLoad" />
            </div>
          </div>
        </div>
        <div class="col pl-0">
          <div class="preview mr-0" t-if="activeImage">
            <div class="image-wrapper">
              <ImageComponent src="activeImage" t-ref="preview-image" />
            </div>
            <div class="image-options input-group">
              <a
                class="btn btn-outline-primary mr-2"
                title="Download"
                download="download"
                t-att-href="activeImage"
                ><i class="fas fa-download"></i
              ></a>
              <button
                class="btn btn-outline-primary mr-2"
                title="Copy image"
                t-on-click="copyImage(previewImageRef.el)"
              >
                <i class="fas fa-copy"></i>
              </button>
              <button
                class="btn btn-outline-primary mr-2"
                title="Copy URL"
                t-on-click="copyUrl(activeImage)"
              >
                <i class="fas fa-code"></i>
              </button>
              <span
                class="input-group-text ml-auto"
                t-esc="getImageSize(activeImage)"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div t-elif="state.searching" class="no-urls text-muted">
        <span class="default-message">Searching ...</span>
      </div>
      <div t-else="" class="no-urls text-muted">
        <nav class="nav">
          <span class="default-message mr-3"
            >Search images in the search bar above</span
          >
          <Dropdown
            t-if="favorites.length"
            title="'Browse your favorites'"
            items="favorites"
            large="true"
            t-on-select.stop="applyFavorite"
            t-on-clear.stop="clearFavorites"
            t-on-remove.stop="removeFavorite"
          />
        </nav>
      </div>
    </div>
  `;

  //---------------------------------------------------------------------------
  // STYLE
  //---------------------------------------------------------------------------
  static style = css`
    .app {
      height: 100%;

      input.search-input {
        width: 500px;
      }
    }

    .response-wrapper {
      display: grid;
      grid-template-columns: repeat(${IMAGE_COLS}, ${100 / IMAGE_COLS}%);
      grid-template-rows: repeat(${IMAGE_ROWS}, ${100 / IMAGE_ROWS}%);
      height: 83vh;
    }

    .preview {
      height: 100%;
      position: relative;

      .image-wrapper {
        max-height: 82vh;
        overflow-y: auto;
      }

      .image-options {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }

    .image-wrapper {
      outline: none;
      border: 3px solid transparent;

      &:not(.empty) {
        cursor: pointer;

        &:hover,
        &:focus {
          border-color: ${HIGHTLIGHT_COLOR};
          border-radius: 3px;
        }
      }

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    .no-urls {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .default-message {
        font-size: 2rem;
        font-style: italic;
      }
    }
  `;

  //---------------------------------------------------------------------------
  // PROPERTIES
  //---------------------------------------------------------------------------

  public state = useState(getDefaultState());

  private currentSearch: string = "";
  private favoritesManager = new StorageManager<string[]>("fav", {
    parse: (urls) => urls.split(",").map((u) => URL_PREFIX + u),
    serialize: (urls) => urls.map((u) => u.slice(URL_PREFIX.length)).join(","),
  });
  private configManager = new StorageManager<any>("cfg");
  private hasClipboardAccess = false;
  private toFocus: number | null = null;
  private searchCache = new Cache((key) => this.fetchUrls(key));
  private searchInputRef = useRef("search-input");
  private previewImageRef = useRef("preview-image");

  private cols: number = IMAGE_COLS;
  private rows: number = IMAGE_ROWS;
  private exts: Extension[] = ["all", "gif", "png"];

  private get activeImage(): string | null {
    return this.state.hoveredImage || this.state.focusedImage;
  }

  private get pageCount(): number {
    return Math.ceil(this.state.urls.length / (this.cols * this.rows));
  }

  //---------------------------------------------------------------------------
  // LIFECYCLE
  //---------------------------------------------------------------------------

  constructor() {
    super(...arguments);
    useExternalListener(window, "keydown", this.onWindowKeydown, true);
  }

  public async willStart() {
    // Load favorites
    const favorites = this.favoritesManager.load();
    // Load search cache
    this.searchCache.load(favorites);
    // Load config
    this.configManager.load();
    const downloadPath = this.configManager.get("downloadPath");
    if (downloadPath) {
      api.send("set-download-path", downloadPath);
    }
    // Fetch clipboard permissions
    const status = await navigator.permissions.query({
      name: "clipboard-write",
    });
    this.hasClipboardAccess = status.state === "granted";
  }

  public mounted() {
    this.focusSearchBar();
  }

  public patched() {
    if (this.toFocus === null) return;
    this.focusImage(this.toFocus);
    this.toFocus = null;
  }

  //---------------------------------------------------------------------------
  // PRIVATE
  //---------------------------------------------------------------------------

  private applyFavorite({ detail }: OwlEvent<DropdownItem>): void {
    this.state.query = detail.value;
    this.state.ext = detail.badge
      ? (detail.badge.toLowerCase() as Extension)
      : "all";
    this.search();
  }

  private clearFavorites(): void {
    this.favoritesManager.clear();
    this.state.query = "";
    this.forceUpdate();
  }

  private async copyImage(target: HTMLElement | Event): Promise<void> {
    const img = this.getImage(target);
    if (!img || !this.hasClipboardAccess) return;
    if (!img.complete) {
      img.addEventListener("load", () => this.copyImage(img), { once: true });
      return;
    }
    if (img.src.endsWith("gif")) {
      return this.copyUrl(img.src);
    }
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    const data = [new ClipboardItem({ "image/png": blob })];
    await navigator.clipboard.write(data);
  }

  private async copyUrl(url: string | null): Promise<void> {
    if (!url || !this.hasClipboardAccess) return;
    await navigator.clipboard.writeText(url);
  }

  private async fetchUrls(query: string): Promise<string[]> {
    const queryStepTimings: number[] = [];
    log(`Search query started.`);

    // Query
    const queryTime = Date.now();
    const response = await fetch(getGoogleImageUrl(query));
    queryStepTimings.push(Date.now() - queryTime);

    // Stringifying
    const parsingTime = Date.now();
    const textResponse = await response.text();
    queryStepTimings.push(Date.now() - parsingTime);

    // Extracting
    const extractionTime = Date.now();
    const matches = textResponse.match(IMAGE_URL_RE) || [];
    queryStepTimings.push(Date.now() - extractionTime);

    log(
      [
        `Search query "${query}" finished for a total of ${matches.length} results.`,
        `{{#00d000}}>{{inherit}} URL loading took {{#ff0080}}${queryStepTimings.shift()}{{inherit}}ms`,
        `{{#00d000}}>{{inherit}} Response stringifying took {{#ff0080}}${queryStepTimings.shift()}{{inherit}}ms`,
        `{{#00d000}}>{{inherit}} Image URLs extraction took {{#ff0080}}${queryStepTimings.shift()}{{inherit}}ms`,
      ].join("\n")
    );

    return matches.map((m) => m.slice(1, -1));
  }

  private focusImage(index: number, lazy: boolean = false): void {
    if (lazy) {
      this.toFocus = index;
      return;
    }
    const images = this.el!.querySelectorAll<HTMLDivElement>(
      ".response-wrapper .image-wrapper"
    );
    const target = images[index];
    if (!target) return;
    this.setFocusedImage(true, target);
    if (this.state.focusedImage) {
      target.focus();
      this.copyImage(target);
      return;
    } else {
      return;
    }
  }

  private focusSearchBar(): void {
    return this.searchInputRef.el?.focus();
  }

  private forceUpdate(): void {
    this.state.updateId++;
  }

  private getCurrentPageUrls(): string[] {
    const count = this.rows * this.cols;
    const start = this.state.pageIndex * count;
    return this.state.urls.slice(start, start + count);
  }

  private getFavorites(): DropdownItem[] {
    return this.favoritesManager.keys().map((favorite) => {
      let badge: string | null = null;
      const id = favorite;
      const value = favorite
        .replace(EXTENSION_RE, (ext: string) => {
          badge = ext.toUpperCase();
          return "";
        })
        .trim();
      return { id, value, badge };
    });
  }

  private getFullQuery(): string {
    const { query, ext } = this.state;
    let cleanedQuery = cleanQuery(query);
    if (!cleanedQuery) return "";
    if (ext !== "all") cleanedQuery += " " + ext;
    return cleanedQuery;
  }

  private getImage(target: HTMLElement | Event): HTMLImageElement | null {
    if (target instanceof Event) {
      target = target.target as HTMLElement;
    }
    if (target instanceof HTMLImageElement) {
      return target;
    } else {
      return target.querySelector<HTMLImageElement>("img");
    }
  }

  private getImageSize(url: string): string {
    const size = this.state.imageSizes[url];
    return size ? `${size[0]}x${size[1]}` : "loading...";
  }

  private getSuggestions(): string[] {
    const query = cleanQuery(this.state.query);
    if (query) {
      return [
        ...new Set(this.searchCache.getKeys().map(cleanQuery).filter(Boolean)),
      ].filter((q) => q !== query && q.startsWith(query));
    } else {
      return [];
    }
  }

  private onDownloadPathChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const downloadPath = target.value.replace(/['"]+/g, "").trim();
    target.value = downloadPath;
    this.configManager.set("downloadPath", downloadPath);
    api.send("set-download-path", downloadPath);
  }

  private onImageKeydown(index: number, ev: KeyboardEvent): void {
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
        if (ev.ctrlKey) this.copyImage(target);
        return;
      }
    }
  }

  private onImageLoad(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    this.state.imageSizes[img.src] = [img.naturalWidth, img.naturalHeight];
  }

  private onSearchKeydown(ev: KeyboardEvent): void {
    const { activeSuggestion } = this.state;
    const isNull = activeSuggestion === null;
    switch (ev.key) {
      case "ArrowUp": {
        ev.preventDefault();
        if (!isNull && activeSuggestion! > 0) {
          this.state.activeSuggestion!--;
        } else {
          this.state.activeSuggestion = this.getSuggestions().length - 1;
        }
        return;
      }
      case "ArrowDown": {
        ev.preventDefault();
        const suggestions = this.getSuggestions();
        if (!isNull && activeSuggestion! < suggestions.length - 1) {
          this.state.activeSuggestion!++;
        } else {
          this.state.activeSuggestion = 0;
        }
        return;
      }
      case "Enter": {
        if (isNull) return;
        const suggestion = this.getSuggestions()[activeSuggestion!];
        if (suggestion) this.state.query = suggestion;
        return;
      }
      case "Escape": {
        this.state.query = "";
        return;
      }
    }
  }

  private onWindowKeydown({ key, ctrlKey }: KeyboardEvent): void {
    switch (key) {
      case "F12": {
        api.send("toggle-dev-tools");
        return;
      }
      case "F5": {
        location.reload();
        return;
      }
      case "Escape": {
        this.state.settingsOpen = false;
        this.state.showSuggestions = false;
        this.focusSearchBar();
        return;
      }
      case "f": {
        if (ctrlKey) this.focusSearchBar();
        return;
      }
      case "I": {
        if (ctrlKey) api.send("toggle-dev-tools");
        return;
      }
      case "r": {
        if (ctrlKey) location.reload();
        return;
      }
    }
  }

  private pageNext(): void {
    return this.pageSet(this.state.pageIndex + 1);
  }

  private pagePrev(): void {
    return this.pageSet(this.state.pageIndex - 1, this.rows * this.cols - 1);
  }

  private pageSet(pageIndex: number, focusIndex: number | null = null): void {
    if (
      pageIndex < 0 ||
      pageIndex >= this.pageCount ||
      this.state.pageIndex === pageIndex
    ) {
      return;
    }
    this.state.pageIndex = pageIndex;
    this.focusImage(focusIndex ?? 0, true);
  }

  private range(n: number): number[] {
    return range(n);
  }

  private removeFavorite({ detail }: OwlEvent<DropdownItem>): void {
    this.favoritesManager.remove(detail.id);
    this.forceUpdate();
  }

  private reset(...whiteListed: string[]): void {
    const newState = getDefaultState();
    for (const key of whiteListed) {
      delete newState[key as keyof typeof newState];
    }
    Object.assign(this.state, newState);
  }

  private async search(): Promise<void> {
    this.reset("query", "ext");
    const query = this.getFullQuery();
    this.currentSearch = query;
    if (!query) {
      this.state.urls = [];
      return;
    }
    let result: string[] | null = null;
    let error: Error | null = null;
    this.state.searching = true;
    try {
      result = await this.searchCache.get(query);
    } catch (err) {
      error = err;
    }
    if (query === this.currentSearch) {
      if (result) {
        this.state.urls = result;
        this.focusImage(0, true);
      } else {
        throw error;
      }
      this.state.searching = false;
    }
  }

  private setFocusedImage(set: boolean, target: HTMLElement | Event): void {
    this.state.focusedImage = set ? this.getImage(target)?.src! : null;
  }

  private setHoveredImage(set: boolean, target: HTMLElement | Event): void {
    this.state.hoveredImage = set ? this.getImage(target)?.src! : null;
  }

  private toggleFavorite() {
    const query = this.currentSearch;
    if (!this.favoritesManager.remove(query)) {
      this.favoritesManager.set(query, this.state.urls);
    }
    this.forceUpdate();
  }
}
