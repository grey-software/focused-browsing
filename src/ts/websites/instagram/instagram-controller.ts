import WebsiteController from '../website-controller'
import InstagramUtils from './instagram-utils'
import InstagramIFrameUtils from './instagram-iframe-utils'
import utils from '../../utils'

export default class InstagramController extends WebsiteController {
  feedIntervalId: number = 0
  storiesIntervalId: number = 0

  feed: null | HTMLElement = null
  stories: Element[] = []
  feedIframe: HTMLIFrameElement

  constructor() {
    super()
    this.feedIframe = InstagramIFrameUtils.createInstagramIframe()
  }

  focus() {
    console.log('🚀 ~ file: instagram-controller.ts ~ line 19 ~ InstagramController ~ focus ~ focus', focus)
    this.stories = []
    this.focusFeed()
    this.focusStories()
  }

  unfocus(): void {
    let url = document.URL
    if (InstagramUtils.isHomePage(url)) {
      this.reset()
      utils.removeFocusedBrowsingCards()
      this.showFeed()
      this.showStories()
    }
  }
  customFocus(): void {
    return
  }
  reset(): void {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.feedIntervalId)
  }

  focusFeed() {
    this.tryHidingFeed()
    if (this.feedIntervalId) {
      clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryHidingFeed()
    }, 250)
  }

  focusStories() {
    this.tryHidingStories()
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
      if (!InstagramUtils.isHomePage(url)) {
        return
      }
      if (InstagramUtils.isFeedHidden()) {
        return
      }
      if (InstagramUtils.hasFeedLoaded()) {
        this.hideFeed()
        return
      }
    } catch (err) {}
  }

  tryHidingStories() {
    try {
      let url = document.URL
      if (!InstagramUtils.isHomePage(url)) {
        return
      }
      if (InstagramUtils.areStoriesHidden()) {
        return
      }
      if (InstagramUtils.haveStoriesLoaded()) {
        this.hideStories()
        return
      }
    } catch (err) {}
  }

  hideFeed() {
    this.feed = InstagramUtils.getFeed() as HTMLElement
    console.log('🚀 ~ file: instagram-controller.ts ~ line 99 ~ InstagramController ~ hideFeed ~ this.feed', this.feed)
    this.feed.style.display = 'none'
    InstagramIFrameUtils.injectFeedIframe(this.feedIframe, this.feed.parentNode as Element)
  }

  showFeed() {
    let feedContainer = InstagramUtils.getFeed() as HTMLElement
    if (this.feed) {
      feedContainer.append(this.feed)
    }
  }

  hideStories() {
    let stories = InstagramUtils.getStoriesContainer() as Element
    let currentStories = []
    for (let i = 0; i < stories.children.length; i++) {
      let currentLastChild = stories.children[i]
      currentStories.push(currentLastChild)
      stories.removeChild(currentLastChild)
    }
    this.stories = currentStories
  }

  showStories() {
    let stories = InstagramUtils.getStoriesContainer() as Element
    for (let i = this.stories.length - 1; i >= 0; i -= 1) {
      stories.append(this.stories[i])
    }
    this.stories = []
  }
}
