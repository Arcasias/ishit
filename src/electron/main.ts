import { spawn } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import { basename, join, resolve } from "path";
import { ipcMainLog } from "./../common/utils";

let downloadPath: string | null = null;
let win: BrowserWindow | null = null;

const onSecondInstance = (): void => {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }
};

const onReady = (): void => {
  ipcMain.on("toggle-dev-tools", () => {
    ipcMainLog("toggle-dev-tools");
    win?.webContents.toggleDevTools();
  });
  ipcMain.on("set-download-path", (_, path: string) => {
    ipcMainLog("set-download-path", path);
    downloadPath = path;
  });
  ipcMain.on("window-close", () => win?.close());
  ipcMain.on("window-minimize", () => win?.minimize());
  ipcMain.on("window-maximize", () =>
    win?.isMaximized() ? win?.unmaximize() : win?.maximize()
  );
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    useContentSize: true,
    icon: join(__dirname, "../../icon.ico"),
    webPreferences: {
      additionalArguments: process.argv.slice(1),
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, "preload.js"),
    },
  });
  win.setMenu(null);
  win.loadFile(`index.html`);

  win.webContents.session.on("will-download", (_, item) => {
    if (downloadPath) {
      const filePath = join(downloadPath, item.getFilename());
      ipcMainLog("will-download", filePath);
      item.setSavePath(filePath);
    } else {
      ipcMainLog("will-download", "aborted: no file path.");
    }
  });

  if (process.argv.includes("--dev")) {
    win.webContents.openDevTools();
  }
};

const handleSquirrelEvent = (): boolean => {
  const appFolder = resolve(process.execPath, "..");
  const rootAtomFolder = resolve(appFolder, "..");
  const updateDotExe = resolve(join(rootAtomFolder, "Update.exe"));
  const exeName = basename(process.execPath);

  const spawnAndQuit = (...args: string[]): void => {
    try {
      const process = spawn(updateDotExe, args, { detached: true });
      process.on("close", app.quit);
    } catch (error) {}
  };

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
};

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else if (!handleSquirrelEvent()) {
  app.on("window-all-closed", app.quit);
  app.on("second-instance", onSecondInstance);
  app.on("ready", onReady);
}
