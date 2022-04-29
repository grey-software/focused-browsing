import { browser } from 'webextension-polyfill-ts'
const FACEBOOK_FEED_FRAME_HEIGHT = '700px'
const FACEBOOK_FEED_FRAME_WIDTH = '600px'
const IFRAME_ClASS = 'focus-card'

function createInstagramIframe(): HTMLIFrameElement {
  let feedIframe = document.createElement('iframe')

  feedIframe.width = FACEBOOK_FEED_FRAME_WIDTH
  feedIframe.height = FACEBOOK_FEED_FRAME_HEIGHT
  feedIframe.className = IFRAME_ClASS

  Object.assign(feedIframe.style, {
    position: 'inherit',
    border: 'none',
  })

  return feedIframe
}

function setIframeSource(feedIframe: HTMLIFrameElement): void {
  let rootNode = document.getElementsByTagName('html')[0]
  let isDarkMode = rootNode.classList.contains('__fb-dark-mode')

  if (isDarkMode) {
    feedIframe.src = browser.runtime.getURL('html/instagramDark.html')
  } else {
    feedIframe.src = browser.runtime.getURL('html/instagram.html')
  }
}

function injectFeedIframe(feedIframe: HTMLIFrameElement, feed: Element): void {
  setIframeSource(feedIframe)
  feed.append(feedIframe)
}

export default { createInstagramIframe, setIframeSource, injectFeedIframe }
