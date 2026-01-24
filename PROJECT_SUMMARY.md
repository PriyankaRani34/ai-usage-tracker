# AI Usage Tracker - Project Summary

## Project Type

This is a **multi-platform application** consisting of:

1. **Web Application (Primary)**
   - React-based dashboard accessible via web browser
   - Responsive design works on desktop, tablet, and mobile browsers
   - URL: `http://localhost:3000` (or your server URL)

2. **Browser Extension**
   - Chrome/Edge extension for automatic web tracking
   - Firefox extension support
   - Location: `browser-extension/` folder

3. **Desktop Application**
   - Node.js-based desktop monitor for tracking desktop apps
   - Runs as a background service
   - Location: `monitors/desktop-monitor.js`

4. **Mobile/Tablet Clients**
   - JavaScript clients for React Native, Expo, or web apps
   - Can be integrated into mobile apps
   - Location: `clients/mobile/` and `clients/tablet/`

## Architecture

### Backend
- **Technology**: Node.js + Express
- **Database**: SQLite (local, no setup required)
- **API**: RESTful API with JSON responses
- **Port**: 3000 (default)

### Frontend
- **Technology**: React.js
- **Charts**: Recharts library
- **Styling**: CSS with modern design system
- **Build**: Production-ready build system

### Clients
- **Desktop**: Node.js CLI + background monitor
- **Browser**: Chrome/Firefox extension
- **Mobile/Tablet**: JavaScript SDK for integration

## Key Features

### 1. AI Usage Tracking
- ✅ Automatic tracking via browser extension
- ✅ Desktop app monitoring (Cursor, VS Code, etc.)
- ✅ Manual logging via CLI
- ✅ Multi-device support (laptop, mobile, tablet)
- ✅ Real-time data collection

### 2. Usage Analytics Dashboard
- ✅ Overview tab with metrics cards
- ✅ Usage by device visualization
- ✅ Usage by AI service (pie charts)
- ✅ Time-based trends (line charts)
- ✅ Time period filters (1d, 7d, 30d, all)

### 3. Cognitive Health Monitoring
- ✅ Brain Activity Score (0-100)
- ✅ Memory Usage Score
- ✅ Critical Thinking Score
- ✅ Creativity Score
- ✅ Cognitive Load Score
- ✅ 7-day trend charts

### 4. Brain Impact Analysis
- ✅ Age-specific risk assessment
- ✅ Impact level calculation (Low/Medium/High)
- ✅ Personalized risk factors
- ✅ Age-appropriate recommendations
- ✅ Real-time sync with usage data

### 5. Personalized Recommendations
- ✅ Daily limits suggestions
- ✅ Skill-building exercises
- ✅ Age-specific guidance
- ✅ Brain-boosting task suggestions

### 6. User Management
- ✅ User profile with age
- ✅ Professional user menu (top right)
- ✅ Device linking to user profile
- ✅ Multi-user support (via user IDs)

## Supported AI Services

### Pre-configured Services:
- ChatGPT
- Claude
- GitHub Copilot
- Cursor
- Midjourney
- DALL-E
- Stable Diffusion
- Google Bard
- Perplexity
- Other (custom services auto-added)

## Data Flow

```
┌─────────────────┐
│  Browser        │
│  Extension      │──┐
└─────────────────┘  │
                      │
┌─────────────────┐   │
│  Desktop        │   │
│  Monitor        │───┼──►  Backend API  ──►  SQLite Database
└─────────────────┘   │      (Express)          (Local Storage)
                      │
┌─────────────────┐   │
│  Mobile/Tablet   │   │
│  Clients        │───┘
└─────────────────┘
                      │
                      ▼
              ┌──────────────┐
              │   React      │
              │   Dashboard  │
              │   (Web UI)   │
              └──────────────┘
```

## Installation & Setup

