function isValidUrl(url) {
  const pattern = /^https:\/\/bard\.google\.com\/.*$/;
  return pattern.test(url);
}


function showAlert() {
  alert('This extension only works on https://bard.google.com/*');
}


chrome.action.onClicked.addListener(function (tab) {
  if (isValidUrl(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["./dist/minimizedBardToMarkdown.js"],
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showAlert,
    });
  }
});
