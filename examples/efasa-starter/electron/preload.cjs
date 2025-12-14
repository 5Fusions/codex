const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("efasa", {
  ping: () => ipcRenderer.invoke("efasa:ping"),
});
