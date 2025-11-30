// ============================================
// FILE 4: content.js
// (This runs on every webpage and removes elements)
// ============================================

// ====================================================
// CONFIGURATION SECTION - EDIT THESE TO ADD MORE
// ====================================================

// Add your website URLs here
// Format: "https://example.com/path/" will match anything starting with that URL

const WEBSITE_RULES = [
  {
    // Example: DataCamp courses
    urlPattern: "https://campus.datacamp.com/courses/",
    // Add CSS class selectors here (include the dot)
    // Example: ".annoying-banner", ".popup-ad", ".sidebar-ad"
    classesToRemove: [
      ".dc-paywall-content",
      ".dc-paywall-container",
      "[data-testid='modal-overlay']"
    ]
  },

  // ADD MORE WEBSITE RULES HERE
  // Just copy the block above and change the values
  /*
  {
    urlPattern: "https://another-site.com/blog/",
    classesToRemove: [
      ".ad-banner",
      ".popup"
    ]
  },
  */
];

// ====================================================
// END OF CONFIGURATION - CODE BELOW (Don't edit unless you know what you're doing)
// ====================================================

let isExtensionEnabled = true;
let observer = null;
let matchingRule = null;

// Initialize on load
init();

function init() {
  // Check if extension is enabled
  chrome.storage.sync.get(['enabled'], function(result) {
    isExtensionEnabled = result.enabled !== false;
    if (isExtensionEnabled) {
      startRemover();
    }
  });

  // Listen for storage changes (when toggle is clicked in popup)
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.enabled) {
      isExtensionEnabled = changes.enabled.newValue;
      if (isExtensionEnabled) {
        startRemover();
      } else {
        stopRemover();
      }
    }
  });
}

function startRemover() {
  const currentURL = window.location.href;
  
  console.log('Element Remover: Checking URL:', currentURL);
  console.log('Element Remover: Available rules:', WEBSITE_RULES.length);
  
  // Find matching rule for current website
  matchingRule = WEBSITE_RULES.find(rule => {
    const matches = currentURL.startsWith(rule.urlPattern);
    console.log('Element Remover: Does URL match', rule.urlPattern, '?', matches);
    return matches;
  });

  if (!matchingRule) {
    console.log('Element Remover: No matching rule found for this page');
    return;
  }

  console.log('Element Remover: Active on this page');
  console.log('Element Remover: Will remove:', matchingRule.classesToRemove);

  // Remove elements immediately
  removeElements();

  // If observer already exists, disconnect it first
  if (observer) {
    observer.disconnect();
  }

  // Watch for dynamically added elements
  observer = new MutationObserver(function(mutations) {
    if (isExtensionEnabled) {
      removeElements();
    }
  });

  // Start observing the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function stopRemover() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  console.log('Element Remover: Stopped');
}

function removeElements() {
  if (!matchingRule || !isExtensionEnabled) return;
  
  matchingRule.classesToRemove.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log('Element Remover: Looking for', selector, '- Found:', elements.length);
    elements.forEach(element => {
      element.remove();
      console.log('Element Remover: Removed', selector);
    });
  });
}