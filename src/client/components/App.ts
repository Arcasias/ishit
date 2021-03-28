import { Component, hooks, tags } from "@odoo/owl";
import { getGoogleImageUrl, log, range } from "../../common/utils";
import { electronPublicApi } from "../../electron/preload";
import Cache from "../classes/Cache";
import ImageComponent from "./ImageComponent";

declare const electron: typeof electronPublicApi;

type Extension = "all" | "gif" | "png" | "jpg" | "jpeg";

const { xml: html, css } = tags;
const { useExternalListener, useRef, useState } = hooks;

const IMAGE_COLS = 5;
const IMAGE_ROWS = 5;
const IMAGE_URL_RE = /"https?:\/\/[\w\/\.-]+\.(png|jpg|jpeg|gif)"/g;
const HIGHTLIGHT_COLOR = "#ff0080";

function getDefaultConfig() {
  return {
    downloadPath: <string | null>null,
  };
}

function getDefaultState() {
  return {
    urls: <string[]>[],
    query: <string>"",
    ext: <Extension>"all",
    hoveredImage: <string | null>null,
    focusedImage: <string | null>null,
    pageIndex: <number>0,
    imageInfos: <{ [url: string]: string | null }>{},
    settingsOpen: <boolean>false,
  };
}

export default class App extends Component {
  static components = { ImageComponent };

  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <div class="app container-fluid">
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
                    t-model="config.downloadPath"
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
            />
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
      <div class="row">
        <div class="col">
          <ul class="pagination">
            <li class="page-item" t-on-click.prevent="pagePrev()">
              <button class="page-link" t-att-disabled="state.pageIndex lte 0">
                Previous
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
                Next
              </button>
            </li>
          </ul>
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
              t-on-click="copyUrl(url)"
              t-on-keydown="onImageKeydown(url_index)"
            >
              <ImageComponent src="url" t-on-load.stop="onImageLoad" />
            </div>
          </div>
        </div>
        <div class="col pl-0">
          <div class="preview mr-0" t-if="activeImage">
            <div class="image-wrapper">
              <ImageComponent src="activeImage" />
            </div>
            <nav class="nav">
              <li class="nav-item">
                <a
                  class="nav-link btn-outline-primary"
                  t-att-href="activeImage"
                  download="download"
                >
                  <i class="fas fa-download"></i>
                </a>
              </li>
              <li class="nav-item">
                <div
                  class="nav-link"
                  t-esc="state.imageInfos[activeImage]"
                ></div>
              </li>
            </nav>
          </div>
          <div t-elif="!state.urls.length" class="no-preview text-muted">
            Search images in the search bar above
          </div>
        </div>
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

