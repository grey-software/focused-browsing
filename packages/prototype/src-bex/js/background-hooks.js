/* Hooks added here can communicate between the BEX Background & Content Scripts
More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks
*/
const focusMode = { "twitter": true, "linkedin": true };

var isCommandListenerRegistered = false

export default function attachBackgroundHooks(bridge /* , allActiveConnections */) {
  console.log(`INFO: Is Command listener registered? : ${isCommandListenerRegistered}`)

  registerCommandListener(bridge)
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
  if (focusMode[webPage]) {
    bridge.send("focus")
  } else {
    bridge.send("un-focus")
  }
  focusMode[webPage] = !focusMode[webPage]
}