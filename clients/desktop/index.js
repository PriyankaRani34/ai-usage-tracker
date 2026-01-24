const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const os = require('os');
const path = require('path');
const fs = require('fs');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const DEVICE_ID_FILE = path.join(os.homedir(), '.ai-tracker-device-id');

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
  
  // Try to get userId from localStorage or default
  const userId = localStorage.getItem('userId') || null;

  try {
    await axios.post(`${API_URL}/devices`, {
      id: deviceId,
      name: deviceName,
      type: deviceType,
      userId: userId
    });
    console.log(`Device registered: ${deviceName} (${deviceId})`);
    return deviceId;
  } catch (error) {
    console.error('Error registering device:', error.message);
    return null;
  }
}

// Log AI usage
async function logUsage(serviceName, durationSeconds = 0, requestCount = 1, metadata = {}) {
  const deviceId = getDeviceId();

  try {
    const response = await axios.post(`${API_URL}/usage`, {
      deviceId,
      serviceName,
      durationSeconds,
      requestCount,
      metadata
    });
    console.log(`Usage logged: ${serviceName} - ${requestCount} request(s)`);
    return response.data;
  } catch (error) {
    console.error('Error logging usage:', error.message);
    return null;
  }
}

// Example usage tracking functions
function trackChatGPTSession(durationSeconds, messageCount) {
  return logUsage('ChatGPT', durationSeconds, messageCount, {
    platform: 'web',
    session_type: 'chat'
  });
}

function trackCopilotUsage(requestCount) {
  return logUsage('GitHub Copilot', 0, requestCount, {
    platform: 'vscode',
    type: 'code_completion'
  });
}

function trackCursorUsage(durationSeconds, requestCount) {
  return logUsage('Cursor', durationSeconds, requestCount, {
    platform: 'desktop',
    type: 'code_assistant'
  });
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  (async () => {
    await registerDevice();

    if (command === 'log') {
      const serviceName = args[1] || 'Other';
      const duration = parseInt(args[2]) || 0;
      const requests = parseInt(args[3]) || 1;
      
      await logUsage(serviceName, duration, requests);
    } else if (command === 'example') {
      // Example: Log some sample usage
      console.log('Logging example usage...');
      await trackChatGPTSession(300, 5);
      await trackCopilotUsage(10);
      await trackCursorUsage(600, 3);
      console.log('Example usage logged!');
    } else {
      console.log(`
AI Usage Tracker - Desktop Client

Usage:
  node index.js log <service> [duration] [requests]
  node index.js example

Examples:
  node index.js log ChatGPT 300 5
  node index.js log "GitHub Copilot" 0 10
  node index.js example
      `);
    }
  })();
}

module.exports = {
  registerDevice,
  logUsage,
  trackChatGPTSession,
  trackCopilotUsage,
  trackCursorUsage,
  getDeviceId
};
