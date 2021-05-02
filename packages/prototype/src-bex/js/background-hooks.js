/* Hooks added here can communicate between the BEX Background & Content Scripts
More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks
*/
var focusMode = {"twitter": {"focus": false, "initial": true}, "linkedin":{"focus": false, "initial": true} };

var isCommandListenerRegistered = false

export default function attachBackgroundHooks(bridge /* , allActiveConnections */) {

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.log(focusMode)
    if (url === "https://twitter.com/home") {
      initializeFocus("twitter",bridge)
    } else if (url === "https://www.linkedin.com/feed/") {
      initializeFocus("linkedin",bridge)
    }

    registerCommandListener(bridge)
  });
}

function registerCommandListener(bridge) {
  console.log(`INFO: Is Command listener registered? : ${isCommandListenerRegistered}`)

  if (isCommandListenerRegistered) {
    console.log("WARNING: Command listener already registered, skipping")
    return
  }

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



function toggleFocus(webPage, bridge) {
  if (focusMode[webPage].focus) {
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
  var initializeFocus = focusMode[webPage].initial || !focusMode[webPage].focus
  if(initializeFocus){
    console.log("initializing focus")
    sendFocus(webPage,bridge)
    console.log(focusMode)
  }

  if (focusMode[webPage].initial){
    focusMode[webPage].initial = !focusMode[webPage].initial
    console.log(focusMode)
  }
}