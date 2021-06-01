var focusMode = { "twitter": { "focus": true } };

var activeURL;
var ports = {}

chrome.runtime.onConnect.addListener(function (connectionPort) {
  console.assert(connectionPort.name == "Focused Browsing");
  let tab_info = connectionPort.sender.tab
  ports[tab_info.id] = connectionPort
  ports[tab_info.id].onMessage.addListener(onLogRecieved)
});

function tabListener(tabId, changeInfo, tab) {
  let url = tab.url
  if (changeInfo && changeInfo.status == "complete") {
    if (url.includes("twitter.com")) {
      if (focusMode["twitter"].focus) {
        if (isURLTwitterHome(url)) {
          sendAction("focus")
        } else if (url != "https://twitter.com/" & !url.includes("/i/display")) {
          sendAction("focus")
        }
        activeURL = url
      }
    }
  }
}

function toggleFocusListener(command, tab) {
  chrome.tabs.get(tab.id, function (tab) {
    let url = tab.url
    if (url.includes("twitter.com")) {
      if (isURLTwitterHome(url)) {
        toggleFocus("twitter")
      } else {
        toggleFocus("twitter")
      }
    }
  });
}

function toggleFromVue(request, sender, sendResponse) {
  activeURL = sender.tab.url

  let webPage = activeURL.includes("twitter.com") ? "twitter" : ""
  if (request.intent == "unfocus") {
    toggleFocus(webPage)
  }
}

function onLogRecieved(msg){
  if(msg.event == "log"){
    let log = msg.log
    console.log(log)
  }
}

function sendAction(action) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let url = tabs[0].url
      let tabID = tabs[0].id
      let port = getPortByID(tabID)
      let focusObject = {"url": url, "action": action}
      port.postMessage(focusObject)
    });

  } catch (err) {
    console.log("background script hasn't initialized port")
  }
}

chrome.tabs.onUpdated.addListener(tabListener);
chrome.tabs.onUpdated.addListener(tabListener);
chrome.commands.onCommand.addListener(toggleFocusListener);
chrome.runtime.onMessage.addListener(toggleFromVue);

function isURLTwitterHome(url) {
  return url == "https://twitter.com/home"
}

function toggleFocus(webPage) {
  if (!focusMode[webPage].focus) {
    sendAction("focus")
  } else {
    sendAction("unfocus")
  }
  focusMode[webPage].focus = !focusMode[webPage].focus
}

function getPortByID(tabID) {
  return ports[tabID]
}