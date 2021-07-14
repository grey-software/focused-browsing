import { browser } from "webextension-polyfill-ts"

const TWITTER_FEED_FRAME_HEIGHT = '766px'
const TWITTER_FEED_FRAME_WIDTH = '598px'
const IFRAME_ClASS = 'focus-card'

function createTwitterFeedIframe() {
  let feedIframe = document.createElement('iframe')

  feedIframe.width = TWITTER_FEED_FRAME_WIDTH
  feedIframe.height = TWITTER_FEED_FRAME_HEIGHT
  feedIframe.className = IFRAME_ClASS

  Object.assign(feedIframe.style, {
    position: 'inherit',
    border: 'none',
  })

  return feedIframe
}

function setFeedIframeSource(feedIframe: any) {
  if (document.body.style.backgroundColor == 'rgb(0, 0, 0)') {
    feedIframe.src = browser.runtime.getURL('www/twitter/feed/twitterFeedDark.html')
  } else if (document.body.style.backgroundColor == 'rgb(21, 32, 43)') {
    feedIframe.src = browser.runtime.getURL('www/twitter/feed/twitterFeedDim.html')
  } else {
    feedIframe.src = browser.runtime.getURL('www/twitter/feed/twitterFeed.html')
  }
}

function injectFeedIframe(feedIframe: any, feed: any) {
  setFeedIframeSource(feedIframe)
  feed.append(feedIframe)
}

export default { createTwitterFeedIframe, setFeedIframeSource, injectFeedIframe }
