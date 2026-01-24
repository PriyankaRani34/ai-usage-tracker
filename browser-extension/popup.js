// Load saved settings
chrome.storage.sync.get(['apiUrl', 'deviceId'], (result) => {
  if (result.apiUrl) {
    document.getElementById('apiUrl').value = result.apiUrl;
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
  chrome.storage.sync.set({ apiUrl }, () => {
    checkConnection(apiUrl);
    alert('Settings saved!');
  });
});
