// ============================================
// FILE 3: popup.js
// (Controls the ON/OFF toggle)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const status = document.getElementById('status');

  // Load the current state from storage
  chrome.storage.sync.get(['enabled'], function(result) {
    toggleSwitch.checked = result.enabled !== false; // Default to true
    updateStatus(toggleSwitch.checked);
  });

  // When toggle is clicked, save the new state
  toggleSwitch.addEventListener('change', function() {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({ enabled: isEnabled }, function() {
      updateStatus(isEnabled);
    });
  });

  function updateStatus(enabled) {
    status.textContent = enabled ? '✓ Active' : '✗ Disabled';
    status.style.color = enabled ? '#4CAF50' : '#f44336';
  }
});