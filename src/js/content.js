import TwitterController from './Twitter/TwitterController'
import LinkedInController from './LinkedIn/LinkedInController'
import utils from './utils'


console.log("intializing port")
const port = chrome.runtime.connect({ name: "Focused Browsing" });
const twitterController = new TwitterController(port)
const linkedController = new LinkedInController(port)
port.onMessage.addListener(focusListener)
utils.sendLogToBackground(port, "USER SESSION STARTED")
console.log(document.URL)

function focusListener(msg) {
  let action = msg.action
  let url = msg.url

  console.log(msg)
  if (url.includes("twitter")){
    // twitterController.setPort(port)
    twitterController.handleActionOnPage(url,action)   
  }

  else if (url.includes("linkedin")){
    // linkedController.setPort(port)
    console.log("handling linkedin action")
    linkedController.handleActionOnPage(url,action)
  }
}
