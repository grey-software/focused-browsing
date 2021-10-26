function getTwitterFeed(): Element {
  return document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[0].children[0]
    .children[3]
}

function getTwitterPanel(): Element {
  return document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[1].children[0]
    .children[1].children[0].children[0].children[0]
}

function hasFeedLoaded(): boolean {
  try {
    return getTwitterFeed().children.length == 1
  } catch (err) {
    return false
  }
}

function hasPanelLoaded(): boolean {
  try {
    return getTwitterPanel().children.length != 0
  } catch (err) {
    return false
  }
}

function isFeedHidden(): boolean {
  let feed = getTwitterFeed()
  return feed.children[0].nodeName == 'IFRAME'
}

function isPanelHidden(): boolean {
  let panel = getTwitterPanel()
  return panel.children.length == 1
}

function isHomePage(url: string): boolean {
  if (url.includes('https://twitter.com/')) {
    return url.includes('/home') || url == 'https://twitter.com/'
  }
  return false
}

function getAdElements(): HTMLElement[] {
  let spanElements = document.querySelectorAll('span')
  let targetSpanElements: HTMLElement[] = Array.from(spanElements).filter((element) => element.innerHTML === 'Promoted')
  return targetSpanElements
    .map((promotedSpanElement) => promotedSpanElement.closest('article'))
    .filter((it): it is HTMLElement => it !== null)
}

export default {
  getTwitterFeed,
  getTwitterPanel,
  hasFeedLoaded,
  hasPanelLoaded,
  isFeedHidden,
  isPanelHidden,
  isHomePage,
  getAdElements,
}
