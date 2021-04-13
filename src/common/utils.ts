import { IpcRendererEvent } from "electron";

const defaultApiBridge: APIBridge = {
  send(...args: any[]): any {},
  on(...args: any[]): any {},
};

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

export function getApi(globalObject: any): APIBridge {
  return globalObject.electron ?? defaultApiBridge;
}
