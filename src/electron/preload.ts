import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { ipcRendererLog } from "./../common/utils";

export const electronPublicApi = {
  send: (channel: string, ...args: any[]): void => {
    ipcRendererLog(channel, ...args);
    return ipcRenderer.send(channel, ...args);
  },
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) =>
    ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]): void => {
      ipcRendererLog(channel, ...args);
      return listener(event, ...args);
    }),
};

contextBridge.exposeInMainWorld("electron", electronPublicApi);
