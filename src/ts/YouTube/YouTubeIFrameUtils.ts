import { browser } from 'webextension-polyfill-ts'
const YOUTUBE_FEED_FRAME_HEIGHT = '1000px'
const YOUTUBE_FEED_FRAME_WIDTH = '549px'
const IFRAME_ClASS = 'focus-card'

function createYouTubeFeedIframe(): HTMLIFrameElement {
    let feedIframe = document.createElement('iframe')

    feedIframe.width = YOUTUBE_FEED_FRAME_HEIGHT
    feedIframe.height = YOUTUBE_FEED_FRAME_WIDTH
    feedIframe.className = IFRAME_ClASS

    Object.assign(feedIframe.style, {
        position: 'inherit',
        border: 'none',
    })

    return feedIframe
}

function setIframeSource(feedIframe: HTMLIFrameElement): void {
    feedIframe.src = browser.runtime.getURL('www/linkedIn/feed/linkedInFeed.html')
}

function injectFeedIframe(feedIframe: HTMLIFrameElement, feed: Element): void {
    setIframeSource(feedIframe)
    feed.append(feedIframe)
}

export default { createYouTubeFeedIframe, setIframeSource, injectFeedIframe }