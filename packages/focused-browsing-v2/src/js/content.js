const IFRAME_ClASS = "focus-card";


import TwitterStrategy from './siteStrategy/Twitter/TwitterStrategy'

var port; 
var twitterStrategy

;(function () {
  port = chrome.runtime.connect({name: "Focused Browsing"});
  port.onMessage.addListener(focusListener)
  twitterStrategy = new TwitterStrategy()

})()

function focusListener(msg) {
  let status = msg.status
  let method = msg.method
  let url = msg.url
  if (status == "focus"){
     if (url.includes("twitter")) {
          twitterStrategy.clearPanelElements()
          if(method == "initial"){
            twitterStrategy.focusTwitter();
          }else if(method == "hidePanels"){
             twitterStrategy.focusTwitterPanel();
          }else{
             twitterStrategy.toggleTwitterHomeDistractions(true);
          }
      }
  }else if(msg.status == "unfocus"){
      if (url.includes("twitter")) {
          if(url.includes("/home")){
            removeCards()
            twitterStrategy.toggleTwitterHomeDistractions(false)
          }else{
            twitterStrategy.hideTwitterPanel(false)
          }
          removeCards()
      }
  }
}




function removeCards(){
  try{
    let cards = document.getElementsByClassName(IFRAME_ClASS)
    Array.prototype.forEach.call(cards, function(el) {
      el.remove()
    });
  }catch(err){
    console.log("the iframe is not on the screen")
  }
}
  
