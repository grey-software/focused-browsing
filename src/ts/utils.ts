const IFRAME_ClASS = 'focus-card'
function removeFocusedBrowsingCards() {
  try {
    let cards = document.getElementsByClassName(IFRAME_ClASS)
    Array.from(cards).forEach(function (el) {
      el.remove()
    })
  } catch (err) {
    //   sendLogToBackground(port,"CURRENTLY NO IFRAMES ON THE SCREEN")
  }
}

function clearElements(elements: any[]) {
  elements = []
}

export default { removeFocusedBrowsingCards, clearElements }
