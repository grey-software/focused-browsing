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

    if(changeInfo && changeInfo.status == "loading"){
      let result = await getInjectInfo(tabId)
      
      if(result && !result[0]){
        chrome.tabs.executeScript(tabId, {file: 'focus.js', runAt: 'document_start'})
        await chrome.tabs.executeScript(tabId, {
          code: 'document.isFocusScripInjected = true',
          runAt: 'document_start',
        });
      }
    }
}



async function getInjectInfo(tabId) {
  return new Promise(function (resolve, reject) {
      chrome.tabs.executeScript(tabId, {
        code: 'var check = document.isFocusScripInjected || false; check',
        runAt: 'document_start',
      }, function(result){
         resolve(result)
      })
  })
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