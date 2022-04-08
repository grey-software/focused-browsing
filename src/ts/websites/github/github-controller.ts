import GithubUtils from './github-utils'
import GithubIFrameUtils from './github-iframe-utils'
import utils from '../../utils'
import WebsiteController from '../website-controller'

export default class GithubController extends WebsiteController {
  customFocus(): void {
    throw new Error('Method not implemented.')
  }
  exploreElements: Node[]
  activityIntervalId: number
  exploreIntervalId: number
  activityIframe: HTMLIFrameElement
  githubActivityChildNode: string | Node

  constructor() {
    super()
    this.exploreElements = []
    this.githubActivityChildNode = ''
    this.activityIntervalId = 0
    this.exploreIntervalId = 0
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
      this.clearIntervals()
      utils.removeFocusedBrowsingCards()
      this.setActivityVisibility(true)
      this.setExploreVisibility(true)
    }
  }

  clearIntervals() {
    window.clearInterval(this.activityIntervalId)
    window.clearInterval(this.exploreIntervalId)
  }

  focusActivity() {
    if (this.activityIntervalId) {
      clearInterval(this.activityIntervalId)
    }
    this.activityIntervalId = window.setInterval(() => {
      this.tryBlockingActivity()
    }, 250)
  }

  focusExplore() {
    if (this.exploreIntervalId) {
      clearInterval(this.exploreIntervalId)
    }
    this.exploreIntervalId = window.setInterval(() => {
      this.tryBlockingExplore()
    }, 250)
  }

  setActivityVisibility(visibile: boolean) {
    var github_activity_parent_node = GithubUtils.getGithubActivity()
    if (!visibile) {
      this.githubActivityChildNode = github_activity_parent_node.children[1]
      github_activity_parent_node.removeChild(this.githubActivityChildNode)
      GithubIFrameUtils.injectActivityIframe(this.activityIframe, github_activity_parent_node)
    } else {
      github_activity_parent_node.append(this.githubActivityChildNode)
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
