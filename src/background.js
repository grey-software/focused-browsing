var currentData = {"twitter": false, "linkedin":false}
var focusDB = "focusDB"

chrome.storage.local.clear()
chrome.storage.local.set({focusDB: currentData });
chrome.storage.local.get(focusDB, function(data){
  console.log(data)
})


var activeURL;
var injectedTabs = new Set()


async function tabListener(tabId, changeInfo) {

    if (injectedTabs.has(tabId)) return 


    injectedTabs.add(tabId)

    chrome.tabs.executeScript(tabId, {file: 'focus.js', runAt: 'document_start'},function(results) {
      console.log(results)
      // if (chrome.runtime.lastError || !results || !results.length) {
      //     return;  // Permission error, tab closed, etc.
      // }
      // if (results[0] !== true) {
      //     // Not already inserted before, do your thing, e.g. add your CSS:
      //     chrome.tabs.insertCSS(tabId, { file: 'yourstylesheet.css' });
      // }
  });


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