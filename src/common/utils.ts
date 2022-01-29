import { IpcRendererEvent } from "electron";

interface AjaxOptions {
  method?: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  type?: XMLHttpRequestResponseType;
}

export interface APIBridge {
  send: (channel: string, ...args: any[]) => void;
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => Electron.IpcRenderer;
  isDev: boolean;
}

export const ajax = async (
  url: string,
  options: AjaxOptions = {}
): Promise<XMLHttpRequest> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = options.type ?? "json";
    xhr.onload = () => resolve(xhr);
    xhr.onerror = () => reject(xhr);
    xhr.open(options.method ?? "GET", url);
    xhr.send();
  });
};

export const drawDot = (
  pixels: Uint8ClampedArray,
  width: number,
  [ox, oy]: [number, number],
  r: number
) => {
  for (let y = -r; y < r; y++) {
    let height = Math.sqrt(r * r - y * y);
    for (let x = Math.round(-height); x < height; x++) {
      const n = (oy + y) * width * 4 + (ox + x) * 4;
      pixels[n] = 255;
      pixels[n + 1] = 0;
      pixels[n + 2] = 0;
      pixels[n + 3] = 255;
    }
  }
};

export const floodFillPixels = (
  pixels: Uint8ClampedArray,
  width: number,
  [x, y]: [number, number],
  threshold: number
): void => {
  const target = y * width * 4 + x * 4;
  const t = threshold / 2;
  const [tr, tg, tb] = pixels.slice(target, target + 3);
  const [trl, trg] = [tr - t, tr + t];
  const [tbl, tbg] = [tb - t, tb + t];
  const [tgl, tgg] = [tg - t, tg + t];
  const q: number[] = [target];
  let count = 0;
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
      count++;
      pixels[n + 3] = 0; // Set transparency to 0
      q.push(
        n + 4, // right
        n - 4, // left
        n + width * 4, // down
        n - width * 4 // up
      );
    }
  }
  const hex = rgbToHex(tr, tg, tb);
  log(
    `[REMOVED ${count} CONTIGUOUS PIXELS] target: [${x}, ${y}] / color: {{${hex}}}${hex}{{inherit}} / tolerance: ${threshold}`
  );
};

export const getGoogleImageUrl = (query: string): string =>
  `https://www.google.com/search?q=${query.replace(/\s+/g, "+")}&tbm=isch`;

export const ipcMainLog = (...message: string[]): void =>
  log(`{{#6610f2}}[IPC-MAIN]{{inherit}}`, ...message);

export const ipcRendererLog = (...message: string[]): void =>
  log(`{{#007bff}}[IPC-RENDERER]{{inherit}}`, ...message);

export const log = (...message: string[]): void => {
  const styles: string[] = [];
  const msg = message
    .join(" ")
    .replace(/\{\{([\w\s#\(\),)]+)\}\}/g, (_, color) => {
      styles.push(`color:${color}`);
      return "%c";
    });
  console.log(msg, ...styles);
};

export const range = (n: number): number[] =>
  [...new Array(n)].map((_, i) => i);

export const rgbToHex = (r: number, g: number, b: number): string =>
  `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
