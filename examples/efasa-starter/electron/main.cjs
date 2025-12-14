const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = Boolean(process.env.EFS_DEV_SERVER_URL);
const preloadPath = path.join(__dirname, "preload.cjs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#0b1221",
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL(process.env.EFS_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexPath = path.join(__dirname, "..", "dist", "index.html");
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
