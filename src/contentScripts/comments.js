'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts


function getUserInfo() {
  const user = document.querySelector("div[data-testid=dropdown-user-id]");
  let userId;
  let userName;
  if (user && user.textContent) {
    userId = user.textContent;
    userName = user.parentElement.textContent.replace(userId, "");
    userId = userId.replace("id: ", "");
  }
  return [userId, userName];
}

function getOfferId() {
  const adFooter = document.querySelector("div[data-cy=ad-footer-bar-section]");
  const offerIdElement = adFooter.firstChild;
  const offerId = offerIdElement.textContent.toLowerCase().replace("id: ", "");
  return offerId;
}


function onSubmitHandler(e) {
  e.preventDefault();

  const [userId, userName] = getUserInfo();

  const formData = new FormData(e.target);
  const content = formData.get("comment");
  const offerId = getOfferId();
  const author = userName;

  chrome.runtime.sendMessage({
    action: "newComment",
    data: { offerId, content, author }
  }, (response) => {
    if (response.success) {
      // Remove comments container
      // TODO: instead of remove, add element with spinner while loading
      document.querySelector(".comments-container").remove();

      // Add comments container again
      addCommentsToOfferPage();
    } else {
      console.log(false)
    }
  })
}

function fetchAndAppendCommentsSection(el) {
  const offerId = getOfferId();
  chrome.runtime.sendMessage({ action: "fetchCommentsHTML", data: { offerId } }, (response) => {
    if (response.error) {
      console.error('Error fetching HTML:', response.error);
    } else {

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = response.html; // Set the HTML content
      const commentForm = tempDiv.querySelector(".comment-form");
      commentForm.addEventListener("submit", onSubmitHandler)
      el.insertAdjacentElement("afterend", tempDiv.firstChild);

      const [userId, userName] = getUserInfo();
      if (userName) {
        commentForm.querySelector("#comment-username").innerHTML = `${userName} (${userId})`;
      }

    }
  });
}

// Function to add content to the Offers page
function addCommentsToOfferPage() {
  const insertAfter = document.querySelector('div[data-testid="aside"] > div:nth-child(1)')
  fetchAndAppendCommentsSection(insertAfter);

}

setTimeout(addCommentsToOfferPage, 3000)

