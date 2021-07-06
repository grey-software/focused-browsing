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

function setIframeSource(feedIframe) {
  feedIframe.src = chrome.runtime.getURL('www/linkedin/feed/linkedInFeed.html')
}

function injectFeedIframe(feedIframe, feed) {
  setIframeSource(feedIframe)
  feed.append(feedIframe)
}

module.exports = { createLinkedInIframe, setIframeSource, injectFeedIframe }
