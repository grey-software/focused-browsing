

var currentData = {"twitter": true, "linkedin":true}
var focusDB = "focusDB"

chrome.storage.local.clear()
chrome.storage.local.set({focusDB: currentData });
chrome.storage.local.get(focusDB, function(data){
  console.log(data)
})


var activeURL;
var injectedTabs = new Set()


async function tabListener(tabId, changeInfo) {
    if(changeInfo && changeInfo.status == "loading"){
      console.log("here")
      await chrome.tabs.executeScript(tabId, {file: 'focus.js', runAt: 'document_start'});
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



function postMessageToContent(port, focusObject){
    port.postMessage(focusObject)
}

chrome.tabs.onUpdated.addListener(tabListener);
chrome.runtime.onMessage.addListener(toggleFromVue);

function isURLTwitterHome(url) {
  return url == "https://twitter.com/home"
}

function isURLLinkedInHome(url){
  return url == "https://www.linkedin.com/feed/"
}


function getPortByID(tabID) {
  return ports[tabID]
}