var currentURL;
var port;
var focus = true;

chrome.runtime.onConnect.addListener(function (connectionPort) {
  console.assert(connectionPort.name == "TwitterFocus");
  port = connectionPort;

  port.onMessage.addListener(function (msg) {
    sendStatus(msg.url, port);
    currentURL = msg.url
  });
});



chrome.browserAction.onClicked.addListener(function () {
 
  try{
    if ((!currentURL.includes("/explore") && !currentURL.includes("/messages")) && currentURL.includes("twitter.com")) {
      if (!focus) {
        if (currentURL == "https://twitter.com/home") {
          port.postMessage({ status: "focus-home" });
        } else {
          port.postMessage({ status: "focus" })
        }
      } else {
        if (currentURL == "https://twitter.com/home") {
          port.postMessage({ status: "unfocus-home" });
        } else {
          port.postMessage({ status: "unfocus" });
        }
      }
  
      focus = !focus;
    }

  }catch(err){
    console.log("Looks like port or url is not defined")
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  
  try{
    if (changeInfo.url && changeInfo.url.includes("twitter.com")) {
      sendStatus(changeInfo.url, port);
      currentURL = changeInfo.url
    }
  }
  catch(err){
    console.log("Looks like port or url is not defined");
  }

});


function sendStatus (url, port) {
  if (url.includes("twitter.com/home")) {
    if (focus) {
      port.postMessage({ status: "focus-home" });
    }
  } else if (focus && !url.includes("/explore") && !url.includes("/messages") && !url.includes("/i/display")) {
    port.postMessage({ status: "focus" });
  } else {
    port.postMessage({ status: "messages-explore" });
  }
}
