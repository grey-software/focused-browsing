import { browser } from 'webextension-polyfill-ts'

const TWITTER_FEED_FRAME_HEIGHT = '766px'
const TWITTER_FEED_FRAME_WIDTH = '598px'
const IFRAME_ClASS = 'focus-card'

function createTwitterFeedIframe(): HTMLIFrameElement {
  let feedIframe = document.createElement('iframe')

  feedIframe.width = TWITTER_FEED_FRAME_WIDTH
  feedIframe.height = TWITTER_FEED_FRAME_HEIGHT
  feedIframe.className = IFRAME_ClASS

  Object.assign(feedIframe.style, {
    position: 'inherit',
    border: 'none',
  })
  setIframeSource(feedIframe)

  return feedIframe
}

function setIframeSource(feedIframe: HTMLIFrameElement): void {
  if (document.body.style.backgroundColor == 'rgb(0, 0, 0)') {
    feedIframe.src = browser.runtime.getURL('html/twitterFeedDark.html')
  } else if (document.body.style.backgroundColor == 'rgb(21, 32, 43)') {
    feedIframe.src = browser.runtime.getURL('html/twitterFeedDim.html')
  } else {
    feedIframe.src = browser.runtime.getURL('html/twitterFeed.html')
  }
}

function injectFeedIframe(feedIframe: HTMLIFrameElement, feed: Element): void {
  feed.append(feedIframe)
}

export default { createTwitterFeedIframe, injectFeedIframe }
