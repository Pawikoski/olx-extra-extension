'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchCommentsHTML") {
    const { offerId } = request.data;
    fetch(`http://localhost:8000/api/comments/?offer_id=${offerId}`, {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
      }
    })
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
  else if (request.action === "newComment") {
    const { offerId, content, author } = request.data;

    const formData = new URLSearchParams();
    formData.append('offer_id', offerId);
    formData.append('content', content);
    if (author) {
      formData.append('author_name', author);
    } else {
      formData.append('author_name', "Anonim");
    }

    fetch('http://localhost:8000/api/comments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: "include"
    })
      .then(response => {
        if (response.ok) {
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
      })
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    return true;
  }
});