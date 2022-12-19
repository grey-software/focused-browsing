// import { browser } from 'webextension-polyfill-ts'
// const YOUTUBE_CARD_HEIGHT = '100%'
// const YOUTUBE_Card_WIDTH = '100%'
// const YOUTUBE_CARD_STYLES = {
//   position: 'fixed',
//   border: 'none',
// }
// const DARK_MODE_COLOUR = 'rgb(24, 24, 24)'
// const IFRAME_ClASS = 'focus-card'

// // function createYouTubeFeedIframe(): HTMLIFrameElement {
// //   let feedIframe = document.createElement('iframe')

// //   feedIframe.width = YOUTUBE_FEED_FRAME_HEIGHT
// //   feedIframe.height = YOUTUBE_FEED_FRAME_WIDTH
// //   feedIframe.className = IFRAME_ClASS

// //   Object.assign(feedIframe.style, {
// //     position: 'fixed',
// //     border: 'none',
// //   })

// //   return feedIframe
// // }

// function setIframeSource(feedIframe: HTMLIFrameElement, currentBackgroundColor: string): void {
//   if (currentBackgroundColor == DARK_MODE_COLOUR) {
//     feedIframe.src = browser.runtime.getURL('html/youtubeFeedDark.html')
//   } else {
//     feedIframe.src = browser.runtime.getURL('html/youtubeFeed.html')
//   }
// }

// function setIframeSource2(
//   feedIframe: HTMLIFrameElement,
//   iframeSourceUrl: string,
//   currentBackgroundColor: string
// ): void {
//   feedIframe.src = iframeSourceUrl
// }

// export default { setIframeSource, setIframeSource2 }
