function getFeedContainer(): Element {
  return document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[0].children[0]
    .children[3]
}

function getPanelContainer(): Element {
  return document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[1].children[0]
    .children[1].children[0].children[0].children[0]
}

function hasFeedLoaded(): boolean {
  try {
    return getFeedContainer().children.length == 1
  } catch (err) {
    return false
  }
}

function hasPanelLoaded(): boolean {
  try {
    return getPanelContainer().children.length != 0
  } catch (err) {
    return false
  }
}

function isFeedHidden(): boolean {
  let feed = getFeedContainer()
  return feed.children[0].nodeName == 'IFRAME'
}

function isPanelHidden(): boolean {
  let panel = getPanelContainer()
  return panel.children.length == 1
}

function isHomePage(url: string): boolean {
  if (url.includes('https://twitter.com/')) {
    return url.includes('/home') || url == 'https://twitter.com/'
  }
  return false
}

function getFeedAdElements(): HTMLElement[] {
  let spanElements = document.querySelectorAll('span')
  let targetSpanElements: HTMLElement[] = Array.from(spanElements).filter((element) => element.innerHTML === 'Promoted')
  return targetSpanElements
    .map((promotedSpanElement) => promotedSpanElement.closest('article'))
    .filter((it, index): it is HTMLElement => it !== null && index < 2)
}

function getFeedItemCount() {
  const feedItemCount = document
    .querySelectorAll('[role="main"]')[0]
    .children[0].children[0].children[0].children[0].children[0].children[3].querySelectorAll('article').length
  console.log(`Number of items in feed: ${feedItemCount}`)
  return feedItemCount
}

function getPanelItemCount() {
  const panelItemCount =
    document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[1].children[0]
      .children[1].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[1]
      .children[0].children[0].children[0].children.length - 2
  console.log(`Number of items in panel: ${panelItemCount}`)
  return panelItemCount
}

export default {
  getFeedContainer,
  getPanelContainer,
  hasFeedLoaded,
  hasPanelLoaded,
  isFeedHidden,
  isPanelHidden,
  isHomePage,
  getFeedAdElements,
  getFeedItemCount,
  getPanelItemCount,
}
