import TwitterController from './Twitter/TwitterController'
import utils from './utils'

const port = chrome.runtime.connect({ name: "Focused Browsing" });
const twitterController = new TwitterController(port)
port.onMessage.addListener(focusListener)
utils.sendLogToBackground(port, "USER SESSION STARTED")

function focusListener(msg) {
  let action = msg.action
  let url = msg.url

  if (url.includes("twitter")){
    twitterController.handleActionOnPage(url,action)   
  }
}
