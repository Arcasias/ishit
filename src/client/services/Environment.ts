import { browser, QWeb } from "@odoo/owl";
import { Browser } from "@odoo/owl/dist/types/browser";
import { Env } from "@odoo/owl/dist/types/component/component";
import { ajax, APIBridge, getGoogleImageUrl, log } from "../../common/utils";
import { makeModalManager } from "../components/Modal";
import { makeCache } from "./cache";
import { makeClipboard } from "./clipboard";
import { makeHistoryManager } from "./history";
import { makeStorageManager } from "./storage";

const { electron } = window as any;

const IMAGE_URL_RE = /"https:\/\/[\w\/\.-]+\.(png|jpg|jpeg|gif)"/gi;
const URL_PREFIX = "https://";

const fetchUrls = async (query: string): Promise<string[]> => {
  const startTime = Date.now();
  const url = getGoogleImageUrl(query);
  const { response } = await ajax(url, { type: "text" });
  const matches: string[] = response.match(IMAGE_URL_RE) || [];
  const endTime = Date.now() - startTime;
  log(
    `Search query {{#00d000}}"${query}"{{inherit}} finished for a total of ${matches.length} results in {{#ff0080}}${endTime}{{inherit}}ms`
  );
  return matches.map((m) => m.slice(1, -1));
};

export class Environment implements Env {
  api: APIBridge = electron ?? {
    send() {},
    on(): any {},
    isDev: false,
  };
  isDesktop: boolean = Boolean(electron);
  searchCache = makeCache((key) => fetchUrls(key));
  history = makeHistoryManager(100);
  favorites = makeStorageManager<string[]>("fav", {
    parse: (urls) => urls.split(",").map((u) => URL_PREFIX + u),
    serialize: (urls) => urls.map((u) => u.slice(URL_PREFIX.length)).join(","),
  });
  clipboard = makeClipboard();
  config = makeStorageManager<any>("cfg");
  qweb: QWeb = new QWeb();
  modal = makeModalManager();
  browser: Browser = browser;

  async start() {
    const [favorites] = await Promise.all([
      this.favorites.load(),
      this.config.load(),
      this.clipboard.load(),
    ]);
    await this.searchCache.load(favorites);
  }
}
