
var focusMode = { "twitter": { "focus": true }, "linkedin":{"focus":true}};

var activeURL;

const injectedTabs = new Set()

async function tabListener(tabId, changeInfo, tab) {

  let url = tab.url
  console.log(changeInfo)
   if (changeInfo && changeInfo.status == "loading") {
    if (url.includes("twitter.com")) {
      if (focusMode["twitter"].focus) {
        if (isURLTwitterHome(url) || url != "https://twitter.com/" & !url.includes("/i/display") ) {
          await chrome.tabs.executeScript(tab.id, 
            {code: "var currentURL = " + JSON.stringify(url) + ";"},
            function(){
              chrome.tabs.executeScript(tab.id ,{file: 'TwitterFocus.js'})
            });
        }
        activeURL = url
      }
    }else if(url.includes("linkedin.com")){
      if(focusMode["linkedin"].focus){
        if(isURLLinkedInHome(url)){
          console.log("about to excuting: "+ new Date().toLocaleTimeString())
          await chrome.tabs.executeScript(tab.id, {file: 'LinkedInFocus.js', runAt: 'document_start'});

        }
        activeURL = url
      }
    } 
  }
}

function toggleFocusListener(command, tab) {
  console.log(command)
  // if (activeURL.includes("twitter.com")) {
  //   if (isURLTwitterHome(activeURL) & !activeURL.includes("/i/display")) {
  //     toggleFocus("twitter")
  //   }
  // }else if(activeURL.includes("linkedin.com")){
  //   if (isURLLinkedInHome(activeURL)) {
  //     toggleFocus("linkedin")
  //   }
  // }

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
  
}


function postMessageToContent(port, focusObject){
    port.postMessage(focusObject)
}

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