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

  focus() {
    console.log('LinkedInController: Entering focus mode with MutationObserver.');
    console.log(`LinkedIn: Current URL: ${document.URL}`);
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
    console.log(`LinkedIn: Current URL: ${document.URL}`);
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
    console.log(`LinkedIn: Checking homepage for URL: ${url}`);
    console.log(`LinkedIn: isHomePage result: ${LinkedInUtils.isHomePage(url)}`);
    
    if (!LinkedInUtils.isHomePage(url)) {
      console.log('LinkedIn: Not a homepage, skipping focus mode');
      return;
    }
    
    console.log('LinkedIn: Applying focus mode immediately');
    
    // Log DOM element availability
    const feed = LinkedInUtils.getLinkedInFeed();
    const panel = LinkedInUtils.getLinkedInPanel();
    const adHeader = LinkedInUtils.getAdHeader();
    
    console.log(`LinkedIn DOM elements - Feed: ${!!feed}, Panel: ${!!panel}, Ad: ${!!adHeader}`);
    console.log(`LinkedIn Load status - Feed: ${LinkedInUtils.hasFeedLoaded()}, Panel: ${LinkedInUtils.hasPanelLoaded()}, Ad: ${LinkedInUtils.hasAdLoaded()}`);
    
    // Apply all focus features immediately
    this.focusFeeds();
    this.focusPanel();
    this.focusAds();
    this.focusFeedAds();
  }

  private applyUnfocusMode(): void {
    const url = document.URL;
    console.log(`LinkedIn: applyUnfocusMode() - URL: ${url}`);
    console.log(`LinkedIn: isHomePage result: ${LinkedInUtils.isHomePage(url)}`);
    
    if (!LinkedInUtils.isHomePage(url)) {
      console.log('LinkedIn: Not a homepage, skipping unfocus mode');
      return;
    }
    
    console.log('LinkedIn: Applying unfocus mode');
    
    // Restore all hidden content
    this.setFeedVisibility(true);
    this.setPanelVisibility(true);
    this.setAdVisibility(true);
    this.isFeedBlocked = false;
    
    console.log('LinkedIn: Unfocus mode applied');
  }

  private focusFeeds(): void {
    console.log('LinkedIn: focusFeeds() called');
    if (this.isFeedBlocked) {
      console.log('LinkedIn: Feed already blocked, skipping');
      return;
    }
    
    const feedLoaded = LinkedInUtils.hasFeedLoaded();
    const feedHidden = LinkedInUtils.isFeedHidden();
    console.log(`LinkedIn: Feed status - Loaded: ${feedLoaded}, Hidden: ${feedHidden}`);
    
    if (feedLoaded && !feedHidden) {
      console.log('LinkedIn: Hiding feed');
      this.setFeedVisibility(false);
    } else {
      console.log('LinkedIn: Feed not ready for hiding');
    }
  }

  private focusPanel(): void {
    console.log('LinkedIn: focusPanel() called');
    const panelLoaded = LinkedInUtils.hasPanelLoaded();
    const panelHidden = LinkedInUtils.isPanelHidden();
    console.log(`LinkedIn: Panel status - Loaded: ${panelLoaded}, Hidden: ${panelHidden}`);
    
    if (panelLoaded && !panelHidden) {
      console.log('LinkedIn: Hiding panel');
      this.setPanelVisibility(false);
    } else {
      console.log('LinkedIn: Panel not ready for hiding');
    }
  }

  private focusAds(): void {
    console.log('LinkedIn: focusAds() called');
    const adLoaded = LinkedInUtils.hasAdLoaded();
    const adHidden = LinkedInUtils.isAdHidden();
    console.log(`LinkedIn: Ad status - Loaded: ${adLoaded}, Hidden: ${adHidden}`);
    
    if (adLoaded && !adHidden) {
      console.log('LinkedIn: Hiding ads');
      this.setAdVisibility(false);
    } else {
      console.log('LinkedIn: Ads not ready for hiding');
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

  setAdVisibility(visible: boolean) {
    console.log(`LinkedIn: setAdVisibility(${visible}) called`);
    const adParentNode = LinkedInUtils.getAdHeader();
    if (!adParentNode || !adParentNode.children.length) {
      console.log('LinkedIn: Ad element not found or has no children');
      return;
    }

    if (!visible) {
      console.log('LinkedIn: Hiding ad');
      this.adChildNode = adParentNode.children[0];
      if (this.adChildNode) {
        adParentNode.removeChild(this.adChildNode);
      }
    } else if (this.adChildNode instanceof Node) {
      console.log('LinkedIn: Showing ad');
      adParentNode.append(this.adChildNode);
    } else {
      console.log('LinkedIn: No stored ad child to restore');
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
    console.log('LinkedIn: showFeed() called');
    this.quoteElement?.remove();
    this.quoteElement = null;
    
    // Restore previously hidden elements
    this.hiddenFeedElements.forEach((child) => {
      child.style.display = '';
    });
    this.hiddenFeedElements = [];
    
    // Also ensure feed container is visible (in case it was hidden by other means)
    const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
    if (feedParentNode) {
      feedParentNode.style.display = '';
      console.log('LinkedIn: Feed container visibility restored');
    }
    
    this.isFeedBlocked = false;
  }

  async injectQuote(feedParentNode: HTMLElement) {
    if (this.isCreatingQuote) return;
    
    const settings = await browser.storage.local.get('showQuote');
    if (settings.showQuote === false) return;

    if (!this.quoteElement) {
      this.isCreatingQuote = true;
      try {
        this.quoteElement = await quoteUtils.createSimpleQuoteElement();
        feedParentNode.append(this.quoteElement!);
        console.log('LinkedIn: Quote injected successfully');
      } catch (error) {
        console.error('LinkedIn: Failed to inject quote:', error);
      } finally {
        this.isCreatingQuote = false;
      }
    }
  }

  async setFeedVisibility(visible: boolean) {
    const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
    if (!feedParentNode) return;

    if (!visible) {
      this.hideFeed(feedParentNode);
      await this.injectQuote(feedParentNode);
    } else {
      this.showFeed();
    }
  }

  setPanelVisibility(visible: boolean) {
    console.log(`LinkedIn: setPanelVisibility(${visible}) called`);
    const panel = LinkedInUtils.getLinkedInPanel() as HTMLElement;
    if (!panel) {
      console.log('LinkedIn: Panel element not found');
      return;
    }

    if (!visible) {
      console.log('LinkedIn: Hiding panel');
      panel.style.display = 'none';
    } else {
      console.log('LinkedIn: Showing panel');
      panel.style.display = '';
    }
  }
}