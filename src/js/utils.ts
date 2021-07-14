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

function clearPanelElements(panel_elements: any[]) {
  panel_elements = []
}

export default { removeFocusedBrowsingCards, clearPanelElements }
