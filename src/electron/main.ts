import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { ipcMainLog } from "./../common/utils";

let downloadPath: string | null = null;

function onWindowAllClosed() {
  app.quit();
}

function onReady() {
  ipcMain.on("toggle-dev-tools", () => {
    ipcMainLog("toggle-dev-tools");
    window.webContents.toggleDevTools();
  });
  ipcMain.on("set-download-path", (_, path: string) => {
    ipcMainLog("set-download-path", path);
    downloadPath = path;
  });

  const window = new BrowserWindow({
    width: 1500,
    height: 1000,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, "preload.js"),
    },
  });
  window.setMenu(null);
  window.loadFile(`dist/index.html`);
  window.on("closed", () => app.quit());

  window.webContents.session.on("will-download", (_, item) => {
    const filePath = downloadPath && join(downloadPath, item.getFilename());
    ipcMainLog("will-download", filePath || "none");
    if (filePath) {
      item.setSavePath(filePath);
    }
  });
}

app.on("window-all-closed", onWindowAllClosed);
app.on("ready", onReady);
