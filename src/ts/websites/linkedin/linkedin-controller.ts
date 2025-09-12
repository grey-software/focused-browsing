import LinkedInUtils from './linkedin-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import linkedinUtils from './linkedin-utils'

export default class LinkedInController extends WebsiteController {
  panelElements: Node[]
  feedIntervalId: number
  panelIntervalId: number
  feedChildNode: string | Node
  adChildNode: string | Node
  adIntervalId: number
  feedAdsIntervalId: number
  quoteElement: HTMLDivElement | null

  constructor() {
    super()
    this.panelElements = []
    this.feedChildNode = ''
    this.adChildNode = ''
    this.feedIntervalId = 0
    this.panelIntervalId = 0
    this.adIntervalId = 0
    this.feedAdsIntervalId = 0
    this.quoteElement = null
  }

  focus() {
    console.log('LinkedInController: Entering focus mode.');
    utils.clearElements(this.panelElements)
    this.focusFeed()
    this.focusPanel()
    this.focusAd()
  }

  unfocus() {
    console.log('LinkedInController: Exiting focus mode.');
    let url = document.URL
    if (LinkedInUtils.isHomePage(url)) {
      this.clearIntervals()
      utils.removeFocusedBrowsingCards()
      this.setFeedVisibility(true)
      this.setPanelVisibility(true)
      this.setAdVisibility(true)
    }
  }

  

  clearIntervals() {
    window.clearInterval(this.feedIntervalId)
    window.clearInterval(this.panelIntervalId)
    window.clearInterval(this.adIntervalId)
    window.clearInterval(this.feedAdsIntervalId)
  }

  focusFeed() {
    if (this.feedIntervalId) {
      clearInterval(this.feedIntervalId)
    }
    this.feedIntervalId = window.setInterval(() => {
      this.tryBlockingFeed()
    }, 250)
  }

  focusPanel() {
    if (this.panelIntervalId) {
      clearInterval(this.panelIntervalId)
    }
    this.panelIntervalId = window.setInterval(() => {
      this.tryBlockingPanel()
    }, 250)
  }

  focusAd() {
    if (this.adIntervalId) {
      clearInterval(this.adIntervalId)
    }
    this.adIntervalId = window.setInterval(() => {
      this.tryBlockingAd()
    }, 250)
  }

  focusFeedAds() {
    if (this.feedAdsIntervalId) {
      window.clearInterval(this.feedAdsIntervalId)
    }
    this.adIntervalId = window.setInterval(() => {
      this.hideFeedAds()
    }, 250)
  }

  setAdVisibility(visibile: boolean) {
    const adParentNode = LinkedInUtils.getAdHeader();
    if (!adParentNode || !visibile || !adParentNode.children.length) return;

    if (!visibile) {
      this.adChildNode = adParentNode.children[0];
      if (this.adChildNode) {
        adParentNode.removeChild(this.adChildNode);
      }
    } else if (this.adChildNode instanceof Node) {
      adParentNode.append(this.adChildNode);
    }
  }

  setFeedVisibility(visibile: boolean) {
    const feedParentNode = LinkedInUtils.getLinkedInFeed();
    if (!feedParentNode) return;

    if (!visibile) {
      const feedChild = feedParentNode.children[1];
      if (feedChild) {
        this.feedChildNode = feedChild;
        feedParentNode.removeChild(feedChild);
        
        // Create and inject quote element if not already present
        if (!this.quoteElement) {
          import('../../quote-manager').then(({ default: QuoteManager }) => {
            this.quoteElement = QuoteManager.createQuoteElement();
            feedParentNode.append(this.quoteElement!);
          });
        } else {
          feedParentNode.append(this.quoteElement);
        }
      }
    } else if (this.feedChildNode instanceof Node) {
      // Remove quote element
      this.quoteElement?.remove();
      feedParentNode.append(this.feedChildNode);
    }
  }

  setPanelVisibility(visible: boolean) {
    const panel = LinkedInUtils.getLinkedInPanel();
    if (!panel) return;

    if (!visible) {
      let length = panel.children.length;
      let currentPanelElements = [];

      while (length > 1) {
        const currentLastChild = panel.children[length - 1];
        if (currentLastChild) {
          currentPanelElements.push(currentLastChild);
          panel.removeChild(currentLastChild);
        }
        length -= 1;
      }
      this.panelElements = currentPanelElements;
    } else {
      for (let i = this.panelElements.length - 1; i >= 0; i -= 1) {
        const element = this.panelElements[i];
        if (element instanceof Node) {
          panel.append(element);
        }
      }
      utils.clearElements(this.panelElements);
    }
  }

  tryBlockingAd() {
    let url = document.URL
    if (!LinkedInUtils.isHomePage(url)) {
      return
    }
    if (LinkedInUtils.isAdHidden()) {
      return
    }
    if (LinkedInUtils.hasAdLoaded()) {
      this.setAdVisibility(false)
      return
    }
  }

  tryBlockingFeed() {
    let url = document.URL
    if (!LinkedInUtils.isHomePage(url)) {
      return
    }
    if (LinkedInUtils.isFeedHidden()) {
      return
    }
    if (LinkedInUtils.hasFeedLoaded()) {
      this.setFeedVisibility(false)
      return
    }
  }

  tryBlockingPanel() {
    let url = document.URL
    if (!LinkedInUtils.isHomePage(url)) {
      return
    }

    if (LinkedInUtils.isPanelHidden()) {
      return
    }
    if (LinkedInUtils.hasPanelLoaded()) {
      this.setPanelVisibility(false)
      return
    }
  }

  hideFeedAds() {
    linkedinUtils.getFeedAdElements().forEach((ad) => {
      ad.style.display = 'none'
    })
  }
}
