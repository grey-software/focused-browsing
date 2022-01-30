function getFacebookFeed(): Element {
  return document.querySelectorAll('[role="feed"]')[0]
}

function hasFeedLoaded(): boolean {
  try {
    return getFacebookFeed().childElementCount > 0
  } catch (err) {
    return false
  }
}

function isFeedHidden(): boolean {
  let feed = getFacebookFeed()
  return feed.children[0].nodeName == 'IFRAME'
}

function isHomePage(url: string): boolean {
  if (url.includes('https://facebook.com/')) {
    return url == 'https://facebook.com/'
  }
  return false
}

export default {
  getFacebookFeed,
  hasFeedLoaded,
  isFeedHidden,
  isHomePage,
}
