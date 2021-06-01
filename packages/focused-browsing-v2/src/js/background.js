var focusMode = {"twitter": {"focus": true}};

var activeURL;
var ports = []

chrome.runtime.onConnect.addListener(function (connectionPort) {
    console.assert(connectionPort.name == "Focused Browsing");
    let tab_info = connectionPort.sender.tab
    ports[tab_info.id] = connectionPort
});

function tabListener(tabId, changeInfo, tab){
  let url = tab.url
  if(changeInfo && changeInfo.status === "complete"){
    if(url.includes("twitter.com")){
        if(focusMode["twitter"].focus){
          if (isURLTwitterHome(url)){
            sendStatus("twitter","focus","initial")
          }else if(url != "https://twitter.com/" & !url.includes("/i/display")){
            sendStatus("twitter","focus", "hidePanels")
          } 
          activeURL = url
        }
    }
  }
}

function toggleFocusListener(command,tab) {
  chrome.tabs.get(tab.id, function (tab) {
    let url = tab.url
    if(url.includes("twitter.com")){
      if(isURLTwitterHome(url)) {
        toggleFocus("twitter","toggle")
      }else{
        toggleFocus("twitter","hidePanels")
      }
    }
  });
}

function toggleFromVue(request, sender, sendResponse) {  
  activeURL = sender.tab.url

  let webPage = activeURL.includes("twitter.com") ? "twitter" : ""
  if (request.status == "focus"){
    toggleFocus(webPage,"toggle")
  }
  sendResponse({enabled: "focus"})
  return true

}

function sendStatus(webPage,status,method){
  try{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let url = tabs[0].url
      let tabID = tabs[0].id
      let port = getPortByID(tabID)
      let focusObject = {"url":url,"status":status, "method": method}
      port.postMessage(focusObject)
    });

  }catch(err){
    console.log("background script hasn't initialized port")
  }
}


chrome.tabs.onUpdated.addListener(tabListener);
chrome.tabs.onUpdated.addListener(tabListener);
chrome.commands.onCommand.addListener(toggleFocusListener);
chrome.runtime.onMessage.addListener(toggleFromVue);




function isURLTwitterHome(url){
  return url === "https://twitter.com/home" 
}



function toggleFocus(webPage,method) {
    if (!focusMode[webPage].focus) {
      sendStatus(webPage,"focus",  method)
    } else {
      sendStatus(webPage,"unfocus", method)
    }
    focusMode[webPage].focus = !focusMode[webPage].focus
}
  


function getPortByID(tabID){
  return ports[tabID]
}