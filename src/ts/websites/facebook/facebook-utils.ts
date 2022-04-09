function getFeed() {
  return document.getElementById('ssrb_feed_start')?.parentElement
}

function getStoriesContainer() {
  return document.querySelector('[aria-label="Stories"]')
}

function hasFeedLoaded(): boolean {
  return getFeed() != null
}

function haveStoriesLoaded(): boolean {
  return getStoriesContainer() != null
}

function isHomePage(url: string): boolean {
  return url.endsWith('facebook.com/')
}

function isFeedHidden(): boolean {
  return getFeed()?.children[1].nodeName === 'IFRAME'
}

function areStoriesHidden(): boolean {
  return getStoriesContainer()?.childElementCount === 0
}

export default {
  isHomePage,
  isFeedHidden,
  areStoriesHidden,
  hasFeedLoaded,
  haveStoriesLoaded,
  getFeed,
  getStoriesContainer,
}
