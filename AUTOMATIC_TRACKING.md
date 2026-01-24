# Automatic Tracking Setup Guide

This guide will help you set up automatic tracking of your AI usage across all devices.

## Overview

The automatic tracking system consists of:

1. **Browser Extension** - Tracks web-based AI services (ChatGPT, Claude, etc.)
2. **Desktop Monitor** - Tracks desktop applications (Cursor, VS Code with Copilot, etc.)
3. **Background Services** - Run continuously to monitor your usage

## Setup Instructions

### 1. Start the Server

First, make sure your server is running:

```bash
cd /Users/jygrwl/ai-usage-tracker
npm start
```

The server should be running on `http://localhost:3000`

### 2. Install Browser Extension

#### For Chrome/Edge:

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Navigate to `/Users/jygrwl/ai-usage-tracker/browser-extension`
5. Select the folder
6. Click the extension icon and configure your API URL (default: `http://localhost:3000/api`)

#### For Firefox:

1. Open Firefox and go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest.json` from the `browser-extension` folder

### 3. Start Desktop Monitor

The desktop monitor tracks applications like Cursor and VS Code with Copilot:

```bash
cd /Users/jygrwl/ai-usage-tracker
npm run monitor
```

Or run it directly:

```bash
node monitors/desktop-monitor.js
```

**Note**: Keep this running in a terminal. For production use, you can set it up as a background service.

### 4. Set Up as Background Service (macOS)

To run the desktop monitor automatically in the background:

#### Using launchd (macOS):

1. Create a plist file:

```bash
nano ~/Library/LaunchAgents/com.ai-tracker.monitor.plist
```

2. Add this content (update paths as needed):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ai-tracker.monitor</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/jygrwl/ai-usage-tracker/monitors/desktop-monitor.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/ai-tracker-monitor.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/ai-tracker-monitor.error.log</string>
</dict>
</plist>
```

3. Load the service:

```bash
launchctl load ~/Library/LaunchAgents/com.ai-tracker.monitor.plist
```

4. Start it:

```bash
launchctl start com.ai-tracker.monitor
```

## What Gets Tracked Automatically

### Browser Extension Tracks:
- ✅ ChatGPT (chat.openai.com)
- ✅ Claude (claude.ai)
- ✅ Perplexity (www.perplexity.ai)
- ✅ Google Bard (bard.google.com)
- ✅ Bing Chat (www.bing.com)
- ✅ Cursor Web (www.cursor.com)
- ✅ GitHub Copilot Web (github.com/copilot)

### Desktop Monitor Tracks:
- ✅ Cursor (desktop app)
- ✅ VS Code with Copilot (desktop app)
- ✅ Other AI-powered editors

## How It Works

### Browser Extension:
- Detects when you visit AI service websites
- Tracks time spent on each service
- Counts requests/interactions
- Saves data every 5 minutes and on tab close

### Desktop Monitor:
- Checks active application every 10 seconds
- Detects AI-powered apps (Cursor, VS Code, etc.)
- Tracks session duration
- Logs usage when you switch apps or close them

## Viewing Your Data

Open your dashboard at `http://localhost:3000` to see:
- Real-time usage statistics
- Usage by device
- Usage by AI service
- Time-based charts

## Troubleshooting

### Browser Extension Not Tracking

1. Check that the extension is enabled
2. Verify API URL in extension popup
3. Make sure server is running
4. Check browser console for errors

### Desktop Monitor Not Working

1. Make sure Node.js is installed
2. Check that server is running
3. Verify you have permissions to monitor applications
4. Check the terminal output for errors

### Data Not Appearing

1. Wait a few minutes (data saves periodically)
2. Refresh the dashboard
3. Check server logs for errors
4. Verify API connection in extension popup

## Privacy & Security

- All tracking happens locally
- Data is stored in your local SQLite database
- No data is sent to external servers
- You have full control over your data

## Next Steps

- Set up mobile/tablet tracking using the client apps
- Configure custom AI services
- Set up automated backups
- Export data for analysis
