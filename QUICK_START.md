# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build the Application

```bash
npm run build-win
```

### Step 3: Install the Application

1. Go to the `dist/` folder
2. Run the `.exe` installer
3. Follow the installation wizard

### Step 4: Use the Application

1. The app starts automatically with Windows
2. Look for the tray icon in system tray
3. Click the tray icon to open the main window
4. Use `Ctrl+Shift+K` to show/hide the window

## 🎯 Key Features

### Real-time Logging

- ✅ Captures keystrokes from any application
- ✅ Shows active window/application
- ✅ Live status indicator
- ✅ Entry counter

### Log Management

- 📥 **Download**: Save raw log data
- 🔧 **Parse**: Group by application with time ranges
- 👁️ **Preview**: View logs before saving
- 🗑️ **Clear**: Remove all data

### System Integration

- 🔄 Auto-startup with Windows
- 📌 System tray icon
- ⌨️ Global keyboard shortcut
- 🎨 Modern Windows UI

## 📋 Log Format Examples

**Raw Log:**

```
[2024-01-15 14:30:01] (Notepad) H
[2024-01-15 14:30:01] (Notepad) e
[2024-01-15 14:30:02] (Notepad) l
[2024-01-15 14:30:02] (Notepad) l
[2024-01-15 14:30:03] (Notepad) o
```

**Parsed Log:**

```
[2024-01-15 14:30:01 - 2024-01-15 14:30:03] (Notepad) H e l l o
```

## ⚡ Quick Commands

```bash
# Development
npm start          # Run in development mode
npm run dev        # Run with dev tools

# Building
npm run build-win  # Build Windows installer
npm run pack       # Create portable version

# Clean
npm run clean      # Clean build files
```

## 🔧 Troubleshooting

### Common Issues:

**App won't start:**

- Check Windows Defender
- Run as administrator
- Verify Node.js installation

**No keystrokes logged:**

- Check logging status
- Verify permissions
- Restart application

**Tray icon missing:**

- Check system tray settings
- Restart application

## 📁 File Locations

- **App Data**: `%APPDATA%/key-logger-desktop/`
- **Logs**: `%APPDATA%/key-logger-desktop/logs/`
- **Settings**: `%APPDATA%/key-logger-desktop/config.json`

## 🎮 Controls

### Main Window

- **Toggle Logging**: Start/stop key capture
- **Download**: Save raw log file
- **Parse**: Save grouped log file
- **Preview**: View log content
- **Clear**: Remove all logs

### System Tray

- **Show App**: Open main window
- **Start/Stop Logging**: Toggle capture
- **Clear Log**: Remove data
- **Quit**: Exit application

### Global Shortcuts

- `Ctrl+Shift+K`: Show/hide window

---

**Ready to use!** The application will start logging keystrokes immediately after installation.
