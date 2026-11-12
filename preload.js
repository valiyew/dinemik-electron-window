const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("countIncremementAPI", {
  incrementCounter: (count) => ipcRenderer.send("counter-increment", count),
});

contextBridge.exposeInMainWorld("countAPI", {
  onCountUpdate: (callback) => ipcRenderer.on("counter-update", (_event, count) => callback(count)),
});

contextBridge.exposeInMainWorld("windowMoveAPI", {
  winDatas: (callback) =>
    ipcRenderer.on("get-win-info", (_event, value) => {
      callback(value);
    }),
});

contextBridge.exposeInMainWorld("displayWindowAPI", {
  displayWindow: (callback) =>
    ipcRenderer.on("display-window", (_event, value) => {
      callback(value);
    }),
});

contextBridge.exposeInMainWorld("dinemikWindowRenderHtmlAPI", {
  dinemikWindowRender: (callback) =>
    ipcRenderer.on("dinemik-window-html", (_event, value) => {
      callback(value);
    }),
});
