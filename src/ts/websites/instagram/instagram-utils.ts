function getStoriesContainer(): Element | undefined {
  const mainContentContainer = document.querySelector('[role="main"]')?.children[0].children[0]
  return mainContentContainer?.children[1]
}

function haveStoriesLoaded(): boolean {
  return getStoriesContainer() != undefined
}

function getFeed(): Element | undefined {
  const mainContentContainer = document.querySelector('[role="main"]')
  const feedContainer = mainContentContainer?.children[0].children[0]
  return feedContainer?.children[2]
}

function hasFeedLoaded(): boolean {
  return getFeed() != undefined
}

function isFeedHidden(): boolean {
  let feed = getFeed() as HTMLElement
  if (feed) {
    return feed?.style.display == 'none'
  }
  return false
}

function areStoriesHidden(): boolean {
  let panel = getStoriesContainer() as HTMLElement
  if (panel) {
    return panel?.style.display === 'none'
  }
  return false
}

function isHomePage(url: string): boolean {
  return url == 'https://www.instagram.com/'
}

export default {
  getFeed,
  getStoriesContainer,
  hasFeedLoaded,
  haveStoriesLoaded,
  isHomePage,
  areStoriesHidden,
  isFeedHidden,
}
