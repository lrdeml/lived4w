const { app, BrowserWindow, shell, Menu, ipcMain, session } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");

if (process.platform === "linux") app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
app.commandLine.appendSwitch("disable-features", "MediaSessionService");

let win = null;
const crashes = [];
const index = path.join(__dirname, "..", "docs", "index.html");
const indexUrl = pathToFileURL(index).href;

ipcMain.on("win", (e, a) => {
  const w = BrowserWindow.fromWebContents(e.sender);
  if (!w || w !== win) return;
  if (a === "close") w.close();
  else if (a === "min") w.minimize();
  else if (a === "max") w.isMaximized() ? w.unmaximize() : w.maximize();
});

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 640,
    minHeight: 480,
    title: "lived4w",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    backgroundColor: "#0e0f11",
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(index).catch((e) => console.error(e));
  win.on("page-title-updated", (e) => e.preventDefault());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (url === indexUrl) return;
    e.preventDefault();
    if (/^https?:/i.test(url)) shell.openExternal(url);
  });
  win.webContents.on("render-process-gone", (e, d) => {
    if (!win || d.reason === "clean-exit") return;
    const now = Date.now();
    crashes.push(now);
    while (crashes.length && now - crashes[0] > 30000) crashes.shift();
    if (crashes.length <= 3) win.loadFile(index).catch((err) => console.error(err));
  });
  win.on("closed", () => (win = null));
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => cb(permission === "clipboard-sanitized-write"));
    createWindow();
  });
  app.on("window-all-closed", () => app.quit());
}
process.on("uncaughtException", (e) => console.error(e));
