import GithubUtils from './github-utils'
import GithubIFrameUtils from './github-iframe-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'

export default class GithubController extends WebsiteController {
  premiumFocus(): void {
    throw new Error('Method not implemented.')
  }
  exploreElements: Node[]
  activityIntervalId: number
  exploreIntervalId: number
  activityIframe: HTMLIFrameElement
  activityChildNode: string | Node

  constructor() {
    super()
    this.exploreElements = []
    this.activityChildNode = ''
    this.activityIntervalId = 0
    this.exploreIntervalId = 0
    this.activityIframe = GithubIFrameUtils.createGithubIframe()
  }

  focus() {
    utils.clearElements(this.exploreElements)
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
    let activityParentNode = GithubUtils.getActivityContainer()
    if (!visibile) {
      this.activityChildNode = activityParentNode.children[1]
      activityParentNode.removeChild(this.activityChildNode)
      GithubIFrameUtils.injectActivityIframe(this.activityIframe, activityParentNode)
    } else {
      activityParentNode.append(this.activityChildNode)
    }
  }

  setExploreVisibility(visible: boolean) {
    let exploreElement = GithubUtils.getExploreContainer()
    if (!visible) {
      let length = exploreElement.childElementCount
      let exploreChildElements = []

      while (length != 0) {
        let currentLastChild = exploreElement.children[length - 1]
        exploreChildElements.push(currentLastChild)
        exploreElement.removeChild(currentLastChild)
        length -= 1
      }

      this.exploreElements = exploreChildElements
    } else {
      for (let i = this.exploreElements.length - 1; i >= 0; i -= 1) {
        exploreElement.append(this.exploreElements[i])
      }
      utils.clearElements(this.exploreElements)
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
      if (GithubUtils.hasActivityLoaded()) {
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
      if (GithubUtils.hasExploreLoaded()) {
        this.setExploreVisibility(false)
        return
      }
    } catch (err) {}
  }
}
