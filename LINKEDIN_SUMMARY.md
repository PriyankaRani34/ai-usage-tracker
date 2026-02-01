# LinkedIn Technical Summary - AI Usage Tracker

## Short Version (For LinkedIn Post)

🚀 **Just completed building an AI Usage Tracker with Cognitive Health Monitoring** - a full-stack web application that tracks AI usage across devices and analyzes its impact on cognitive health.

**Tech Stack:**
• Backend: Node.js, Express.js, SQLite
• Frontend: React.js, Recharts, Modern CSS
• Architecture: RESTful API, Multi-device client SDKs
• Extensions: Browser extension (Chrome/Firefox), Desktop monitor

**Key Features:**
✅ Automatic AI usage tracking across laptop, mobile, and tablet
✅ Real-time analytics dashboard with interactive charts
✅ Cognitive health scoring (Brain Activity, Memory, Critical Thinking, Creativity)
✅ Age-specific brain impact analysis and risk assessment
✅ Personalized recommendations and brain-boosting task suggestions
✅ Multi-device synchronization with user profile management

**Highlights:**
• Built browser extension for automatic web-based AI service tracking
• Implemented desktop monitor for tracking desktop applications
• Created responsive React dashboard with 13+ components
• Developed RESTful API with 15+ endpoints
• Integrated cognitive health algorithms based on actual usage data

**Repository:** https://github.com/PriyankaRani34/ai-usage-tracker

#FullStackDevelopment #ReactJS #NodeJS #WebDevelopment #AI #HealthTech

---

## Medium Version (For LinkedIn Post with More Detail)

🎯 **Project: AI Usage Tracker with Cognitive Health Monitoring**

Built a comprehensive full-stack application to track AI usage across multiple devices and monitor its impact on cognitive health.

**Architecture & Technology:**
• **Backend:** Node.js + Express.js RESTful API with SQLite database
• **Frontend:** React.js 18 with Recharts for data visualization
• **Multi-Platform Support:** Browser extension, desktop monitor, mobile/tablet SDKs
• **Data Flow:** Real-time tracking → API → SQLite → React Dashboard

**Core Functionality:**
1. **Automatic Tracking System**
   - Browser extension for web-based AI services (ChatGPT, Claude, Copilot, etc.)
   - Desktop monitor for application-level tracking (Cursor, VS Code, etc.)
   - Multi-device client SDKs for mobile and tablet integration

2. **Analytics Dashboard**
   - Real-time usage metrics (duration, requests, sessions)
   - Interactive charts (line, pie, bar) with time period filters
   - Device-wise and service-wise usage breakdowns
   - 13+ React components with modern, responsive UI

3. **Cognitive Health Monitoring**
   - Calculates Brain Activity, Memory, Critical Thinking, and Creativity scores
   - Age-specific risk assessment and impact analysis
   - 7-day trend visualization
   - Personalized recommendations based on usage patterns

4. **User Management**
   - Profile creation with age-based analysis
   - Device linking to user profiles
   - Professional user interface with top-right menu

**Technical Achievements:**
• Implemented automatic tracking without manual intervention
• Created age-specific algorithms for cognitive health calculations
• Built responsive dashboard matching modern design standards
• Developed RESTful API with 15+ endpoints
• Integrated real-time data synchronization across components

**Repository:** https://github.com/PriyankaRani34/ai-usage-tracker

#FullStackDevelopment #ReactJS #NodeJS #ExpressJS #SQLite #WebDevelopment #JavaScript #HealthTech #DataVisualization #RESTfulAPI

---

## Detailed Version (For LinkedIn Article or Project Description)

### AI Usage Tracker with Cognitive Health Monitoring

A full-stack web application designed to track AI usage across multiple devices and provide insights into its impact on cognitive health.

#### **Project Overview**

This project addresses the growing concern about AI dependency by providing users with comprehensive tracking and analysis tools. The application automatically monitors AI usage across devices and calculates cognitive health metrics based on usage patterns.

#### **Technical Architecture**

**Backend (Node.js + Express.js)**
- RESTful API with 15+ endpoints
- SQLite database for local data storage
- CORS-enabled for cross-origin requests
- Automatic database schema initialization and migrations
- Real-time data processing and aggregation

**Frontend (React.js)**
- React 18.2 with functional components and hooks
- Recharts library for interactive data visualization
- Modern CSS with gradient designs and responsive layout
- 13+ reusable components
- Production-ready build system

**Multi-Platform Clients**
- Browser Extension (Chrome/Firefox) for automatic web tracking
- Desktop Monitor (Node.js) for application-level tracking
- Mobile/Tablet SDKs (JavaScript) for integration into apps

