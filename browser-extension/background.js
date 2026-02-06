// AI Service URL mappings
const AI_SERVICES = {
  'chat.openai.com': 'ChatGPT',
  'claude.ai': 'Claude',
  'www.perplexity.ai': 'Perplexity',
  'bard.google.com': 'Google Bard',
  'www.bing.com': 'Bing Chat',
  'www.cursor.com': 'Cursor',
  'github.com': 'GitHub Copilot'
};

// Track active sessions
let activeSessions = new Map();
let lastActiveTab = null;
let sessionStartTime = null;
let requestCounts = new Map();

// Get API URL from storage or use default
async function getApiUrl() {
  const result = await chrome.storage.sync.get(['apiUrl']);
  return result.apiUrl || 'http://localhost:3000/api';
}

// Get or create device ID
async function getDeviceId() {
  const result = await chrome.storage.sync.get(['deviceId']);
  if (result.deviceId) {
    return result.deviceId;
  }
  
  // Generate new device ID
  const deviceId = crypto.randomUUID();
  await chrome.storage.sync.set({ deviceId });
  return deviceId;
}

// Get userId from storage
async function getUserId() {
  const result = await chrome.storage.sync.get(['userId']);
  return result.userId || null;
}

// Set userId
async function setUserId(userId) {
  await chrome.storage.sync.set({ userId });
}

// Register device
async function registerDevice() {
  const deviceId = await getDeviceId();
  const apiUrl = await getApiUrl();
  const userId = await getUserId();
  
  try {
    await fetch(`${apiUrl}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: deviceId,
        name: 'Browser Extension',
        type: 'laptop',
        userId: userId || null
      })
    });
  } catch (error) {
    console.error('Error registering device:', error);
  }
}

// Log usage to API
async function logUsage(serviceName, durationSeconds, requestCount) {
  const deviceId = await getDeviceId();
  const apiUrl = await getApiUrl();
  const userId = await getUserId();
  
  try {
    await fetch(`${apiUrl}/usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId,
        serviceName,
        durationSeconds,
        requestCount,
        userId: userId || null,
        metadata: {
          platform: 'browser',
          source: 'extension'
        }
      })
    });
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

// Detect AI service from URL
function detectAIService(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    for (const [domain, serviceName] of Object.entries(AI_SERVICES)) {
      if (hostname.includes(domain.replace('www.', ''))) {
        return serviceName;
      }
    }
    
    // Check for GitHub Copilot specifically
    if (hostname === 'github.com' && urlObj.pathname.includes('/copilot')) {
      return 'GitHub Copilot';
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const service = detectAIService(tab.url);
    if (service) {
      activeSessions.set(tabId, {
        service,
        startTime: Date.now(),
        url: tab.url
      });
    } else {
      activeSessions.delete(tabId);
    }
  }
});

// Handle tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      const service = detectAIService(tab.url);
      if (service) {
        // Save previous session if any
        if (lastActiveTab && sessionStartTime) {
          const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
          const requests = requestCounts.get(lastActiveTab.service) || 1;
          if (duration > 0) {
            logUsage(lastActiveTab.service, duration, requests);
          }
        }
        
        // Start new session
        lastActiveTab = { service, tabId: activeInfo.tabId };
        sessionStartTime = Date.now();
        requestCounts.set(service, 1);
      } else {
        // Save previous session
        if (lastActiveTab && sessionStartTime) {
          const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
          const requests = requestCounts.get(lastActiveTab.service) || 1;
          if (duration > 0) {
            logUsage(lastActiveTab.service, duration, requests);
          }
        }
        lastActiveTab = null;
        sessionStartTime = null;
      }
    }
  });
});

// Track requests (messages, queries, etc.)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.tabId && details.tabId > 0) {
      chrome.tabs.get(details.tabId, (tab) => {
        if (tab && tab.url) {
          const service = detectAIService(tab.url);
          if (service && lastActiveTab && lastActiveTab.service === service) {
            const currentCount = requestCounts.get(service) || 0;
            requestCounts.set(service, currentCount + 1);
          }
        }
      });
    }
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);

// Periodic save (every 5 minutes)
chrome.alarms.create('saveUsage', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'saveUsage' && lastActiveTab && sessionStartTime) {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const requests = requestCounts.get(lastActiveTab.service) || 1;
    if (duration > 30) { // Only log if more than 30 seconds
      logUsage(lastActiveTab.service, duration, requests);
      // Reset for next period
      sessionStartTime = Date.now();
      requestCounts.set(lastActiveTab.service, 1);
    }
  }
});

// Save session on extension close/unload
chrome.runtime.onSuspend.addListener(() => {
  if (lastActiveTab && sessionStartTime) {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const requests = requestCounts.get(lastActiveTab.service) || 1;
    if (duration > 0) {
      logUsage(lastActiveTab.service, duration, requests);
    }
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'registerDevice') {
    registerDevice().then(() => sendResponse({ success: true }));
    return true; // Will respond asynchronously
  }
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  registerDevice();
});

// Initialize on startup
registerDevice();
