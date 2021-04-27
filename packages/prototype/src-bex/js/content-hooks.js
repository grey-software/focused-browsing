// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks
const FEED_CLASS = "css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu";
const PANEL_CLASS = "css-1dbjc4n r-1ihkh82 r-1in3vh1 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x"

const
  iFrame = document.createElement('iframe'),
  defaultFrameHeight = '100px',
  defaultFrameWidth = '120px'

  const currentUrl = window.document.URL
console.log(currentUrl)

export default function attachContentHooks (bridge) {
  // handle event
  bridge.on('focus', function (event) {
    console.log("focus mode")
    document.getElementsByClassName(FEED_CLASS)[1].style.visibility = "hidden"
    document.getElementsByClassName(PANEL_CLASS)[0].style.visibility = "hidden"
  })

  bridge.on('un-focus', function (event) {
    console.log("unfocus mode")
    document.getElementsByClassName(FEED_CLASS)[1].style.visibility = "visible"
    document.getElementsByClassName(PANEL_CLASS)[0].style.visibility = "visible"
  })


}


const setIFrameDimensions = (height, width) => {
  iFrame.height = height
  iFrame.width = width
  document.body.style.paddingLeft = width
}

// create iframe
function createIframe () {
  // const iframe = document.createElement('iframe')
  // iframe.width = '120px'
  // iframe.height = '100px'
  setIFrameDimensions(defaultFrameHeight, defaultFrameWidth)
  Object.assign(iFrame.style, {
    position: 'fixed',
    border: 'none',
    zIndex: '10000'
  })

  iFrame.src = chrome.runtime.getURL('www/index.html')
  console.log(iFrame.src)
  return iFrame
}


;(function () {
  // When the page loads, insert our browser extension code.
  var iFrame = createIframe() 
  iFrame.src = chrome.runtime.getURL('www/index.html')
  // document.body.prepend(iFrame)

  // document.getElementsByClassName("css-1dbjc4n r-1awozwy")[0].append(iFrame)
})()