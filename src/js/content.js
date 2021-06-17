import TwitterController from './Twitter/TwitterController'
import LinkedInController from './LinkedIn/LinkedInController'
import utils from './utils'


const port = chrome.runtime.connect({ name: "Focused Browsing" });
const twitterController = new TwitterController(port)
const linkedController = new LinkedInController(port)
port.onMessage.addListener(focusListener)
utils.sendLogToBackground(port, "USER SESSION STARTED")

function focusListener(msg) {
  let action = msg.action
  let url = msg.url
  if (url.includes("twitter")){
    twitterController.handleActionOnPage(url,action)   
  }
  else if (url.includes("linkedin")){
    linkedController.handleActionOnPage(url,action)
  }
}