    .preview .image-wrapper {
      max-height: 80vh;
      overflow-y: auto;
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

    .no-preview {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-style: italic;
    }
  `;

  //---------------------------------------------------------------------------
  // PROPERTIES
  //---------------------------------------------------------------------------

  public config = useState(getDefaultConfig());
  public state = useState(getDefaultState());

  private currentSearchId = 0;
  private hasClipboardAccess = false;
  private toFocus: number | null = null;
  private searchCache = new Cache("urls", (key) => this.fetchUrls(key));
  private searchInputRef = useRef("search-input");

  private cols: number = IMAGE_COLS;
  private rows: number = IMAGE_ROWS;
  private exts: Extension[] = ["all", "gif", "png", "jpg", "jpeg"];

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
    // Load search cache
    this.searchCache.load();
    // Load config
    const config = localStorage.getItem("config");
    if (!config) {
      this.updateConfig();
    } else {
      const entries = JSON.parse(config);
      Object.assign(this.config, Object.fromEntries(entries));
      electron.send("set-download-path", this.config.downloadPath);
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

  private async copyUrl(url: string): Promise<void> {
    if (url && this.hasClipboardAccess) {
      await navigator.clipboard.writeText(url);
    }
  }

  private async fetchUrls(query: string): Promise<string[] | false> {
    const searchId = ++this.currentSearchId;
    const queryStepTimings: number[] = [];
    log(`Search query {{#ff0080}}${searchId}{{inherit}} started.`);

    // Query
    const queryTime = Date.now();
    const response = await fetch(getGoogleImageUrl(query));
    queryStepTimings.push(Date.now() - queryTime);

    if (this.currentSearchId !== searchId) return false;

    // Stringifying
    const parsingTime = Date.now();
    const textResponse = await response.text();
    queryStepTimings.push(Date.now() - parsingTime);

    if (this.currentSearchId !== searchId) return false;

    // Extracting
    const extractionTime = Date.now();
    const matches = textResponse.match(IMAGE_URL_RE) || [];
    queryStepTimings.push(Date.now() - extractionTime);

    log(
      [
        `Search query {{#ff0080}}${searchId}{{inherit}}: "${query}" finished for a total of ${matches.length} results.`,
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
    this.setFocusedImage(true, { target });
    if (this.state.focusedImage) {
      target.focus();
      this.copyUrl(this.state.focusedImage);
      return;
    } else {
      return;
    }
  }

  private focusSearchBar(): void {
    return this.searchInputRef.el?.focus();
  }

  private getCurrentPageUrls(): string[] {
    const count = this.rows * this.cols;
    const start = this.state.pageIndex * count;
    return this.state.urls.slice(start, start + count);
  }

  private getImageSrc(target: HTMLDivElement): string | null {
    let img: HTMLImageElement | null;
    if (target instanceof HTMLImageElement) {
      img = target;
    } else {
      img = target.querySelector<HTMLImageElement>("img");
    }
    return img && img.src;
  }

  private onDownloadPathChanged(): void {
    this.updateConfig();
    electron.send("set-download-path", this.config.downloadPath);
  }

  private onImageKeydown(index: number, ev: KeyboardEvent): void {
    const target = ev.target as HTMLDivElement;
    const total = this.rows * this.cols;
    switch (ev.key) {
      case "ArrowUp": {
        const newIndex = index - this.cols;
        if (newIndex >= 0) this.focusImage(newIndex);
        break;
      }
      case "ArrowDown": {
        const newIndex = index + this.cols;
        if (newIndex < total) this.focusImage(newIndex);
        break;
      }
      case "ArrowRight": {
        const newIndex = index + 1;
        if (newIndex < total) {
          this.focusImage(newIndex);
        } else {
          this.pageNext();
        }
        break;
      }
      case "ArrowLeft": {
        const newIndex = index - 1;
        if (newIndex >= 0) {
          this.focusImage(newIndex);
        } else {
          this.pagePrev();
        }
        break;
      }
      case "Escape": {
        target.blur();
        break;
      }
    }
  }

  private onImageLoad(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    this.state.imageInfos[
      img.src
    ] = `Size: ${img.naturalWidth}x${img.naturalHeight}`;
  }

  private onWindowKeydown({ key, ctrlKey, shiftKey }: KeyboardEvent): void {
    switch (key) {
      case "F12": {
        electron.send("toggle-dev-tools");
        return;
      }
      case "F5": {
        location.reload();
        return;
      }
      case "Escape": {
        this.state.settingsOpen = false;
        this.focusSearchBar();
        return;
      }
      case "F": {
        if (ctrlKey) this.focusSearchBar();
        return;
      }
      case "I": {
        if (ctrlKey && shiftKey) electron.send("toggle-dev-tools");
        return;
      }
      case "R": {
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

  private reset(...whiteListed: string[]): void {
    if (!whiteListed.includes("currentSearchId")) {
      this.currentSearchId = 0;
    }
    const newState = getDefaultState();
    for (const key of whiteListed) {
      delete newState[key as keyof typeof newState];
    }
    Object.assign(this.state, newState);
  }

  private async search(): Promise<void> {
    this.reset("query", "ext");
    const { ext, query } = this.state;
    let finalQuery = query;
    if (ext !== "all" && !new RegExp(ext).test(finalQuery)) {
      finalQuery += " " + ext;
    }
    const result = await this.searchCache.get(finalQuery);
    if (result === false) {
      this.searchCache.invalidate(finalQuery);
    } else {
      this.state.urls = result;
      this.focusImage(0, true);
    }
  }

  private setFocusedImage(
    set: boolean,
    { target }: { target: HTMLDivElement }
  ): void {
    this.state.focusedImage = set ? this.getImageSrc(target) : null;
  }

  private setHoveredImage(
    set: boolean,
    { target }: { target: HTMLDivElement }
  ): void {
    this.state.hoveredImage = set ? this.getImageSrc(target) : null;
  }

  private updateConfig(): void {
    const entries = Object.entries(this.config);
    localStorage.setItem("config", JSON.stringify(entries));
  }
}
