const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("node:path");

let createdWindowDatas = [];
const dinemikWidth = 200;
const dinemikHeight = 300;
let currentCount = 0;

let windowDisplayingData = null;
let mainWindow = null;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const windowDisplayingDataWidth = 500;

  mainWindow = new BrowserWindow({
    width: 200,
    height: 300,
    x: 0,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  windowDisplayingData = new BrowserWindow({
    width: windowDisplayingDataWidth,
    height: screenHeight,
    x: screenWidth - (windowDisplayingDataWidth + 20),
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  windowDisplayingData.webContents.on("did-finish-load", () => {
    windowDisplayingData.webContents.send("display-window", "displayWindow");
  });

  mainWindow.loadFile("index.html");
  windowDisplayingData.loadFile("index.html");
}

function createNewWindow(windowData, count) {
  let customWinData = {};

  const createdWindow = new BrowserWindow({
    ...windowData,
    title: `Window ${count}`,
  });

  // Window's first datas
  customWinData = {
    title: createdWindow.title,
    id: createdWindow.id,
    // id: count,
    bounds: createdWindow.getBounds(),
    position: createdWindow.getPosition(),
    size: createdWindow.getSize(),
    minimized: createdWindow.isMinimized(),
    fullscreen: createdWindow.isFullScreen(),
  };

  createdWindowDatas.push(customWinData);
  windowDisplayingData.webContents.send("get-win-info", createdWindowDatas);

  // Window moved listenering
  createdWindow.on("move", () => {
    customWinData = {
      title: createdWindow.title,
      id: createdWindow.id,
      bounds: createdWindow.getBounds(),
      position: createdWindow.getPosition(),
      size: createdWindow.getSize(),
      minimized: createdWindow.isMinimized(),
      fullscreen: createdWindow.isFullScreen(),
    };

    const index = createdWindowDatas.findIndex((item) => item.id === customWinData.id);

    if (index === -1) {
      createdWindowDatas.push(customWinData);
    } else {
      createdWindowDatas[index] = customWinData;
    }

    windowDisplayingData.webContents.send("get-win-info", createdWindowDatas);
  });

  // Window closed listenering
  createdWindow.on("close", () => {
    currentCount--;
    createdWindowDatas = createdWindowDatas.filter((item) => item.id !== customWinData.id);

    windowDisplayingData.webContents.send("get-win-info", createdWindowDatas);
    mainWindow.webContents.send("counter-update", currentCount);
  });

  // Window minimized and unminimized listenering
  createdWindow.on("minimize", () => {
    createdWindowDatas = createdWindowDatas.map((item) => {
      if (item.id === customWinData.id) {
        return {
          ...item,
          minimized: true,
        };
      } else {
        return item;
      }
    });

    windowDisplayingData.webContents.send("get-win-info", createdWindowDatas);
  });

  createdWindow.on("restore", () => {
    createdWindowDatas = createdWindowDatas.map((item) => {
      if (item.id === customWinData.id) {
        return {
          ...item,
          minimized: false,
        };
      } else {
        return item;
      }
    });
    windowDisplayingData.webContents.send("get-win-info", createdWindowDatas);
  });

  // Window fullscreen and unfullscreen listenering
  createdWindow.on("enter-full-screen", () => {
    createdWindowDatas = createdWindowDatas.map((item) => {
      if (item.id === customWinData.id) {
        return {
          ...item,
          fullscreen: true,
        };
      } else {
        return item;
      }
    });
    windowDisplayingData.webContents.send("get-win-info", createdWindowDatas);
  });

  createdWindow.on("leave-full-screen", () => {
    createdWindowDatas = createdWindowDatas.map((item) => {
      if (item.id === customWinData.id) {
        return {
          ...item,
          fullscreen: false,
        };
      } else {
        return item;
      }
    });
    windowDisplayingData.webContents.send("get-win-info", createdWindowDatas);
  });

  return createdWindow;
}

ipcMain.on("counter-increment", (event, count) => {
  currentCount = count;

  const newWindow = {
    width: dinemikWidth,
    height: dinemikHeight,
    x: dinemikWidth * count,
    y: 10,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  };

  createNewWindow(newWindow, count);
});

app.whenReady().then(() => {
  createWindow();
});
