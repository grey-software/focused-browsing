import { browser } from 'webextension-polyfill-ts'
const GITHUB_FEED_FRAME_HEIGHT = '700px'
const GITHUB_FEED_FRAME_WIDTH = '600px'
const IFRAME_ClASS = 'focus-card'

function createGithubIframe(): HTMLIFrameElement {
  let feedIframe = document.createElement('iframe')

  feedIframe.width = GITHUB_FEED_FRAME_WIDTH
  feedIframe.height = GITHUB_FEED_FRAME_HEIGHT
  feedIframe.className = IFRAME_ClASS

  Object.assign(feedIframe.style, {
    position: 'inherit',
    border: 'none',
  })
  setIframeSource(feedIframe)

  return feedIframe
}

function setIframeSource(feedIframe: HTMLIFrameElement): void {
  let parentNode = document.getElementsByTagName('html')[0]
  let colorMode = parentNode.getAttribute('data-color-mode')
  let darkModeVariant = parentNode.getAttribute('data-dark-theme')

  if (colorMode === 'light') {
    feedIframe.src = browser.runtime.getURL('html/githubFeed.html')
  } else {
    if (darkModeVariant === 'dark_dimmed') {
      feedIframe.src = browser.runtime.getURL('html/githubFeedDim.html')
    } else {
      feedIframe.src = browser.runtime.getURL('html/githubFeedDark.html')
    }
  }
}

function injectActivityIframe(feedIframe: HTMLIFrameElement, feed: Element): void {
  feed.append(feedIframe)
}

export default { createGithubIframe, setIframeSource, injectActivityIframe }
