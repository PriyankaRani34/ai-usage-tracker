# Browser Extension - Automatic AI Usage Tracking

This browser extension automatically tracks your AI usage on web-based services like ChatGPT, Claude, Perplexity, and more.

## Installation

### Chrome/Edge

1. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder from this project
5. The extension will be installed

### Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the `browser-extension` folder

## Configuration

1. Click the extension icon in your browser toolbar
2. Enter your API URL (default: `http://localhost:3000/api`)
3. Click "Save Settings"
4. Make sure your server is running!

## How It Works

- **Automatic Detection**: Monitors when you visit AI service websites
- **Time Tracking**: Tracks how long you spend on each service
- **Request Counting**: Counts interactions (messages, queries, etc.)
- **Background Sync**: Saves data every 5 minutes and when you close tabs

## Supported Services

- ChatGPT (chat.openai.com)
- Claude (claude.ai)
- Perplexity (www.perplexity.ai)
- Google Bard (bard.google.com)
- Bing Chat (www.bing.com)
- Cursor (www.cursor.com)
- GitHub Copilot (github.com/copilot)

## Privacy

- All data is sent only to your local server
- No data is sent to third parties
- You control all your data
