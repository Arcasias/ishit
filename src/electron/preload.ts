import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { APIBridge, ipcRendererLog } from "./../common/utils";

contextBridge.exposeInMainWorld("electron", {
  send(channel, ...args) {
    ipcRendererLog(channel, ...args);
    ipcRenderer.send(channel, ...args);
  },
  on(channel, listener) {
    return ipcRenderer.on(
      channel,
      (event: IpcRendererEvent, ...args: any[]): void => {
        ipcRendererLog(channel, ...args);
        return listener(event, ...args);
      }
    );
  },
  isDev: process.argv.includes("--dev"),
} as APIBridge);
