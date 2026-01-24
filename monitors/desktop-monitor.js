const { exec } = require('child_process');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const os = require('os');
const path = require('path');
const fs = require('fs');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const DEVICE_ID_FILE = path.join(os.homedir(), '.ai-tracker-device-id');
const MONITOR_INTERVAL = 10000; // Check every 10 seconds

// AI Applications to monitor
const AI_APPS = {
  // macOS
  'Cursor': 'Cursor',
  'Cursor.app': 'Cursor',
  'Code': 'VS Code', // VS Code with Copilot
  'Visual Studio Code': 'VS Code',
  // Windows (for future)
  'Cursor.exe': 'Cursor',
  'Code.exe': 'VS Code',
};

// Track active sessions
let activeSessions = new Map();
let lastActiveApp = null;
let sessionStartTime = null;

// Get or create device ID
function getDeviceId() {
  if (fs.existsSync(DEVICE_ID_FILE)) {
    return fs.readFileSync(DEVICE_ID_FILE, 'utf8').trim();
  }
  const deviceId = uuidv4();
  fs.writeFileSync(DEVICE_ID_FILE, deviceId);
  return deviceId;
}

// Register device
async function registerDevice() {
  const deviceId = getDeviceId();
  const deviceName = os.hostname();
  const deviceType = 'laptop';

  try {
    await axios.post(`${API_URL}/devices`, {
      id: deviceId,
      name: deviceName,
      type: deviceType
    });
    console.log(`Device registered: ${deviceName}`);
    return deviceId;
  } catch (error) {
    console.error('Error registering device:', error.message);
    return null;
  }
}

// Log usage
async function logUsage(serviceName, durationSeconds, requestCount = 1) {
  const deviceId = getDeviceId();

  try {
    await axios.post(`${API_URL}/usage`, {
      deviceId,
      serviceName,
      durationSeconds,
      requestCount,
      metadata: {
        platform: os.platform(),
        source: 'desktop-monitor'
      }
    });
    console.log(`✓ Logged: ${serviceName} - ${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`);
  } catch (error) {
    console.error('Error logging usage:', error.message);
  }
}

// Get active application (macOS)
function getActiveAppMacOS() {
  return new Promise((resolve) => {
    exec("osascript -e 'tell application \"System Events\" to get name of first application process whose frontmost is true'", 
      (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }
        resolve(stdout.trim());
      });
  });
}

// Get active application (Windows - for future)
function getActiveAppWindows() {
  return new Promise((resolve) => {
    exec('powershell -command "(Get-Process | Where-Object {$_.MainWindowTitle -ne \"\"} | Sort-Object CPU -Descending | Select-Object -First 1).ProcessName"',
      (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }
        resolve(stdout.trim());
      });
  });
}

// Get active application
async function getActiveApp() {
  const platform = os.platform();
  if (platform === 'darwin') {
    return await getActiveAppMacOS();
  } else if (platform === 'win32') {
    return await getActiveAppWindows();
  }
  return null;
}

// Detect AI service from app name
function detectAIService(appName) {
  if (!appName) return null;
  
  for (const [appKey, serviceName] of Object.entries(AI_APPS)) {
    if (appName.includes(appKey.replace('.app', '').replace('.exe', ''))) {
      return serviceName;
    }
  }
  
  // Special handling for VS Code with Copilot
  if (appName.includes('Code') || appName.includes('Visual Studio Code')) {
    // Check if Copilot is likely being used (this is a heuristic)
    return 'GitHub Copilot';
  }
  
  return null;
}

// Monitor loop
async function monitor() {
  const activeApp = await getActiveApp();
  const service = detectAIService(activeApp);
  
  if (service) {
    // Same service, continue tracking
    if (lastActiveApp === service) {
      // Session continues
      if (!sessionStartTime) {
        sessionStartTime = Date.now();
      }
    } else {
      // New service started
      // Save previous session if exists
      if (lastActiveApp && sessionStartTime) {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
        if (duration > 30) { // Only log if more than 30 seconds
          await logUsage(lastActiveApp, duration, 1);
        }
      }
      
      // Start new session
      lastActiveApp = service;
      sessionStartTime = Date.now();
    }
  } else {
    // No AI service active
    // Save previous session if exists
    if (lastActiveApp && sessionStartTime) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      if (duration > 30) { // Only log if more than 30 seconds
        await logUsage(lastActiveApp, duration, 1);
      }
      lastActiveApp = null;
      sessionStartTime = null;
    }
  }
}

// Main function
async function startMonitoring() {
  console.log('🤖 AI Usage Tracker - Desktop Monitor');
  console.log('Starting automatic tracking...\n');
  
  await registerDevice();
  
  // Start monitoring loop
  setInterval(monitor, MONITOR_INTERVAL);
  
  // Initial check
  monitor();
  
  console.log('Monitoring active. Tracking AI applications...');
  console.log('Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down...');
  
  // Save current session
  if (lastActiveApp && sessionStartTime) {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    if (duration > 0) {
      await logUsage(lastActiveApp, duration, 1);
    }
  }
  
  console.log('Goodbye!');
  process.exit(0);
});

// Start monitoring
startMonitoring();
