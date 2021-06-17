var focusMode = { "twitter": { "focus": true }, "linkedin":{"focus":true}};

var activeURL;
var ports = {}

chrome.runtime.onConnect.addListener(function (connectionPort) {
  console.assert(connectionPort.name == "Focused Browsing");
  let tab_info = connectionPort.sender.tab
  ports[tab_info.id] = connectionPort
  ports[tab_info.id].onMessage.addListener(onLogRecieved)

  console.log("port established")
  console.log(tab_info)
});

function tabListener(tabId, changeInfo, tab) {
  let url = tab.url
  console.log(changeInfo)
  console.log("url is: "+ url)
  if (changeInfo && changeInfo.status == "complete") {
    if (url.includes("twitter.com")) {
      if (focusMode["twitter"].focus) {
        if (isURLTwitterHome(url) || url != "https://twitter.com/" & !url.includes("/i/display") ) {
          sendAction("focus")
        }
        activeURL = url
      }
    }else if(url.includes("linkedin.com")){
      console.log(url)
      console.log("I am here exploring linkedin")
      if(focusMode["linkedin"].focus){
        if(isURLLinkedInHome(url)){
          sendAction("focus")
        }
        activeURL = url
      }
    } 
  }
}

function toggleFocusListener(command, tab) {
  // chrome.tabs.get(tab.id, function (tab) {
  //   let url = tab.url
  //   console.log("url")
  //   if (url.includes("twitter.com")) {
  //     if (isURLTwitterHome(url) & !url.includes("/i/display")) {
  //       toggleFocus("twitter")
  //     }
  //   }
  // });

  console.log("I am here")
  console.log(activeURL)
  if (activeURL.includes("twitter.com")) {
    if (isURLTwitterHome(activeURL) & !activeURL.includes("/i/display")) {
      toggleFocus("twitter")
    }
  }else if(activeURL.includes("linkedin.com")){
    if (isURLLinkedInHome(activeURL)) {
      console.log("toggling focus on linkedin")
      toggleFocus("linkedin")
    }
  }

}

function toggleFromVue(request, sender, sendResponse) {
  activeURL = sender.tab.url

  let webPage = activeURL.includes("twitter.com") ? "twitter" : "linkedin"
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
      let tabID = tabs[0].id
      let port = getPortByID(tabID)
      let focusObject = {"url": activeURL, "action": action}
      console.log("sending message")
      console.log(focusObject)
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

function isURLLinkedInHome(url){
  return url == "https://www.linkedin.com/feed/"
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