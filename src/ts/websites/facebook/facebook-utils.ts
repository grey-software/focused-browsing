function getFeed() {
  return document.querySelector('[data-pagelet="FeedUnit_0"]')
}

function getStoriesContainer() {
  return document.querySelector('[aria-label="Stories"]')
}

function hasFeedLoaded(): boolean {
  return getFeed() != null
}

function haveStoriesLoaded(): boolean {
  return getStoriesContainer != null
}

function isHomePage(url: string): boolean {
  if (url.includes('github.com')) {
    return url == 'https://github.com/'
  }
  return false
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
