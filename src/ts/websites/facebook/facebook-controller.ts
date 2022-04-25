import FacebookUtils from './facebook-utils'
import FacebookIFrameUtils from './facebook-iframe-utils'
import utils from '../../utils'
import WebsiteController from '../website-controller'

export default class FacebookController extends WebsiteController {
  customFocus(): void {
    return
  }
  storyElements: Node[]
  feedChildNode: string | Node
  feedIntervalId: number
  storiesIntervalId: number
  feedIframe: HTMLIFrameElement

  constructor() {
    super()
    this.storyElements = []
    this.feedChildNode = ''
    this.feedIntervalId = 0
    this.storiesIntervalId = 0
    this.feedIframe = FacebookIFrameUtils.createFacebookIframe()
  }

  focus() {
    this.storyElements = []
    this.focusFeed()
    this.focusStories()
  }

  unfocus() {
    let url = document.URL
    if (FacebookUtils.isHomePage(url)) {
      this.reset()
      utils.removeFocusedBrowsingCards()
      this.setFeedVisibility(true)
      this.setStoriesVisibility(true)
    }
  }

  reset() {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.storiesIntervalId)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryBlockingFeed()
    }, 250)
  }

  focusStories() {
    if (this.storiesIntervalId) {
      clearInterval(this.storiesIntervalId)
    }
    this.storiesIntervalId = window.setInterval(() => {
      this.tryBlockingStories()
    }, 250)
  }

  setFeedVisibility(visible: boolean) {
    let feed = FacebookUtils.getFeed() as HTMLElement
    if (!visible) {
      this.feedChildNode = feed.children[1]
      feed.removeChild(feed.childNodes[1])
      FacebookIFrameUtils.injectFeedIframe(this.feedIframe, feed)
    } else {
      feed.append(this.feedChildNode)
    }
  }

  setStoriesVisibility(visible: boolean) {
    let stories = FacebookUtils.getStoriesContainer() as Element
    if (!visible) {
      let length = stories?.children.length
      let currentStoryElements = []

      for (let i = 0; i < stories.children.length; i++) {
        let currentLastChild = stories.children[i]
        currentStoryElements.push(currentLastChild)
        stories.removeChild(currentLastChild)
      }

      this.storyElements = currentStoryElements
    } else {
      for (let i = this.storyElements.length - 1; i >= 0; i -= 1) {
        stories.append(this.storyElements[i])
      }
      this.storyElements = []
    }
  }

  tryBlockingFeed() {
    try {
      let url = document.URL
      if (!FacebookUtils.isHomePage(url)) {
        return
      }
      if (FacebookUtils.isFeedHidden()) {
        console.log('home confirmed')
        return
      }
      if (FacebookUtils.hasFeedLoaded()) {
        console.log('loaded')
        this.setFeedVisibility(false)
        return
      }
    } catch (err) {}
  }

  tryBlockingStories() {
    try {
      let url = document.URL

      if (!FacebookUtils.isHomePage(url)) {
        return
      }
      if (FacebookUtils.areStoriesHidden()) {
        return
      }
      if (FacebookUtils.haveStoriesLoaded()) {
        this.setStoriesVisibility(false)
        return
      }
    } catch (err) {}
  }
}
