var focusMode = {"twitter": {"focus": true}, "linkedin":{"focus": true}};

var activeURL;
var ports = []

chrome.runtime.onConnect.addListener(function (connectionPort) {
    console.assert(connectionPort.name == "Focused Browsing");
    let tab_info = connectionPort.sender.tab
    ports[tab_info.id] = connectionPort
});


chrome.tabs.onActivated.addListener(function(activeInfo, tab) {
  chrome.tabs.getSelected(null,function(tab) {
    let url = tab.url;
    if(url){
      if(url.includes("twitter.com") && focusMode["twitter"].focus){
        console.log("new tab url is: "+ url)
        if(isURLTwitterHome(url)){
          sendStatus("twitter","focus","tab")
        }
      }
    }
    
  });
});


function tabListener(tabId, changeInfo, tab){
  let url = tab.url
  if(changeInfo && changeInfo.status === "complete"){
    if(url.includes("twitter.com")){
      console.log(url)
      console.log(activeURL)
        if(focusMode["twitter"].focus){
          if (isURLTwitterHome(url)){
            sendStatus("twitter","focus","initial")
          }else if(url != "https://twitter.com/"){
            sendStatus("twitter","focus", "hidePanels")
          } 
          activeURL = url
        }
    } else if (url.includes("linkedin.com")) {
        if(focusMode["linkedin"].focus){
          sendStatus("linkedin","focus","tab")
        }
    }
  }

}

chrome.tabs.onUpdated.addListener(tabListener);




function isURLTwitterHome(url){
  return url === "https://twitter.com/home" 
}




function toggleFocusListener(command,tab) {
  chrome.tabs.get(tab.id, function (tab) {
    let url = tab.url
    console.log(command)
    if(url.includes("twitter.com")){
      if(isURLTwitterHome(url)) {
        console.log("sending message to twitter")
        toggleFocus("twitter","toggle")
      }else{
        toggleFocus("twitter","hidePanels")

      }

    }else if (url === "https://www.linkedin.com/feed/") {
      console.log("sending message to linkedin")
      toggleFocus("linkedin","toggle")
    }
  });
}
chrome.commands.onCommand.addListener(toggleFocusListener);








  
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    
    activeURL = sender.tab.url

    let webPage = activeURL.includes("twitter.com") ? "twitter" : "linkedin"
    if (request.status == "focus"){
      toggleFocus(webPage,"toggle")
    }
    sendResponse({enabled: "focus"})
    return true

  }
);






function toggleFocus(webPage,method) {
    if (!focusMode[webPage].focus) {
      console.log("focus mode on " + webPage)
      sendStatus(webPage,"focus",  method)
    } else {
      console.log("unfocus mode on " + webPage)
      sendStatus(webPage,"unfocus", method)
    }
    focusMode[webPage].focus = !focusMode[webPage].focus
}
  
  
function sendStatus(webPage,status,method){
  try{
    console.log("sending status " + status +" on "+webPage)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let url = tabs[0].url
      let tabID = tabs[0].id
      console.log("sending message to this ID")
      console.log(tabID)
      let port = getPortByID(tabID)
      let focusObject = {"url":url,"status":status, "method": method}
      port.postMessage(focusObject)
    });

  }catch(err){
    console.log("background script hasn't initialized port")
  }
}



function getPortByID(tabID){
  return ports[tabID]
}
  

  
  
function initializeFocus(webPage){
    var initializeFocus = focusMode[webPage].focus
    if(initializeFocus){
      console.log("initializing focus")
      sendStatus(webPage,"focus","initial")
      console.log(focusMode)
    }
}