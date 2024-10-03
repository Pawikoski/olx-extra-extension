'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchCommentsHTML") {
    fetch('http://localhost:8000/api/comments')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(htmlContent => {
        sendResponse({ html: htmlContent });
      })
      .catch(error => {
        console.error('Fetch error:', error);
        sendResponse({ error: error.message });
      });
    return true; // Keep the message channel open for sendResponse
  }
});