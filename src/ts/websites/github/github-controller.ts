import GithubUtils from './github-utils'
import GithubIFrameUtils from './github-iframe-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'

export default class GithubController extends WebsiteController {
  premiumFocus(): void {
    throw new Error('Method not implemented.')
  }
  explore_elements: Node[]
  activityIntervalId: number
  exploreIntervalId: number
  activityIframe: HTMLIFrameElement
  github_activity_child_node: string | Node

  constructor() {
    super()
    this.explore_elements = []
    this.github_activity_child_node = ''
    this.activityIntervalId = 0
    this.exploreIntervalId = 0
    this.activityIframe = GithubIFrameUtils.createGithubIframe()
  }

  focus() {
    utils.clearElements(this.explore_elements)
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
      this.github_activity_child_node = github_activity_parent_node.children[1]
      github_activity_parent_node.removeChild(this.github_activity_child_node)
      GithubIFrameUtils.injectActivityIframe(this.activityIframe, github_activity_parent_node)
    } else {
      github_activity_parent_node.append(this.github_activity_child_node)
    }
  }

  setExploreVisibility(visible: boolean) {
    let explore = GithubUtils.getGithubExplore()
    if (!visible) {
      let length = explore.childElementCount
      let current_explore_elements = []

      while (length != 1) {
        let currentLastChild = explore.children[length - 1]
        current_explore_elements.push(currentLastChild)
        explore.removeChild(currentLastChild)
        length -= 1
      }

      this.explore_elements = current_explore_elements
    } else {
      for (let i = this.explore_elements.length - 1; i >= 0; i -= 1) {
        explore.append(this.explore_elements[i])
      }
      utils.clearElements(this.explore_elements)
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
