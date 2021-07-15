import { browser } from "webextension-polyfill-ts"
const LINKEDIN_FEED_FRAME_HEIGHT = '1000px'
const LINKEDIN_FEED_FRAME_WIDTH = '549px'
const IFRAME_ClASS = 'focus-card'

function createLinkedInIframe() {
  let feedIframe = document.createElement('iframe')

  feedIframe.width = LINKEDIN_FEED_FRAME_WIDTH
  feedIframe.height = LINKEDIN_FEED_FRAME_HEIGHT
  feedIframe.className = IFRAME_ClASS

  Object.assign(feedIframe.style, {
    position: 'inherit',
    border: 'none',
  })

  return feedIframe
}

function setIframeSource(feedIframe: HTMLIFrameElement) {
  feedIframe.src = browser.runtime.getURL('www/linkedin/feed/linkedInFeed.html')
}

function injectFeedIframe(feedIframe:HTMLIFrameElement, feed:Element) {
  setIframeSource(feedIframe)
  feed.append(feedIframe)
}

export default { createLinkedInIframe, setIframeSource, injectFeedIframe }
