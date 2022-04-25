import GithubUtils from './github-utils'
import GithubIFrameUtils from './github-iframe-utils'
import utils from '../../utils'
import WebsiteController from '../website-controller'

export default class GithubController extends WebsiteController {
  exploreElements: Node[] = []
  activityIntervalId: number = 0
  exploreIntervalId: number = 0
  activityIframe: HTMLIFrameElement
  githubActivityChildNode: string | Node = ''

  constructor() {
    super()
    this.activityIframe = GithubIFrameUtils.createGithubIframe()
  }

  focus() {
    this.exploreElements = []
    this.focusActivity()
    this.focusExplore()
  }

  unfocus() {
    let url = document.URL
    if (GithubUtils.isHomePage(url)) {
      this.reset()
      utils.removeFocusedBrowsingCards()
      this.setActivityVisibility(true)
      this.setExploreVisibility(true)
    }
  }

  customFocus(): void {
    return
  }

  reset() {
    window.clearInterval(this.activityIntervalId)
    window.clearInterval(this.exploreIntervalId)
  }

  focusActivity() {
    this.tryBlockingActivity()
    if (this.activityIntervalId) {
      clearInterval(this.activityIntervalId)
    }
    this.activityIntervalId = window.setInterval(() => {
      this.tryBlockingActivity()
    }, 250)
  }

  focusExplore() {
    this.tryBlockingExplore()
    if (this.exploreIntervalId) {
      clearInterval(this.exploreIntervalId)
    }
    this.exploreIntervalId = window.setInterval(() => {
      this.tryBlockingExplore()
    }, 250)
  }

  setActivityVisibility(visibile: boolean) {
    var activityParentNode = GithubUtils.getGithubActivity()
    if (!visibile) {
      this.githubActivityChildNode = activityParentNode.children[1]
      activityParentNode.removeChild(this.githubActivityChildNode)
      GithubIFrameUtils.injectActivityIframe(this.activityIframe, activityParentNode)
    } else {
      activityParentNode.append(this.githubActivityChildNode)
    }
  }

  setExploreVisibility(visible: boolean) {
    let explore = GithubUtils.getGithubExplore()
    if (!visible) {
      let length = explore.childElementCount
      let currentExploreElements = []

      while (length != 1) {
        let currentLastChild = explore.children[length - 1]
        currentExploreElements.push(currentLastChild)
        explore.removeChild(currentLastChild)
        length -= 1
      }

      this.exploreElements = currentExploreElements
    } else {
      for (let i = this.exploreElements.length - 1; i >= 0; i -= 1) {
        explore.append(this.exploreElements[i])
      }
      this.exploreElements = []
    }
  }

  tryBlockingActivity() {
    try {
      let url = document.URL

      if (!GithubUtils.isHomePage(url)) {
        return
      }
      if (GithubUtils.isAcitivityHidden()) {
        return
      }
      if (GithubUtils.hasGithubActivityLoaded()) {
        this.setActivityVisibility(false)
        return
      }
    } catch (err) {}
  }

  tryBlockingExplore() {
    try {
      let url = document.URL

      if (!GithubUtils.isHomePage(url)) {
        return
      }
      if (GithubUtils.isExploreHidden()) {
        return
      }
      if (GithubUtils.hasGithubExploreLoaded()) {
        this.setExploreVisibility(false)
        return
      }
    } catch (err) {}
  }
}