### Quick Start
```bash
# 1. Install dependencies
npm install
cd dashboard && npm install && cd ..

# 2. Start server
npm start

# 3. Build dashboard (for production)
cd dashboard && npm run build

# 4. Access at http://localhost:3000
```

### Browser Extension Setup
1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `browser-extension/` folder

### Desktop Monitor Setup
```bash
npm run monitor
```

## Project Structure

```
ai-usage-tracker/
├── server/              # Backend API (Node.js + Express)
│   └── index.js        # Main server with all endpoints
├── dashboard/           # React web application
│   ├── src/
│   │   ├── App.js      # Main app component
│   │   └── components/ # React components
│   └── build/          # Production build
├── clients/            # Client applications
│   ├── desktop/        # Desktop CLI + monitor
│   ├── mobile/         # Mobile client SDK
│   └── tablet/         # Tablet client SDK
├── browser-extension/  # Chrome/Firefox extension
├── monitors/           # Background monitoring services
├── data/               # SQLite database (auto-created)
└── README.md           # Documentation
```

## API Endpoints

### Usage Tracking
- `POST /api/devices` - Register device
- `POST /api/usage` - Log AI usage
- `GET /api/usage/summary` - Get summary stats
- `GET /api/usage/stats` - Get detailed stats

### User & Cognitive Health
- `POST /api/user/profile` - Create/update profile
- `GET /api/user/profile/:id` - Get profile
- `POST /api/cognitive-health` - Calculate health metrics
- `GET /api/cognitive-health/:userId` - Get health history
- `GET /api/brain-impact/:userId` - Get impact analysis

### Recommendations
- `GET /api/tasks/suggestions` - Get task suggestions
- `GET /api/tasks` - Get all tasks

## Technology Stack

### Backend
- Node.js 14+
- Express.js 4.18
- SQLite3 5.1
- CORS enabled

### Frontend
- React 18.2
- Recharts 2.10 (for charts)
- Axios 1.6 (for API calls)
- Modern CSS with gradients

### Clients
- Node.js (desktop)
- JavaScript/ES6 (mobile/tablet)
- Chrome Extension API (browser)

## Deployment Options

### Local Development
- Server: `npm start` or `npm run dev`
- Dashboard: `cd dashboard && npm start`

### Production
- Build dashboard: `cd dashboard && npm run build`
- Server serves built files automatically
- Database: SQLite (no external DB needed)

### Cloud Deployment
- Can deploy to Heroku, Railway, Vercel, etc.
- Database: SQLite (or migrate to PostgreSQL)
- Environment variables for configuration

## Privacy & Security

- ✅ All data stored locally (SQLite)
- ✅ No external API calls (except your own server)
- ✅ User controls all data
- ✅ No third-party tracking
- ✅ Device IDs stored locally

## Current Status

✅ **Fully Functional**
- All core features implemented
- Automatic tracking working
- Cognitive health calculations working
- Brain impact analysis working
- User management working
- Dashboard fully responsive

## Future Enhancements

- [ ] Native mobile apps (React Native)
- [ ] Real-time notifications
- [ ] Data export (CSV/JSON)
- [ ] Multi-user authentication
- [ ] Cloud sync option
- [ ] Advanced analytics
- [ ] Usage goals and limits
- [ ] Cost tracking for paid services

## Answer to Your Question

**This is primarily a WEB APPLICATION** that can be accessed via:
- ✅ Web browser (desktop, tablet, mobile)
- ✅ Browser extension (Chrome/Firefox)
- ✅ Desktop background service (Node.js)
- ✅ Mobile/Tablet integration (via SDK)

**It is NOT:**
- ❌ Native Android app (but can be integrated)
- ❌ Native iOS app (but can be integrated)
- ❌ Standalone desktop app (but has desktop monitor)

**To make it native mobile apps**, you would need to:
1. Use React Native to build native apps
2. Use the existing API endpoints
3. Integrate the mobile client SDK

The current setup is **web-first** with extension and desktop monitoring capabilities.
