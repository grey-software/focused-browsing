const GITHUB_EXPLORE_TAG_NAME = 'aside'
const GITHUB_ACTIVITY_ID = 'dashboard'

function getActivityContainer(): Element {
  return document.getElementById(GITHUB_ACTIVITY_ID) as HTMLElement
}

function getExploreContainer(): Element {
  return document.getElementsByTagName(GITHUB_EXPLORE_TAG_NAME)[2]
}

function hasExploreLoaded(): boolean {
  return getExploreContainer().childElementCount > 0
}

function hasActivityLoaded(): boolean {
  return getActivityContainer().childElementCount >= 2
}

function isHomePage(url: string): boolean {
  if (url.includes('github.com')) {
    return url == 'https://github.com/'
  }
  return false
}

function isAcitivityHidden(): boolean {
  let activity = getActivityContainer()
  return activity.children[1].nodeName === 'IFRAME'
}

function isExploreHidden(): boolean {
  let explore = getExploreContainer()
  return explore.childElementCount === 0
}

export default {
  isHomePage,
  isAcitivityHidden,
  isExploreHidden,
  getActivityContainer,
  getExploreContainer,
  hasActivityLoaded,
  hasExploreLoaded,
}
