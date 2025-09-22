import LinkedInUtils from './linkedin-utils'
import utils from '../utils'
import WebsiteController from '../website-controller'
import { browser } from 'webextension-polyfill-ts';
import quoteUtils from '../../quotes';

export default class LinkedInController extends WebsiteController {
  // Legacy properties for compatibility
  panelElements: Node[]
  feedChildNode: string | Node
  adChildNode: string | Node
  quoteElement: HTMLDivElement | null
  isFeedBlocked: boolean
  hiddenFeedElements: HTMLElement[] = []
  
  // New MutationObserver properties
  private observers: Map<string, MutationObserver> = new Map()
  private isCreatingQuote: boolean = false
  private debounceTimers: Map<string, number> = new Map()
  private currentFocusMode: 'focused' | 'unfocused' | null = null

  constructor() {
    super()
    this.panelElements = []
    this.feedChildNode = ''
    this.adChildNode = ''
    this.quoteElement = null
    this.isFeedBlocked = false

    this.addStorageListener();
    console.log('LinkedInController: Initialized with MutationObserver strategy');
  }

  addStorageListener() {
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        if (changes.showQuote) {
          this.handleShowQuoteChange(changes.showQuote.newValue);
        }
        if (changes.textSize) {
          this.handleTextSizeChange(changes.textSize.newValue);
        }
      }
    });
  }

  // Observer management methods
  private createObserver(name: string, callback: () => void, debounceMs: number = 50): MutationObserver {
    this.destroyObserver(name);
    
    const observer = new MutationObserver(() => {
      this.debounceCallback(name, callback, debounceMs);
    });
    
    this.observers.set(name, observer);
    return observer;
  }

  private destroyObserver(name: string): void {
    const observer = this.observers.get(name);
    if (observer) {
      observer.disconnect();
      this.observers.delete(name);
    }
    
    // Clear associated debounce timer
    const timer = this.debounceTimers.get(name);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(name);
    }
  }

  private debounceCallback(name: string, callback: () => void, delay: number): void {
    const existingTimer = this.debounceTimers.get(name);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    const timer = window.setTimeout(() => {
      callback();
      this.debounceTimers.delete(name);
    }, delay);
    
    this.debounceTimers.set(name, timer);
  }

  private observeContainers(): void {
    const containers = LinkedInUtils.getAllObservableContainers();
    console.log(`LinkedIn: Setting up observers for ${containers.length} containers`);
    
    if (containers.length > 0) {
      const observer = this.createObserver('linkedin-content', () => {
        this.handleContentChanges();
      }, 50);
      
      containers.forEach(container => {
        observer.observe(container, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style']
        });
      });
    }
  }

  private handleContentChanges(): void {
    if (this.currentFocusMode === 'focused') {
      this.applyFocusMode();
    } else if (this.currentFocusMode === 'unfocused') {
      // Ensure content is visible in unfocus mode
      this.applyUnfocusMode();
    }
  }

  handleShowQuoteChange(showQuote: boolean) {
    if (showQuote) {
      if (this.isFeedBlocked && !this.quoteElement) {
        const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
        if (feedParentNode) {
          this.injectQuote(feedParentNode);
        }
      }
    } else {
      this.quoteElement?.remove();
      this.quoteElement = null;
    }
  }

  handleTextSizeChange(textSize: string) {
    if (this.quoteElement) {
      quoteUtils.updateQuoteTextSize(this.quoteElement, textSize);
    }
  }

  focus() {
    console.log('LinkedInController: Entering focus mode with MutationObserver.');
    this.currentFocusMode = 'focused';
    
    // Clear any existing intervals from legacy code
    this.clearAllIntervals();
    
    // Start observing for dynamic content changes
    this.observeContainers();
    
    // Apply initial focus immediately
    this.applyFocusMode();
  }

  unfocus() {
    console.log('LinkedInController: Exiting focus mode.');
    this.currentFocusMode = 'unfocused';
    
    // Stop all observers
    this.observers.forEach((observer, name) => {
      this.destroyObserver(name);
    });
    
    // Clear all intervals
    this.clearAllIntervals();
    
    // Restore all hidden content
    this.applyUnfocusMode();
  }

  private applyFocusMode(): void {
    const url = document.URL;
    if (!LinkedInUtils.isHomePage(url)) return;
    
    console.log('LinkedIn: Applying focus mode immediately');
    
    // Apply all focus features immediately
    this.focusFeeds();
    this.focusPanel();
    this.focusAds();
    this.focusFeedAds();
  }

  private applyUnfocusMode(): void {
    const url = document.URL;
    if (!LinkedInUtils.isHomePage(url)) return;
    
    console.log('LinkedIn: Applying unfocus mode');
    
    // Restore all hidden content
    this.setFeedVisibility(true);
    this.setPanelVisibility(true);
    this.setAdVisibility(true);
    this.isFeedBlocked = false;
  }

  private focusFeeds(): void {
    if (this.isFeedBlocked) return;
    
    if (LinkedInUtils.hasFeedLoaded() && !LinkedInUtils.isFeedHidden()) {
      console.log('LinkedIn: Hiding feed');
      this.setFeedVisibility(false);
    }
  }

  private focusPanel(): void {
    if (LinkedInUtils.hasPanelLoaded() && !LinkedInUtils.isPanelHidden()) {
      console.log('LinkedIn: Hiding panel');
      this.setPanelVisibility(false);
    }
  }

  private focusAds(): void {
    if (LinkedInUtils.hasAdLoaded() && !LinkedInUtils.isAdHidden()) {
      console.log('LinkedIn: Hiding ads');
      this.setAdVisibility(false);
    }
  }

  private focusFeedAds(): void {
    const adElements = LinkedInUtils.getFeedAdElements();
    adElements.forEach((ad: HTMLElement) => {
      if (ad.style.display !== 'none') {
        console.log('LinkedIn: Hiding feed ad');
        ad.style.display = 'none';
      }
    });
  }

  clearIntervals() {
    // Legacy method - now handled by observer cleanup
    this.observers.forEach((observer, name) => {
      this.destroyObserver(name);
    });
    this.clearAllIntervals();
  }

  async injectQuote(feedParentNode: HTMLElement) {
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

  async injectQuote(feedParentNode: HTMLElement) {
    const settings = await browser.storage.local.get('showQuote');
    if (settings.showQuote === false) return;

    if (!this.quoteElement) {
      this.quoteElement = await quoteUtils.createSimpleQuoteElement();
      feedParentNode.append(this.quoteElement!);
    }
  }

  async setFeedVisibility(visible: boolean) {
    const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
    if (!feedParentNode) return;

    if (!visible) {
      this.hideFeed(feedParentNode);
      await this.injectQuote(feedParentNode);
    }
    else {
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
    this.tryBlocking(
      LinkedInUtils.isHomePage,
      LinkedInUtils.isAdHidden,
      LinkedInUtils.hasAdLoaded,
      () => this.setAdVisibility(false)
    )
  }

  async tryBlockingFeed() {
    if (this.isFeedBlocked) return
    
    this.tryBlocking(
      LinkedInUtils.isHomePage,
      LinkedInUtils.isFeedHidden,
      LinkedInUtils.hasFeedLoaded,
      () => this.setFeedVisibility(false)
    )
  }

  tryBlockingPanel() {
    this.tryBlocking(
      LinkedInUtils.isHomePage,
      LinkedInUtils.isPanelHidden,
      LinkedInUtils.hasPanelLoaded,
      () => this.setPanelVisibility(false)
    )
  }

  hideFeedAds() {
    LinkedInUtils.getFeedAdElements().forEach((ad: HTMLElement) => {
      ad.style.display = 'none'
    })
  }
}
