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

function setIframeSource(feedIframe: HTMLIFrameElement): void {
    document.body.style.background = 'var(--yt-spec-general-background-a)'
    let backgroundColor = window.getComputedStyle(document.body).backgroundColor

    if (backgroundColor == DARK_MODE_COLOUR) {
        feedIframe.src = browser.runtime.getURL('www/youtube/youtubeFeedDark.html')
    } else {
        feedIframe.src = browser.runtime.getURL('www/youtube/youtubeFeed.html')
    }
}

function injectFeedIframe(feedIframe: HTMLIFrameElement, feed: Element): void {
    setIframeSource(feedIframe)
    feed.append(feedIframe)
}

export default { createYouTubeFeedIframe, setIframeSource, injectFeedIframe }