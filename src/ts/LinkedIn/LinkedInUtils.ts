const LINKEDIN_FEED_CLASS = 'scaffold-layout__main'
const PANEL_CLASS = 'scaffold-layout__aside'
const AD_CLASS = 'ad-banner-container is-header-zone'

function getLinkedInFeed(): Element {
  return document.getElementsByClassName(LINKEDIN_FEED_CLASS)[0].children[2]
}

function getLinkedInPanel(): Element {
  return document.getElementsByClassName(PANEL_CLASS)[0]
}

function getAdHeader(): Element {
  return document.getElementsByClassName(AD_CLASS)[0]
}

function hasFeedLoaded(): boolean {
  return getLinkedInFeed().children.length == 2
}

function hasPanelLoaded(): boolean {
  return getLinkedInPanel().children.length == 3
}

function hasAdLoaded(): boolean {
  return getAdHeader().children.length == 1
}

function isFeedHidden(): boolean {
  let feed = getLinkedInFeed()
  return feed.children[1].nodeName == 'IFRAME'
}

function isPanelHidden(): boolean {
  let panel = getLinkedInPanel()
  return panel.children.length == 0
}

function isAdHidden(): boolean {
  let ad = getAdHeader()
  return ad.children.length == 0
}

function isHomePage(url: string): boolean {
  if (url.includes('linkedin.com')) {
    return url.includes('/feed') || url == 'https://www.linkedin.com/' || url == 'https://www.linkedin.com/home'
  }
  return false;
}

export default {
  getLinkedInFeed,
  getLinkedInPanel,
  getAdHeader,
  isFeedHidden,
  isPanelHidden,
  isAdHidden,
  hasFeedLoaded,
  hasPanelLoaded,
  hasAdLoaded,
  isHomePage,
}
