# AI Usage Tracker

Track your AI usage across all your devices (laptop, mobile, and tablet) with a beautiful dashboard and comprehensive analytics.

## Features

- 🤖 **Automatic Tracking**: Browser extension and desktop monitor for hands-free tracking
- 📊 **Real-time Dashboard**: Beautiful web interface to visualize your AI usage
- 📱 **Multi-Device Support**: Track usage from laptop, mobile, and tablet
- 🔧 **Multiple AI Services**: Pre-configured tracking for ChatGPT, Claude, Copilot, Cursor, and more
- ⏱️ **Usage Analytics**: Track duration, requests, sessions, and more
- 📈 **Visual Charts**: Interactive charts showing usage over time, by device, and by service
- 🎯 **Time Periods**: View data for last 24 hours, 7 days, 30 days, or all time

## Project Structure

```
ai-usage-tracker/
├── server/           # Backend API server
│   └── index.js     # Express server with SQLite database
├── dashboard/        # React web dashboard
│   └── src/         # React components and app
├── clients/         # Client applications for different devices
│   ├── desktop/     # Desktop/laptop client
│   ├── mobile/      # Mobile client
│   └── tablet/      # Tablet client
└── data/            # SQLite database (created automatically)
```

## Quick Start - Automatic Tracking

**Want automatic tracking?** See [AUTOMATIC_TRACKING.md](./AUTOMATIC_TRACKING.md) for setup instructions.

1. **Start the server**: `npm start`
2. **Install browser extension**: Load `browser-extension` folder in Chrome/Firefox
3. **Start desktop monitor**: `npm run monitor` (for apps like Cursor, VS Code)

That's it! Your AI usage will be tracked automatically.

## Installation

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install dashboard dependencies
cd dashboard
npm install
cd ..
```

### 2. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Start the Dashboard (Development)

In a new terminal:

```bash
cd dashboard
npm start
```

The dashboard will open at `http://localhost:3000` (or the server port if different)

## Usage

### Desktop/Laptop Client

The desktop client can be used via command line:

```bash
# Log usage manually
node clients/desktop/index.js log ChatGPT 300 5
# This logs: ChatGPT, 300 seconds duration, 5 requests

# Run example usage
node clients/desktop/index.js example
```

You can also import and use it in your applications:

```javascript
const { logUsage, trackChatGPTSession } = require('./clients/desktop');

// Track a ChatGPT session
await trackChatGPTSession(300, 5); // 300 seconds, 5 messages

// Track custom usage
await logUsage('Claude', 180, 3, { platform: 'web' });
```

### Mobile Client

For mobile apps (React Native, Expo, or web), import the client:

```javascript
import { logUsage, trackChatGPT } from './clients/mobile';

// Register device first
await registerDevice('My iPhone', 'mobile');

// Track usage
await trackChatGPT(600, 10); // 600 seconds, 10 messages
```

### Tablet Client

Similar to mobile:

```javascript
import { logUsage, trackChatGPT } from './clients/tablet';

await registerDevice('My iPad', 'tablet');
await trackChatGPT(1200, 15);
```

## API Endpoints

### Register Device
```
POST /api/devices
Body: { id, name, type }
```

### Log Usage
```
POST /api/usage
Body: { deviceId, serviceName, durationSeconds, requestCount, metadata }
```

### Get Statistics
```
GET /api/usage/stats?period=7d&deviceId=xxx&serviceId=xxx
```

### Get Summary
```
GET /api/usage/summary?period=7d
```

### Get Devices
```
GET /api/devices
```

### Get Services
```
GET /api/services
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
API_URL=http://localhost:3000/api
```

For mobile/tablet clients, update the `API_URL` to point to your server's IP address:

```javascript
// In clients/mobile/index.js or clients/tablet/index.js
const API_URL = 'http://YOUR_SERVER_IP:3000/api';
```

## Pre-configured AI Services

The following services are pre-configured:
- ChatGPT
- Claude
- GitHub Copilot
- Cursor
- Midjourney
- DALL-E
- Stable Diffusion
- Google Bard
- Perplexity
- Other (for custom services)

You can add more services by logging usage with a new service name - it will be automatically added.

## Building for Production

### Build Dashboard
```bash
cd dashboard
npm run build
```

The built files will be in `dashboard/build/` and will be served by the Express server.

### Run Production Server
```bash
npm start
```

## Development

### Run in Development Mode

```bash
# Terminal 1: Start server with auto-reload
npm run dev

# Terminal 2: Start dashboard with hot-reload
cd dashboard
npm start
```

## Database

The project uses SQLite for simplicity. The database file is automatically created at `data/ai_usage.db`.

### Database Schema

- **devices**: Stores registered devices
- **ai_services**: Stores AI service names and categories
- **usage_logs**: Stores all usage tracking data

## Future Enhancements

- [ ] Automatic tracking via browser extensions
- [ ] Mobile app with background tracking
- [ ] Cost tracking for paid AI services
- [ ] Export data to CSV/JSON
- [ ] User authentication and multi-user support
- [ ] Real-time notifications
- [ ] Usage goals and limits

## License

MIT
