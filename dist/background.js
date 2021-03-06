bananoAddressCache = {};

chrome.runtime.onMessage.addListener(function (
  { bananoDonateEntries },
  { tab },
  sendResponse
) {
  // Only continue if URL doesn't start with "chrome://"
  if (
    !tab.url.startsWith("chrome://") ||
    !tab.url.startsWith("https://chrome.google.com")
  ) {
    // Valid banano address/es found so add tab details to cache
    if (bananoDonateEntries.length) {
      bananoAddressCache[tab.id] = {
        url: tab.url,
        bananoDonateEntries,
        id: tab.id,
        title: tab.title,
        banActive: true,
      };
      localStorage.setItem("user", JSON.stringify({ ...bananoAddressCache }));
      chrome.browserAction.setIcon({
        path: "images/icon128.png",
        tabId: tab.id,
      });
      // No banano addresses found so remove tab details from cache
    } else {
      chrome.browserAction.setIcon({
        path: "images/icon128_inactive.png",
        tabId: tab.id,
      });
    }
  }
});

// ---------------------------------------------------

// When tab removed (closed)
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  const bananoAddressCache = localStorage.getItem("user");
  if (bananoAddressCache) {
    const deletedJson = JSON.parse(bananoAddressCache);
    if (deletedJson[tabId] !== null) {
      delete deletedJson[tabId];
      localStorage.setItem("user", JSON.stringify(deletedJson));
    }
  }
});

// ====================================================
//when the tab replace url
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    !tab.url.startsWith("chrome://") ||
    !tab.url.startsWith("https://chrome.google.com")
  ) {
    const bananoAddressCache = localStorage.getItem("user");
    if (bananoAddressCache) {
      const updateTab = JSON.parse(bananoAddressCache);
      if (updateTab[tabId] === null) {
        if (updateTab[tabId].url.indexOf(tab.url) === -1) {
          delete updateTab[tabId];
          localStorage.setItem("user", JSON.stringify(updateTab));
        }
      }
    }
  }
});

// //onInstall script
// chrome.runtime.onInstalled.addListener(function () {
//   chrome.tabs.query({ currentWindow: true }, function (tabs) {
//     tabs.forEach(function (tab) {
//       if (
//         !tab.url.startsWith("chrome://") ||
//         !tab.url.startsWith("https://chrome")
//       ) {
//         var code = "window.location.reload();";
//         chrome.tabs.executeScript(tab.id, { code: code });
//       }
//     });
//   });
// });
