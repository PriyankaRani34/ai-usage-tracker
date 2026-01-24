#!/usr/bin/env node

/**
 * Test script for automatic tracking
 * This simulates automatic tracking to verify the system works
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Get or create device ID
const DEVICE_ID_FILE = require('path').join(os.homedir(), '.ai-tracker-device-id');
const fs = require('fs');

function getDeviceId() {
  if (fs.existsSync(DEVICE_ID_FILE)) {
    return fs.readFileSync(DEVICE_ID_FILE, 'utf8').trim();
  }
  const deviceId = uuidv4();
  fs.writeFileSync(DEVICE_ID_FILE, deviceId);
  return deviceId;
}

async function testTracking() {
  console.log('🧪 Testing Automatic Tracking System\n');
  
  const deviceId = getDeviceId();
  const deviceName = os.hostname();
  
  // Register device
  try {
    await axios.post(`${API_URL}/devices`, {
      id: deviceId,
      name: deviceName,
      type: 'laptop'
    });
    console.log('✅ Device registered successfully');
  } catch (error) {
    console.error('❌ Error registering device:', error.message);
    return;
  }
  
  // Simulate automatic tracking sessions
  const testSessions = [
    { service: 'ChatGPT', duration: 120, requests: 3, description: 'ChatGPT conversation' },
    { service: 'Claude', duration: 180, requests: 5, description: 'Claude chat session' },
    { service: 'Cursor', duration: 600, requests: 15, description: 'Cursor coding session' },
    { service: 'GitHub Copilot', duration: 0, requests: 20, description: 'Copilot suggestions' },
    { service: 'Perplexity', duration: 90, requests: 2, description: 'Perplexity search' }
  ];
  
  console.log('\n📊 Simulating automatic tracking sessions...\n');
  
  for (const session of testSessions) {
    try {
      await axios.post(`${API_URL}/usage`, {
        deviceId,
        serviceName: session.service,
        durationSeconds: session.duration,
        requestCount: session.requests,
        metadata: {
          source: 'automatic-test',
          description: session.description,
          platform: 'test'
        }
      });
      console.log(`✅ Logged: ${session.service} - ${session.duration}s, ${session.requests} requests`);
      // Small delay between logs
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error logging ${session.service}:`, error.message);
    }
  }
  
  // Wait a moment for data to be processed
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get summary
  console.log('\n📈 Fetching summary statistics...\n');
  try {
    const summaryRes = await axios.get(`${API_URL}/usage/summary?period=1d`);
    const summary = summaryRes.data;
    
    console.log('Summary Statistics:');
    console.log(`  Devices: ${summary.device_count}`);
    console.log(`  Services: ${summary.service_count}`);
    console.log(`  Total Duration: ${Math.floor(summary.total_duration / 60)} minutes`);
    console.log(`  Total Requests: ${summary.total_requests}`);
    console.log(`  Total Sessions: ${summary.total_sessions}`);
    
    // Get recent stats
    const statsRes = await axios.get(`${API_URL}/usage/stats?period=1d`);
    const stats = statsRes.data;
    
    console.log('\n📋 Recent Activity:');
    stats.slice(0, 5).forEach(stat => {
      const minutes = Math.floor(stat.total_duration / 60);
      const seconds = stat.total_duration % 60;
      console.log(`  ${stat.service_name} on ${stat.device_name}: ${minutes}m ${seconds}s, ${stat.total_requests} requests`);
    });
    
    console.log('\n✅ Test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Open http://localhost:3000 to view the dashboard');
    console.log('   2. Install the browser extension for automatic web tracking');
    console.log('   3. Run "npm run monitor" for desktop app tracking');
    
  } catch (error) {
    console.error('❌ Error fetching summary:', error.message);
  }
}

// Run test
testTracking().catch(console.error);
