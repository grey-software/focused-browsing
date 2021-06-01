const IFRAME_ClASS = "focus-card";
function removeFocusedBrowsingCards() {
    try {
      let cards = document.getElementsByClassName(IFRAME_ClASS)
      Array.from(cards).forEach(function (el) {
        // console.log(cards)
        console.log(el)
        el.remove()
      });
    } catch (err) {
    //   sendLogToBackground(port,"CURRENTLY NO IFRAMES ON THE SCREEN")
    }
}

function sendLogToBackground(port, log){
    port.postMessage({event: "log", log: log})
}

module.exports = { removeFocusedBrowsingCards, sendLogToBackground }
