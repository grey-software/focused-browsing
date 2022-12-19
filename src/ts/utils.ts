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

const isURLValid = (url: string) => {
  return (
    url.includes('twitter.com') ||
    url.includes('linkedin.com') ||
    url.includes('youtube.com') ||
    url.includes('github.com')
  )
}

function fixTestUrl(url: String) {
  return url.substring(0, url.indexOf('/__/#/specs'))
}

function isTestUrl(url: String) {
  return url.includes('/__/#/specs')
}

function createFocusCardIframe(width: string, height: string, styles: object): HTMLIFrameElement {
  let focusCardIframe = document.createElement('iframe')
  focusCardIframe.width = width
  focusCardIframe.height = height
  focusCardIframe.className = IFRAME_ClASS

  Object.assign(focusCardIframe.style, styles)
  return focusCardIframe
}

export { createFocusCardIframe, isURLValid, isTestUrl, removeFocusedBrowsingCards, fixTestUrl }
