import FacebookUtils from './facebook-utils'
import FacebookIFrameUtils from './facebook-iframe-utils'
import utils from '../../utils'
import WebsiteController from '../website-controller'

export default class FacebookController extends WebsiteController {
  customFocus(): void {
    return
  }
  storyElements: Node[]
  feed: Element | null = null
  feedIntervalId: number
  storiesIntervalId: number
  feedIframe: HTMLIFrameElement

  constructor() {
    super()
    this.storyElements = []
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
      this.showFeed()
      this.showStories()
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
      this.tryHidingFeed()
    }, 250)
  }

  focusStories() {
    if (this.storiesIntervalId) {
      clearInterval(this.storiesIntervalId)
    }
    this.storiesIntervalId = window.setInterval(() => {
      this.tryHidingStories()
    }, 250)
  }

  tryHidingFeed() {
    try {
      let url = document.URL
      if (!FacebookUtils.isHomePage(url)) {
        return
      }
      if (FacebookUtils.isFeedHidden()) {
        return
      }
      if (FacebookUtils.hasFeedLoaded()) {
        this.hideFeed()
        return
      }
    } catch (err) {}
  }

  tryHidingStories() {
    try {
      let url = document.URL

      if (!FacebookUtils.isHomePage(url)) {
        return
      }
      if (FacebookUtils.areStoriesHidden()) {
        return
      }
      if (FacebookUtils.haveStoriesLoaded()) {
        this.hideStories()
        return
      }
    } catch (err) {}
  }

  hideFeed() {
    let feedContainer = FacebookUtils.getFeedContainer() as HTMLElement
    this.feed = feedContainer.children[1]
    feedContainer.removeChild(feedContainer.childNodes[1])
    FacebookIFrameUtils.injectFeedIframe(this.feedIframe, feedContainer)
  }

  showFeed() {
    let feedContainer = FacebookUtils.getFeedContainer() as HTMLElement
    if (this.feed) {
      feedContainer.append(this.feed)
    }
  }

  hideStories() {
    let stories = FacebookUtils.getStoriesContainer() as Element
    let currentStoryElements = []
    for (let i = 0; i < stories.children.length; i++) {
      let currentLastChild = stories.children[i]
      currentStoryElements.push(currentLastChild)
      stories.removeChild(currentLastChild)
    }
    this.storyElements = currentStoryElements
  }

  showStories() {
    let stories = FacebookUtils.getStoriesContainer() as Element
    for (let i = this.storyElements.length - 1; i >= 0; i -= 1) {
      stories.append(this.storyElements[i])
    }
    this.storyElements = []
  }
}
