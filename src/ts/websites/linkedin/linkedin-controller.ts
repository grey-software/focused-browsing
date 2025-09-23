import LinkedInUtils from './linkedin-utils'
import utils from '../utils'
import WebsiteController, { DistractionTarget } from '../website-controller'
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
  
  // Child removal standardization properties
  panelChildren: Node[] = []
  hiddenAdElements: Map<HTMLElement, Node[]> = new Map()
  
  // Simplified state management
  private isCreatingQuote: boolean = false
  private currentFocusMode: 'focused' | 'unfocused' | null = null

  constructor() {
    super()
    this.panelElements = []
    this.feedChildNode = ''
    this.adChildNode = ''
    this.quoteElement = null
    this.isFeedBlocked = false

    this.addStorageListener();
    console.log('LinkedInController: Initialized with standardized observer management');
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

  private setupContentObserver(): void {
    const containers = LinkedInUtils.getAllObservableContainers();
    console.log(`LinkedIn: Setting up watcher for ${containers.length} containers`);
    
    if (containers.length > 0) {
      const distractionTarget: DistractionTarget = {
        target: containers[0], // Use first container as primary target
        whenFound: () => this.handleContentChanges(),
        options: {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style']
        }
      };
      
      this.watchFor('linkedin-content', distractionTarget);
      
      // Watch additional containers if present
      containers.slice(1).forEach((container, index) => {
        const additionalTarget: DistractionTarget = {
          target: container,
          whenFound: () => this.handleContentChanges(),
          options: distractionTarget.options
        };
        this.watchFor(`linkedin-content-${index + 1}`, additionalTarget);
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
    console.log('LinkedInController: Entering focus mode with standardized observer management.');
    console.log(`LinkedIn: Current URL: ${document.URL}`);
    this.currentFocusMode = 'focused';
    
    // Clear any existing intervals from legacy code
    this.clearAllIntervals();
    
    // Start observing for dynamic content changes
    this.setupContentObserver();
    
    // Apply initial focus immediately
    this.applyFocusMode();
  }

  unfocus() {
    console.log('LinkedInController: Exiting focus mode.');
    console.log(`LinkedIn: Current URL: ${document.URL}`);
    this.currentFocusMode = 'unfocused';
    
    // Stop all distraction watching using base class method
    this.stopWatchingAll();
    
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
    
    // Restore feed ads via child restoration
    this.hiddenAdElements.forEach((adChildren, ad) => {
      adChildren.forEach(child => ad.appendChild(child));
    });
    this.hiddenAdElements.clear();
    
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
      if (ad.children.length > 0 && !this.hiddenAdElements.has(ad)) {
        console.log('LinkedIn: Hiding feed ad via child removal');
        const adChildren = Array.from(ad.children);
        adChildren.forEach(child => ad.removeChild(child));
        this.hiddenAdElements.set(ad, adChildren);
      }
    });
  }

  clearIntervals() {
    // Use base class method for distraction watching cleanup
    this.stopWatchingAll();
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
      feedParentNode.removeChild(htmlChild);  // Child removal instead of style hiding
    });
  }

  showFeed() {
    console.log('LinkedIn: showFeed() called');
    this.quoteElement?.remove();
    this.quoteElement = null;
    
    // Restore previously removed elements
    const feedParentNode = LinkedInUtils.getLinkedInFeed() as HTMLElement;
    if (feedParentNode) {
      this.hiddenFeedElements.forEach((child) => {
        feedParentNode.appendChild(child);  // Restore removed children
      });
      this.hiddenFeedElements = [];
      console.log('LinkedIn: Feed elements restored via child removal');
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
      console.log('LinkedIn: Hiding panel via child removal');
      this.panelChildren = Array.from(panel.children);
      this.panelChildren.forEach(child => panel.removeChild(child));
    } else {
      console.log('LinkedIn: Showing panel via child restoration');
      this.panelChildren.forEach(child => panel.appendChild(child));
      this.panelChildren = [];
    }
  }
}