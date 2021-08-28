import { browser } from 'webextension-polyfill-ts'
const YOUTUBE_FEED_FRAME_HEIGHT = '100%'
const YOUTUBE_FEED_FRAME_WIDTH = '100%'
const DARK_MODE_COLOUR = 'rgb(24, 24, 24)'
const IFRAME_ClASS = 'focus-card'

function createYouTubeFeedIframe(): HTMLIFrameElement {
  let feedIframe = document.createElement('iframe')

  feedIframe.width = YOUTUBE_FEED_FRAME_HEIGHT
  feedIframe.height = YOUTUBE_FEED_FRAME_WIDTH
  feedIframe.className = IFRAME_ClASS

  Object.assign(feedIframe.style, {
    position: 'fixed',
    border: 'none',
  })

  return feedIframe
}

function setIframeSource(feedIframe: HTMLIFrameElement, currentBackgroundColor: string): void {
  if (currentBackgroundColor == DARK_MODE_COLOUR) {
    feedIframe.src = browser.runtime.getURL('html/youtubeFeedDark.html')
  } else {
    console.log("it is light version")
    feedIframe.src = browser.runtime.getURL('html/youtubeFeed.html')
  }
}

function injectFeedIframe(feedIframe: HTMLIFrameElement, feed: Element, currentBackgroundColor: string): void {
  setIframeSource(feedIframe, currentBackgroundColor)
  feed.append(feedIframe)
}

export default { createYouTubeFeedIframe, setIframeSource, injectFeedIframe }