#### **Key Features Implemented**

1. **Automatic Usage Tracking**
   - Browser extension detects AI service usage automatically
   - Desktop monitor tracks application-level AI interactions
   - Supports 10+ pre-configured AI services (ChatGPT, Claude, Copilot, Cursor, etc.)
   - Manual logging API for custom integrations

2. **Real-Time Analytics Dashboard**
   - Overview tab with key metrics (average daily usage, device count, service count)
   - Usage by device visualization
   - Usage by AI service breakdown (pie charts)
   - Time-based trends (line charts)
   - Time period filters (1 day, 7 days, 30 days, all time)

3. **Cognitive Health Monitoring**
   - Brain Activity Score (0-100 scale)
   - Memory Usage Score
   - Critical Thinking Score
   - Creativity Score
   - Cognitive Load Score
   - 7-day trend analysis

4. **Brain Impact Analysis**
   - Age-specific risk assessment
   - Impact level calculation (Low/Medium/High)
   - Personalized risk factors identification
   - Age-appropriate recommendations
   - Real-time sync with actual usage data

5. **Personalized Recommendations**
   - Daily usage limit suggestions
   - Skill-building exercise recommendations
   - Brain-boosting task suggestions with video links
   - Age-specific guidance

6. **User Management System**
   - User profile creation with age input
   - Professional user menu (top-right corner)
   - Device linking to user profiles
   - Multi-user support via user IDs

#### **Technical Challenges Solved**

1. **Automatic Tracking**: Implemented browser extension and desktop monitor for hands-free tracking
2. **Data Synchronization**: Ensured cognitive health calculations sync with actual usage data
3. **Age-Specific Algorithms**: Developed algorithms that adjust cognitive health scores based on user age
4. **Real-Time Updates**: Implemented efficient data fetching and state management
5. **Multi-Device Support**: Created unified API that handles data from multiple device types

#### **Technology Stack**

**Backend:**
- Node.js 14+
- Express.js 4.18
- SQLite3 5.1
- UUID 9.0
- Axios 1.6
- CORS 2.8

**Frontend:**
- React 18.2
- React DOM 18.2
- Recharts 2.10
- Axios 1.6
- date-fns 2.30
- React Scripts 5.0

**Development Tools:**
- Nodemon (auto-reload)
- Git (version control)

#### **Project Structure**

```
ai-usage-tracker/
├── server/              # Express.js backend
│   └── index.js        # Main server with all API endpoints
├── dashboard/           # React frontend
│   ├── src/
│   │   ├── App.js      # Main app component
│   │   └── components/ # 13+ React components
│   └── build/          # Production build
├── clients/            # Client SDKs
│   ├── desktop/        # Desktop client
│   ├── mobile/         # Mobile client
│   └── tablet/         # Tablet client
├── browser-extension/  # Chrome/Firefox extension
├── monitors/           # Background monitoring
│   └── desktop-monitor.js
└── data/               # SQLite database
```

#### **API Endpoints**

**Usage Tracking:**
- `POST /api/devices` - Register device
- `POST /api/usage` - Log AI usage
- `GET /api/usage/summary` - Get summary statistics
- `GET /api/usage/stats` - Get detailed statistics

**User & Cognitive Health:**
- `POST /api/user/profile` - Create/update user profile
- `GET /api/user/profile/:id` - Get user profile
- `POST /api/cognitive-health` - Calculate cognitive health metrics
- `GET /api/cognitive-health/:userId` - Get health history
- `GET /api/brain-impact/:userId` - Get brain impact analysis

**Recommendations:**
- `GET /api/tasks/suggestions` - Get personalized task suggestions
- `GET /api/tasks` - Get all available tasks

#### **Results & Impact**

- Successfully tracks AI usage across multiple devices
- Provides actionable insights into cognitive health
- Age-specific analysis helps users understand personalized impact
- Automatic tracking reduces manual effort
- Real-time dashboard enables immediate awareness

#### **Future Enhancements**

- Native mobile apps (React Native)
- Real-time notifications
- Data export (CSV/JSON)
- Multi-user authentication
- Cloud sync option
- Advanced analytics
- Usage goals and limits
- Cost tracking for paid services

#### **Repository**

🔗 https://github.com/PriyankaRani34/ai-usage-tracker

---

**Tags:**
#FullStackDevelopment #ReactJS #NodeJS #ExpressJS #SQLite #WebDevelopment #JavaScript #HealthTech #DataVisualization #RESTfulAPI #BrowserExtension #CognitiveHealth #AITracking #WebApplication #SoftwareDevelopment
