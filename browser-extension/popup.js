// Load saved settings
chrome.storage.sync.get(['apiUrl', 'deviceId', 'userId'], (result) => {
  if (result.apiUrl) {
    document.getElementById('apiUrl').value = result.apiUrl;
  }
  if (result.userId) {
    document.getElementById('userId').value = result.userId;
  }
  
  // Check connection
  checkConnection(result.apiUrl || 'http://localhost:3000/api');
});

// Check API connection
async function checkConnection(apiUrl) {
  const statusDiv = document.getElementById('status');
  try {
    const response = await fetch(`${apiUrl}/devices`);
    if (response.ok) {
      statusDiv.textContent = '✓ Connected';
      statusDiv.className = 'status active';
    } else {
      throw new Error('Connection failed');
    }
  } catch (error) {
    statusDiv.textContent = '✗ Not Connected';
    statusDiv.className = 'status inactive';
  }
}

// Save settings
document.getElementById('save').addEventListener('click', () => {
  const apiUrl = document.getElementById('apiUrl').value;
  const userId = document.getElementById('userId').value.trim() || null;
  chrome.storage.sync.set({ apiUrl, userId }, () => {
    checkConnection(apiUrl);
    if (userId) {
      alert('Settings saved! Your device will now track usage for user: ' + userId);
      // Re-register device with userId
      chrome.runtime.sendMessage({ action: 'registerDevice' });
    } else {
      alert('Settings saved! Note: Add User ID to track usage across devices.');
    }
  });
});
