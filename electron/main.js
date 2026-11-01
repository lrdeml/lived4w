const { app, BrowserWindow, shell, Menu, ipcMain } = require("electron");
const path = require("path");

// AppImage'de chrome-sandbox SUID olamaz (Ubuntu 24.04+, Fedora vb. çalıştırmayı reddeder).
// Tüm dağıtımlarda açılması için AppImage içinde sandbox kapatılır.
if (process.env.APPIMAGE || process.platform === "linux") app.commandLine.appendSwitch("no-sandbox");
// Ses, kullanıcı etkileşimi beklemeden başlayabilsin
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
app.commandLine.appendSwitch("disable-features", "MediaSessionService");

let win = null;
// Pencere düğmeleri (macOS tarzı): yalnızca kendi penceremizden gelen mesajlar işlenir
ipcMain.on("win", (e, a) => {
  const w = BrowserWindow.fromWebContents(e.sender);
  if (!w || w !== win) return;
  if (a === "close") w.close();
  else if (a === "min") w.minimize();
  else if (a === "max") w.isMaximized() ? w.unmaximize() : w.maximize();
});
const index = path.join(__dirname, "..", "docs", "index.html");

function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 640, minHeight: 480,
    title: "lived4w",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    backgroundColor: "#0e0f11",
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), contextIsolation: true, sandbox: true, nodeIntegration: false, backgroundThrottling: false },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(index);
  win.on("page-title-updated", (e) => e.preventDefault());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file://")) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); }
  });
  // Render süreci çökerse pencereyi yeniden yükle
  win.webContents.on("render-process-gone", () => { if (win) win.loadFile(index); });
  win.on("unresponsive", () => { if (win) win.reload(); });
  win.on("closed", () => (win = null));
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(createWindow);
  app.on("window-all-closed", () => app.quit());
}
process.on("uncaughtException", (e) => console.error("Beklenmeyen hata:", e));
