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
  isFeedBlocked: boolean
  hiddenFeedElements: HTMLElement[] = []

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
    this.isFeedBlocked = false
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
      this.isFeedBlocked = false
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

  hideFeed(feedParentNode: HTMLElement) {
    this.isFeedBlocked = true;
    Array.from(feedParentNode.children).forEach((child) => {
      const htmlChild = child as HTMLElement;
      this.hiddenFeedElements.push(htmlChild);
      htmlChild.style.display = 'none';
    });
  }

  showFeed() {
    this.quoteElement?.remove();
    this.quoteElement = null;
    this.hiddenFeedElements.forEach((child) => {
      child.style.display = '';
    });
    this.hiddenFeedElements = [];
  }

  injectQuote(feedParentNode: HTMLElement) {
    if (!this.quoteElement) {
      import('../../quote-manager').then(({ default: QuoteManager }) => {
        this.quoteElement = QuoteManager.createSimpleQuoteElement();
        feedParentNode.append(this.quoteElement!);
      });
    }
  }

  setFeedVisibility(visible: boolean) {
    const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
    if (!feedParentNode) return;

    if (!visible) {
      this.hideFeed(feedParentNode);
      this.injectQuote(feedParentNode);
    } else {
      this.showFeed();
    }
  }

  setPanelVisibility(visible: boolean) {
    const panel = LinkedInUtils.getLinkedInPanel() as HTMLElement;
    if (!panel) return;

    if (!visible) {
      panel.style.display = 'none';
    } else {
      panel.style.display = '';
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
    if (this.isFeedBlocked) {
      return
    }
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
