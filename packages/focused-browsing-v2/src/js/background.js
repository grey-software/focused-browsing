var focusMode = {"twitter": {"focus": true, "initialized": false}, "linkedin":{"focus": true, "initialized": false} };

var activeURL;
var linkedinport;


chrome.runtime.onConnect.addListener(function (connectionPort) {
    console.assert(connectionPort.name == "Focused Browsing");
    port = connectionPort;
    console.log(connectionPort)

    port.onMessage.addListener(function (msg) {
      console.log("here")
      console.log(msg)
      activeURL = msg.url
      if (isURLTwitterHome(activeURL)) {
          console.log("here about to initalize twitter")
          initializeFocus("twitter")
          
      } else if (activeURL === "https://www.linkedin.com/feed/") {
          initializeFocus("linkedin")
          console.log("here about to initalize linkedIn")
      }
    });    
});


// chrome.tabs.onActivated.addListener(function(activeInfo, tab) {
//   chrome.tabs.getSelected(null,function(tab) {
//     activeURL = tab.url;
//     console.log("activeURL is: "+ activeURL)
//   });
// });


function tabListener(tabId, changeInfo, tab){
  let url = tab.url

  if(changeInfo && changeInfo.status === "complete" && url != activeURL){
    if(url.includes("twitter.com")){
        if(focusMode["twitter"].focus){
          if (isURLTwitterHome(url) & !(isURLTwitterHome(activeURL))) {
            console.log(url)
            console.log(activeURL)
            sendStatus("twitter","focus","initial")
          }else {
            sendStatus("twitter","focus","removeIframe")
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
  return url === "https://twitter.com/home" || url === "https://twitter.com/"
}




function toggleFocusListener(command,tab) {
  chrome.tabs.get(tab.id, function (tab) {
    activeURL = tab.url
    console.log(command)
    if (isURLTwitterHome(activeURL)) {
      console.log("sending message to twitter")
      toggleFocus("twitter")
    } else if (activeURL === "https://www.linkedin.com/feed/") {
      console.log("sending message to linkedin")
      toggleFocus("linkedin")
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
      toggleFocus(webPage)
    }
    sendResponse({enabled: "focus"})
    return true

  }
);






function toggleFocus(webPage) {
    if (!focusMode[webPage].focus) {
      console.log("focus mode on " + webPage)
      sendStatus(webPage,"focus",  "toggle")
    } else {
      console.log("unfocus mode on " + webPage)
      sendStatus(webPage,"unfocus", "toggle")
    }
    focusMode[webPage].focus = !focusMode[webPage].focus
}
  
  
function sendStatus(webPage,status,method){
  try{
    console.log("sending status " + status +" on "+webPage)
    // port.postMessage({"status":status, "method": method})

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let url = tabs[0].url
      chrome.tabs.sendMessage(tabs[0].id, {"url":url,"status":status, "method": method}, function(response) {
        console.log(response.farewell);
      });
    });

  }catch(err){
    console.log("background script hasn't initialized port")
  }
}
  

  
  
function initializeFocus(webPage){
    var initializeFocus = !focusMode[webPage].initialized || focusMode[webPage].focus
    if(initializeFocus){
      console.log("initializing focus")
      sendStatus(webPage,"focus","initial")
      console.log(focusMode)
    }
  
    if (!focusMode[webPage].initialized){
      focusMode[webPage].initialized = !focusMode[webPage].initialized
      console.log(focusMode)
    }
}