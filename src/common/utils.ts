import { IpcRendererEvent } from "electron";

interface AjaxOptions {
  method?: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  type?: XMLHttpRequestResponseType;
}

export async function ajax(
  url: string,
  options: AjaxOptions = {}
): Promise<XMLHttpRequest> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = options.type ?? "json";
    xhr.onload = () => resolve(xhr);
    xhr.onerror = () => reject(xhr);
    xhr.open(options.method ?? "GET", url);
    xhr.send();
  });
}

export function fullFillPixels(
  pixels: Uint8ClampedArray,
  start: number,
  [tr, tg, tb]: [number, number, number],
  threshold: number
): void {
  const t = threshold / 2;
  const [trl, trg] = [tr - t, tr + t];
  const [tbl, tbg] = [tb - t, tb + t];
  const [tgl, tgg] = [tg - t, tg + t];
  for (let n = start; n < pixels.length; n += 4) {
    if (
      pixels[n + 3] &&
      pixels[n] > trl &&
      pixels[n] <= trg &&
      pixels[n + 1] > tgl &&
      pixels[n + 1] <= tgg &&
      pixels[n + 2] > tbl &&
      pixels[n + 2] <= tbg
    ) {
      pixels[n + 3] = 0; // Set transparency to 0
    }
  }
}

export function floodFillPixels(
  pixels: Uint8ClampedArray,
  start: number,
  width: number,
  [tr, tg, tb]: [number, number, number],
  threshold: number
): void {
  const q: number[] = [start];
  const t = threshold / 2;
  const [trl, trg] = [tr - t, tr + t];
  const [tbl, tbg] = [tb - t, tb + t];
  const [tgl, tgg] = [tg - t, tg + t];
  while (q.length) {
    const n: number = q.shift()!;
    if (
      pixels[n + 3] &&
      pixels[n] > trl &&
      pixels[n] <= trg &&
      pixels[n + 1] > tgl &&
      pixels[n + 1] <= tgg &&
      pixels[n + 2] > tbl &&
      pixels[n + 2] <= tbg
    ) {
      pixels[n + 3] = 0; // Set transparency to 0
      q.push(
        n + 4, // right
        n - 4, // left
        n + width * 4, // down
        n - width * 4 // up
      );
    }
  }
}

export function getGoogleImageUrl(query: string): string {
  const formatted = query.replace(/\s+/g, "+");
  return `https://www.google.com/search?q=${formatted}&tbm=isch`;
}

export function ipcMainLog(...message: string[]): void {
  log(`{{#6610f2}}[IPC-MAIN]{{inherit}}`, ...message);
}

export function ipcRendererLog(...message: string[]): void {
  log(`{{#007bff}}[IPC-RENDERER]{{inherit}}`, ...message);
}

export function log(...message: string[]): void {
  const styles: string[] = [];
  const msg = message
    .join(" ")
    .replace(/\{\{([\w\s#\(\),)]+)\}\}/g, (_, color) => {
      styles.push(`color:${color}`);
      return "%c";
    });
  console.log(msg, ...styles);
}

export function range(n: number): number[] {
  return [...new Array(n)].map((_, i) => i);
}

export interface APIBridge {
  send: (channel: string, ...args: any[]) => void;
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => Electron.IpcRenderer;
}
