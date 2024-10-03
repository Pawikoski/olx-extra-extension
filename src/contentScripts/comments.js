'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts


function fetchAndAppendCommentsSection(el) {
  chrome.runtime.sendMessage({ action: "fetchCommentsHTML" }, (response) => {
    if (response.error) {
      console.error('Error fetching HTML:', response.error);
    } else {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = response.html; // Set the HTML content
      el.insertAdjacentElement("afterend", tempDiv.firstChild);
    }
  });
}

// Function to add content to the Offers page
function addCommentsToOfferPage() {
  const insertAfter = document.querySelector('div[data-testid="aside"] > div:nth-child(1)')
  fetchAndAppendCommentsSection(insertAfter);
}

setTimeout(addCommentsToOfferPage, 3000)

