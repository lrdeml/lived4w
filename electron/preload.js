const { contextBridge, ipcRenderer } = require("electron");
const OK = ["close", "min", "max"];
contextBridge.exposeInMainWorld("winctl", { send: (a) => OK.includes(a) && ipcRenderer.send("win", a) });
