import { spawn } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import { basename, join, resolve } from "path";
import { ipcMainLog } from "./../common/utils";

let downloadPath: string | null = null;

function onReady(): void {
  ipcMain.on("toggle-dev-tools", () => {
    ipcMainLog("toggle-dev-tools");
    window.webContents.toggleDevTools();
  });
  ipcMain.on("set-download-path", (_, path: string) => {
    ipcMainLog("set-download-path", path);
    downloadPath = path;
  });
  ipcMain.on("window-close", () => window.close());
  ipcMain.on("window-minimize", () => window.minimize());
  const window = new BrowserWindow({
    width: 1500,
    height: 1000,
    frame: false,
    icon: join(__dirname, "../../icon.ico"),
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, "preload.js"),
    },
  });
  window.setMenu(null);
  window.loadFile(`index.html`);

  window.webContents.session.on("will-download", (_, item) => {
    const filePath = downloadPath && join(downloadPath, item.getFilename());
    ipcMainLog("will-download", filePath || "none");
    if (filePath) {
      item.setSavePath(filePath);
    }
  });
}

function handleSquirrelEvent(): boolean {
  const appFolder = resolve(process.execPath, "..");
  const rootAtomFolder = resolve(appFolder, "..");
  const updateDotExe = resolve(join(rootAtomFolder, "Update.exe"));
  const exeName = basename(process.execPath);

  function spawnAndQuit(...args: string[]): void {
    try {
      const process = spawn(updateDotExe, args, { detached: true });
      process.on("close", app.quit);
    } catch (error) {}
  }

  switch (process.argv[1]) {
    case "--squirrel-install":
    case "--squirrel-updated": {
      // Install desktop and start menu shortcuts
      spawnAndQuit("--createShortcut", exeName);
      return true;
    }
    case "--squirrel-uninstall": {
      // Remove desktop and start menu shortcuts
      spawnAndQuit("--removeShortcut", exeName);
      return true;
    }
    case "--squirrel-obsolete": {
      app.quit();
      return true;
    }
    default: {
      return false;
    }
  }
}

if (!handleSquirrelEvent()) {
  app.on("window-all-closed", app.quit);
  app.on("ready", onReady);
}
