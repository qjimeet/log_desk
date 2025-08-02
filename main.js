const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  globalShortcut,
  ipcMain,
  dialog,
} = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let tray;
let isLogging = false;
let keyLog = [];
let logFilePath;
let keyListener;
let fallbackInterval;

// Ensure app data directory exists
const appDataPath = path.join(app.getPath("userData"), "logs");
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

// Initialize logging
function initializeLogging() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  logFilePath = path.join(appDataPath, `keylog_${timestamp}.txt`);
  keyLog = [];
  isLogging = true;

  // Start real key logging
  try {
    const { GlobalKeyboardListener } = require('node-global-key-listener');
    
    keyListener = new GlobalKeyboardListener();
    
    keyListener.addListener(function (e, down) {
      if (!isLogging) return;
      
      try {
        const timestamp = new Date()
          .toISOString()
          .replace("T", " ")
          .split(".")[0];

        const keyName = e.name || e.rawKey || 'Unknown';
        const entry = `[${timestamp}] (Key Logger Desktop) [Key: ${keyName}]`;
        keyLog.push(entry);

        // Save to file
        fs.appendFileSync(logFilePath, entry + "\n");

        // Update tray tooltip
        updateTrayTooltip();
      } catch (error) {
        console.error("Logging error:", error);
      }
    });
    
    console.log("Real key logging initialized successfully");
    
  } catch (error) {
    console.error("Failed to initialize key listener:", error);
    console.log("Running in fallback mode - using basic logging");
    
    // Fallback to basic logging
    fallbackInterval = setInterval(() => {
      if (!isLogging) return;
      
      try {
        const timestamp = new Date()
          .toISOString()
          .replace("T", " ")
          .split(".")[0];

        const entry = `[${timestamp}] (Key Logger Desktop) [Fallback Mode - No Key Detection]`;
        keyLog.push(entry);

        // Save to file
        fs.appendFileSync(logFilePath, entry + "\n");

        // Update tray tooltip
        updateTrayTooltip();
      } catch (error) {
        console.error("Fallback logging error:", error);
      }
    }, 10000); // Log every 10 seconds in fallback mode
  }
}

function updateTrayTooltip() {
  if (tray) {
    tray.setToolTip(`Key Logger - ${keyLog.length} entries logged`);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "assets/icon.png"),
    show: false,
    resizable: false,
    minimizable: true,
    maximizable: false,
    frame: false, // Remove default window frame
    autoHideMenuBar: true, // Hide menu bar
    titleBarStyle: 'hidden', // Hide title bar
  });

  mainWindow.loadFile("src/index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Hide window instead of closing
  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, "assets/icon.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Start Logging",
      type: "checkbox",
      checked: isLogging,
      click: (menuItem) => {
        if (menuItem.checked) {
          initializeLogging();
        } else {
          stopLogging();
        }
      },
    },
    { type: "separator" },
    {
      label: "Clear Log",
      click: () => {
        clearLog();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  updateTrayTooltip();
}

function stopLogging() {
  isLogging = false;
  
  if (keyListener) {
    try {
      keyListener.kill();
      keyListener = null;
    } catch (error) {
      console.error("Error stopping key listener:", error);
    }
  }
  
  if (fallbackInterval) {
    clearInterval(fallbackInterval);
    fallbackInterval = null;
  }
  
  updateTrayTooltip();
}

function clearLog() {
  keyLog = [];
  if (logFilePath && fs.existsSync(logFilePath)) {
    try {
      fs.unlinkSync(logFilePath);
    } catch (error) {
      console.error("Error clearing log file:", error);
    }
  }
  updateTrayTooltip();
}

// IPC handlers
ipcMain.handle("get-log", () => {
  return keyLog.join("\n");
});

ipcMain.handle("clear-log", () => {
  clearLog();
  return { success: true };
});

ipcMain.handle("get-logging-status", () => {
  return isLogging;
});

ipcMain.handle("toggle-logging", () => {
  if (isLogging) {
    stopLogging();
  } else {
    initializeLogging();
  }
  return isLogging;
});

ipcMain.handle("save-log", async (event, content, filename) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: filename,
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (filePath) {
    fs.writeFileSync(filePath, content);
    return { success: true, path: filePath };
  }
  return { success: false };
});

// Window control handlers
ipcMain.handle("minimize-window", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle("close-window", () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();
  // Don't start logging automatically - let user control it

  // Register global shortcut to show/hide window
  globalShortcut.register("Ctrl+Shift+K", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  app.isQuiting = true;
  
  if (keyListener) {
    try {
      keyListener.kill();
    } catch (error) {
      console.error("Error killing key listener:", error);
    }
  }
  
  if (fallbackInterval) {
    clearInterval(fallbackInterval);
  }
});

// Auto-startup
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
});
