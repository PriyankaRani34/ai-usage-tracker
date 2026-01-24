// Mobile client for AI Usage Tracker
// This can be used in React Native, Expo, or as a web app

const API_URL = process.env.API_URL || 'http://YOUR_SERVER_IP:3000/api';

// Generate a persistent device ID (store in AsyncStorage/SharedPreferences)
async function getDeviceId() {
  // In React Native: use AsyncStorage
  // In web: use localStorage
  // For now, return a placeholder
  const storage = typeof localStorage !== 'undefined' ? localStorage : null;
  
  if (storage) {
    let deviceId = storage.getItem('ai_tracker_device_id');
    if (!deviceId) {
      deviceId = generateUUID();
      storage.setItem('ai_tracker_device_id', deviceId);
    }
    return deviceId;
  }
  
  return null;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Register device
async function registerDevice(deviceName, deviceType = 'mobile') {
  const deviceId = await getDeviceId();
  
  if (!deviceId) {
    console.error('Could not get device ID');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/devices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: deviceId,
        name: deviceName,
        type: deviceType
      })
    });
    
    const data = await response.json();
    console.log('Device registered:', deviceName);
    return data;
  } catch (error) {
    console.error('Error registering device:', error);
    return null;
  }
}

// Log AI usage
async function logUsage(serviceName, durationSeconds = 0, requestCount = 1, metadata = {}) {
  const deviceId = await getDeviceId();
  
  if (!deviceId) {
    console.error('Could not get device ID');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/usage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId,
        serviceName,
        durationSeconds,
        requestCount,
        metadata: {
          ...metadata,
          platform: 'mobile'
        }
      })
    });
    
    const data = await response.json();
    console.log(`Usage logged: ${serviceName}`);
    return data;
  } catch (error) {
    console.error('Error logging usage:', error);
    return null;
  }
}

// Helper functions for common AI services
export const trackChatGPT = (duration, messages) => 
  logUsage('ChatGPT', duration, messages, { app: 'mobile' });

export const trackClaude = (duration, messages) => 
  logUsage('Claude', duration, messages, { app: 'mobile' });

export const trackPerplexity = (duration, queries) => 
  logUsage('Perplexity', duration, queries, { app: 'mobile' });

// Auto-track when app comes to foreground (for React Native)
export function setupAutoTracking() {
  // This would be implemented based on your mobile framework
  // Example for React Native:
  /*
  import { AppState } from 'react-native';
  
  let currentService = null;
  let startTime = null;
  
  AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active' && currentService) {
      startTime = Date.now();
    } else if (nextAppState === 'background' && currentService && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      logUsage(currentService, duration, 1);
      startTime = null;
    }
  });
  */
}

export default {
  registerDevice,
  logUsage,
  trackChatGPT,
  trackClaude,
  trackPerplexity,
  setupAutoTracking
};
