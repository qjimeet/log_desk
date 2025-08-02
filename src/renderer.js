const { ipcRenderer } = require("electron");

// DOM elements
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const toggleBtn = document.getElementById("toggleBtn");
const entryCount = document.getElementById("entryCount");
const loggingStatus = document.getElementById("loggingStatus");
const downloadBtn = document.getElementById("downloadBtn");
const downloadPreviewBtn = document.getElementById("downloadPreviewBtn");
const parseBtn = document.getElementById("parseBtn");
const parsePreviewBtn = document.getElementById("parsePreviewBtn");
const clearBtn = document.getElementById("clearBtn");
const minimizeBtn = document.getElementById("minimizeBtn");
const closeBtn = document.getElementById("closeBtn");
const modal = document.getElementById("previewModal");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const previewContent = document.getElementById("previewContent");

// Initialize UI
async function initializeUI() {
  const isLogging = await ipcRenderer.invoke("get-logging-status");
  updateStatus(isLogging);
  updateStats();
}

function updateStatus(isLogging) {
  if (isLogging) {
    statusDot.classList.remove("inactive");
    statusText.textContent = "Logging Active";
    toggleBtn.textContent = "Stop Logging";
    toggleBtn.classList.remove("active");
    loggingStatus.textContent = "Active";
  } else {
    statusDot.classList.add("inactive");
    statusText.textContent = "Logging Stopped";
    toggleBtn.textContent = "Start Logging";
    toggleBtn.classList.add("active");
    loggingStatus.textContent = "Stopped";
  }
}

async function updateStats() {
  const log = await ipcRenderer.invoke("get-log");
  const entries = log
    ? log.split("\n").filter((line) => line.trim()).length
    : 0;
  entryCount.textContent = entries;
}

// Event listeners
toggleBtn.addEventListener("click", async () => {
  const isLogging = await ipcRenderer.invoke("toggle-logging");
  updateStatus(isLogging);
  updateStats(); // Update stats when toggling
});

downloadBtn.addEventListener("click", async () => {
  const log = await ipcRenderer.invoke("get-log");
  if (log && log.trim().length > 0) {
    const timestamp = getCurrentTimestamp();
    const result = await ipcRenderer.invoke(
      "save-log",
      log,
      `KeyLog_${timestamp}.txt`
    );
    if (result.success) {
      showNotification("Log downloaded successfully!", "success");
    }
  } else {
    showNotification("No log available", "error");
  }
});

downloadPreviewBtn.addEventListener("click", async () => {
  const log = await ipcRenderer.invoke("get-log");
  if (log && log.trim().length > 0) {
    showPreview(log, "Raw Log Preview");
  } else {
    showNotification("No log available", "error");
  }
});

parseBtn.addEventListener("click", async () => {
  const log = await ipcRenderer.invoke("get-log");
  if (log && log.trim().length > 0) {
    const parsedLog = parseLog(log);
    if (parsedLog) {
      const timestamp = getCurrentTimestamp();
      const result = await ipcRenderer.invoke(
        "save-log",
        parsedLog,
        `ParsedKeyLog_${timestamp}.txt`
      );
      if (result.success) {
        showNotification("Parsed log downloaded successfully!", "success");
      }
    } else {
      showNotification("No valid log data to parse", "error");
    }
  } else {
    showNotification("No log available", "error");
  }
});

parsePreviewBtn.addEventListener("click", async () => {
  const log = await ipcRenderer.invoke("get-log");
  if (log && log.trim().length > 0) {
    const parsedLog = parseLog(log);
    if (parsedLog) {
      showPreview(parsedLog, "Parsed Log Preview");
    } else {
      showNotification("No valid log data to parse", "error");
    }
  } else {
    showNotification("No log available", "error");
  }
});

clearBtn.addEventListener("click", async () => {
  await ipcRenderer.invoke("clear-log");
  updateStats();
  showNotification("Log cleared successfully!", "success");
});

minimizeBtn.addEventListener("click", () => {
  ipcRenderer.invoke("minimize-window");
});

closeBtn.addEventListener("click", () => {
  ipcRenderer.invoke("close-window");
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Helper functions
function getCurrentTimestamp() {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0") +
    "_" +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0")
  );
}

function parseLog(log) {
  if (!log || log.trim().length === 0) {
    return "";
  }

  const lines = log.split("\n").filter((line) => line.trim());
  const keyGroups = {};

  // Parse each line and group by key type
  lines.forEach((line) => {
    const match = line.match(/\[(.*?)\]\s+\((.*?)\)\s+\[Key:\s+(.*?)\]/);
    if (match) {
      const timestamp = match[1];
      const source = match[2];
      const keyName = match[3];

      if (!keyGroups[keyName]) {
        keyGroups[keyName] = {
          count: 0,
          firstSeen: timestamp,
          lastSeen: timestamp,
        };
      }

      keyGroups[keyName].count++;
      keyGroups[keyName].lastSeen = timestamp;
    }
  });

  // Convert grouped data to formatted string
  let parsedLog = "";
  Object.entries(keyGroups).forEach(([keyName, group]) => {
    parsedLog += `[${group.firstSeen} - ${group.lastSeen}] Key: ${keyName} (Pressed ${group.count} times)\n`;
  });

  return parsedLog.trim();
}

function showPreview(content, title) {
  modalTitle.textContent = title;
  previewContent.textContent = content;
  modal.style.display = "block";
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
  `;

  // Set background color based on type
  if (type === "success") {
    notification.style.background =
      "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)";
  } else if (type === "error") {
    notification.style.background =
      "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)";
  } else {
    notification.style.background =
      "linear-gradient(135deg, #3498db 0%, #5dade2 100%)";
  }

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in";
    notification.style.animationFillMode = "forwards";

    // Add slideOut animation
    const slideOutStyle = document.createElement("style");
    slideOutStyle.textContent = `
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(slideOutStyle);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Initialize the UI when the page loads
document.addEventListener("DOMContentLoaded", initializeUI);
