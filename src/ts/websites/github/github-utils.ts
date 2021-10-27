const GITHUB_EXPLORE_TAG_NAME = 'aside'
const GITHUB_ACTIVITY_ID = 'dashboard'

function getGithubActivity(): Element {
  return document.getElementById(GITHUB_ACTIVITY_ID) as HTMLElement
}

function getGithubExplore(): Element {
  return document.getElementsByTagName(GITHUB_EXPLORE_TAG_NAME)[2]
}

function hasGithubExploreLoaded(): boolean {
  return getGithubExplore().childElementCount >= 6
}

function hasGithubActivityLoaded(): boolean {
  return getGithubActivity().childElementCount >= 2
}

function isHomePage(url: string): boolean {
  if (url.includes('github.com')) {
    return url == 'https://github.com/'
  }
  return false
}

function isAcitivityHidden(): boolean {
  let activity = getGithubActivity()
  return activity.children[1].nodeName === 'IFRAME'
}

function isExploreHidden(): boolean {
  let explore = getGithubExplore()
  return explore.childElementCount === 0
}

export default {
  isHomePage,
  isAcitivityHidden,
  isExploreHidden,
  getGithubActivity,
  getGithubExplore,
  hasGithubActivityLoaded,
  hasGithubExploreLoaded,
}
