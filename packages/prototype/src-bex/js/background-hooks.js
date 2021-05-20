/* Hooks added here can communicate between the BEX Background & Content Scripts
More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks
*/
var focusMode = {"twitter": {"focus": true, "initialized": false}, "linkedin":{"focus": true, "initialized": false} };


var isBackgroundHooksRegistered = false 

var refreshListener = false 

var isCommandListenerRegistered = false

var isTabListenerRegistered = false 




export default function attachBackgroundHooks(bridge /* , allActiveConnections */) {
  if (!isBackgroundHooksRegistered){
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var tab = tabs[0];
      var url = tab.url;
      if (url === "https://twitter.com/home") {
        initializeFocus("twitter",bridge)
      } else if (url === "https://www.linkedin.com/feed/") {
        initializeFocus("linkedin",bridge)
      }
  
      registerCommandListener(bridge)
      // registerTabsListener(bridge)
      isBackgroundHooksRegistered = !isBackgroundHooksRegistered
    });
  }else{
    console.log("WARNING: Background Hooks  initialized, skipping")
  }

}

function registerCommandListener(bridge) {
  // console.log(`INFO: Is Command listener registered? : ${isCommandListenerRegistered}`)

  // if (isCommandListenerRegistered) {
  //   console.log("WARNING: Command listener already registered, skipping")
  //   return
  // }

  function toggleFocusListener(command, tab) {
    chrome.tabs.get(tab.id, function (tab) {
      const currentURL = tab.url;
      console.log(currentURL)

      if (currentURL === "https://twitter.com/home") {
        console.log("sending message to twitter")
        toggleFocus("twitter", bridge)
      } else if (currentURL === "https://www.linkedin.com/feed/") {
        console.log("sending message to linkedin")
        toggleFocus("linkedin", bridge)
      }

    });
  }

  chrome.commands.onCommand.addListener(toggleFocusListener);

  isCommandListenerRegistered = true
  console.log("SUCCESS: Command listener registered")
}



function registerTabsListener(bridge){
  console.log(`INFO: Is Tab listener registered? : ${isTabListenerRegistered}`)

  if (isTabListenerRegistered) {
    console.log("WARNING: Tab listener already registered, skipping")
    return
  }


  function tabListener(tabId, changeInfo, tab){
    let url = tab.url
    if (url === "https://twitter.com/home") {
      if(focusMode["twitter"].focus){
        sendFocus("twitter",bridge)
      }
    } else if (url === "https://www.linkedin.com/feed/") {
      if(focusMode["linkedin"].focus){
        sendFocus("linkedin",bridge)
      }
    }


  }

  chrome.tabs.onUpdated.addListener(tabListener);
  isTabListenerRegistered = true
  console.log("SUCCESS: Tab listener registered")

}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}



function toggleFocus(webPage, bridge) {
  if (!focusMode[webPage].focus) {
    sendFocus(webPage,bridge)
  } else {
    sendUnFocus(webPage,bridge)
  }
  focusMode[webPage].focus = !focusMode[webPage].focus
}


function sendFocus(webPage,bridge){
  bridge.send("focus", {page: webPage }).then(response => {
    console.log('Successfully focused on ' + webPage)
  })
}

function sendUnFocus(webPage,bridge){
  bridge.send("un-focus", {page: webPage }).then(response => {
    console.log('Successfully un focused on ' + webPage)
  })
}


function initializeFocus(webPage,bridge){
  var initializeFocus = !focusMode[webPage].initialized || focusMode[webPage].focus
  if(initializeFocus){
    console.log("initializing focus")
    sendFocus(webPage,bridge)
    console.log(focusMode)
  }

  if (!focusMode[webPage].initialized){
    focusMode[webPage].initialized = !focusMode[webPage].initialized
    console.log(focusMode)
  }
}