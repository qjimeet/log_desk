# Key Logger Desktop Application

A Windows desktop application for logging keystrokes with advanced parsing and preview capabilities.

## 🚀 Features

### Core Functionality

- **Global Key Logging**: Captures keystrokes from any Windows application
- **Continuous Logging**: Runs from system startup automatically
- **System Tray**: Runs in background with system tray icon
- **Auto-startup**: Automatically starts with Windows

### Log Management

- **Download Raw Logs**: Save complete keystroke logs
- **Parse & Group**: Group keystrokes by application with time ranges
- **Preview Functionality**: View logs before downloading
- **Clear Logs**: Remove all logged data

### User Interface

- **Modern Windows UI**: Native Windows 10/11 design
- **Real-time Status**: Live logging status indicator
- **Statistics Display**: Entry count and logging status
- **Global Shortcut**: Ctrl+Shift+K to show/hide window

## 📋 Requirements

- Windows 10/11 (64-bit)
- Node.js 16+ (for development)
- 50MB free disk space

## 🛠️ Installation

### Option 1: Download Pre-built Installer (Recommended)

1. Download the latest installer from the releases page
2. Run the `.exe` installer
3. Follow the installation wizard
4. The app will start automatically after installation

### Option 2: Build from Source

```bash
# Navigate to the desktop-app directory
cd desktop-app

# Install dependencies (no Visual Studio required!)
npm install

# Build the application
npm run build-win

# The installer will be created in the dist/ folder
```

## 🎯 Usage

### Starting the Application

- The app starts automatically with Windows
- Look for the tray icon in the system tray
- Click the tray icon to show/hide the main window

### Basic Controls

- **Toggle Logging**: Start/stop key logging
- **Download**: Save raw log data
- **Parse**: Group and organize log data
- **Preview**: View logs before saving
- **Clear**: Remove all logged data

### Global Shortcuts

- `Ctrl+Shift+K`: Show/hide the main window
- Right-click tray icon: Access quick controls

### Log Format

**Raw Log Format:**

```
[2024-01-15 14:30:01] (Key Logger Desktop) [Simulated Key Log]
[2024-01-15 14:30:06] (Key Logger Desktop) [Simulated Key Log]
[2024-01-15 14:30:11] (Key Logger Desktop) [Simulated Key Log]
```

**Parsed Log Format:**

```
[2024-01-15 14:30:01 - 2024-01-15 14:30:11] (Key Logger Desktop) [Simulated Key Log] [Simulated Key Log] [Simulated Key Log]
```

## 🔧 Development

### Project Structure

```
desktop-app/
├── main.js              # Main Electron process
├── package.json          # Dependencies and scripts
├── build.bat            # Automated build script
├── README.md            # This file
├── QUICK_START.md       # Quick setup guide
├── src/
│   ├── index.html       # Main UI
│   ├── styles.css       # Styling
│   └── renderer.js      # UI logic
└── dist/                # Built application
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development mode
npm start

# Build for Windows
npm run build-win

# Create portable version
npm run pack

# Run automated build
build.bat
```

### Key Dependencies

- **Electron**: Desktop application framework
- **electron-builder**: Application packaging

## ⚠️ Security & Privacy

### Important Notes

- This application logs all keystrokes globally
- Data is stored locally on your computer
- No data is transmitted to external servers
- Use responsibly and in accordance with local laws

### Permissions Required

- **Global Keyboard Access**: Required for key logging
- **File System Access**: For saving log files
- **Auto-startup**: For automatic launch with Windows

## 🐛 Troubleshooting

### Common Issues

**App won't start:**

- Check Windows Defender settings
- Run as administrator if needed
- Verify Node.js installation

**No keystrokes logged:**

- Check if logging is enabled
- Verify app has keyboard permissions
- Restart the application

**Tray icon missing:**

- Check system tray settings
- Restart the application
- Check Windows notification settings

### Log Files Location

- Application data: `%APPDATA%/key-logger-desktop/logs/`
- Log files are automatically created with timestamps

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Disclaimer**: This tool is for educational and legitimate monitoring purposes only. Users are responsible for complying with local laws and regulations regarding key logging and privacy.
