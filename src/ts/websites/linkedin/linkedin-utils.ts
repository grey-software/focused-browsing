const LINKEDIN_FEED_CLASS = 'scaffold-layout__main'
const PANEL_CLASS = 'scaffold-layout__aside'
const AD_CLASS = 'ad-banner-container is-header-zone'

// Enhanced selectors for MutationObserver
const FEED_SELECTORS = [
  '[aria-label="Main Feed"]',
  '.scaffold-layout__main',
  '.feed-container-theme',
  '.core-rail'
];

const PANEL_SELECTORS = [
  '[aria-label="Add to your feed"]',
  '.scaffold-layout__aside',
  '.scaffold-layout-container__aside'
];

const AD_SELECTORS = [
  '.ad-banner-container',
  '.ad-banner-container.is-header-zone',
  '.scaffold-layout__header-ad'
];

const FEED_AD_SELECTORS = [
  '.feed-shared-actor__sub-description',
  '.occludable-update',
  '.sponsored-post'
];

function getLinkedInFeed(): Element | null {
  for (const selector of FEED_SELECTORS) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

function getLinkedInPanel(): Element | null {
  for (const selector of PANEL_SELECTORS) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

function getAdHeader(): Element | null {
  for (const selector of AD_SELECTORS) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return document.getElementsByClassName(AD_CLASS)[0] || null;
}

function hasFeedLoaded(): boolean {
  const feed = getLinkedInFeed();
  if (!feed || !feed.children) return false;
  return feed.children.length >= 1;
}

function hasPanelLoaded(): boolean {
  const panel = getLinkedInPanel();
  if (!panel || !panel.children) return false;
  return panel.children.length >= 3;
}

function hasAdLoaded(): boolean {
  const ad = getAdHeader();
  if (!ad || !ad.children) return false;
  return ad.children.length >= 1;
}

function isFeedHidden(): boolean {
  const feed = getLinkedInFeed();
  if (!feed) return false;
  const focusQuote = feed.querySelector('.focus-quote');
  return !!focusQuote;
}

function isPanelHidden(): boolean {
  const panel = getLinkedInPanel();
  return !panel || !panel.children || panel.children.length === 0;
}

function isAdHidden(): boolean {
  const ad = getAdHeader();
  return !ad || !ad.children || ad.children.length === 0;
}

function isHomePage(url: string): boolean {
  if (url.includes('linkedin.com')) {
    return url.includes('/feed') || url == 'https://www.linkedin.com/' || url == 'https://www.linkedin.com/home'
  }
  return false
}

function getFeedAdElements(): HTMLElement[] {
  // Try multiple strategies to find promoted content
  const strategies = [
    // Strategy 1: Look for "Promoted" text
    () => {
      const spanElements: HTMLElement[] = Array.from(document.querySelectorAll('.feed-shared-actor__sub-description'));
      const targetSpanElements: HTMLElement[] = spanElements.filter((element) => element.innerText === 'Promoted');
      return targetSpanElements
        .map((promotedSpanElement) => promotedSpanElement.closest('.occludable-update'))
        .filter((it): it is HTMLElement => it !== null);
    },
    
    // Strategy 2: Look for sponsored posts with different selectors
    () => {
      return Array.from(document.querySelectorAll('[data-test-id*="sponsored"], .sponsored-post, .feed-shared-update-v2--sponsored'))
        .filter((it): it is HTMLElement => it instanceof HTMLElement);
    },
    
    // Strategy 3: Look for ads in feed container
    () => {
      return Array.from(document.querySelectorAll('.feed-container .ad, .core-rail .ad'))
        .filter((it): it is HTMLElement => it instanceof HTMLElement);
    }
  ];
  
  for (const strategy of strategies) {
    const results = strategy();
    if (results.length > 0) return results;
  }
  
  return [];
}

// New utility functions for observer pattern
function getAllObservableContainers(): Element[] {
  const containers: Element[] = [];
  
  // Add feed container
  const feed = getLinkedInFeed();
  if (feed) containers.push(feed);
  
  // Add panel container
  const panel = getLinkedInPanel(); 
  if (panel) containers.push(panel);
  
  // Add ad containers
  const adHeader = getAdHeader();
  if (adHeader) containers.push(adHeader);
  
  // Add main scaffold container for broader monitoring
  const scaffold = document.querySelector('.scaffold-layout');
  if (scaffold) containers.push(scaffold);
  
  return containers;
}

function isLinkedInContentLoaded(): boolean {
  const feed = getLinkedInFeed();
  const panel = getLinkedInPanel();
  
  // Consider content loaded if we have either feed or panel
  return !!(feed?.children?.length || panel?.children?.length);
}

export default {
  getLinkedInFeed,
  getLinkedInPanel,
  getAdHeader,
  isFeedHidden,
  isPanelHidden,
  isAdHidden,
  hasFeedLoaded,
  hasPanelLoaded,
  hasAdLoaded,
  isHomePage,
  getFeedAdElements,
  getAllObservableContainers,
  isLinkedInContentLoaded,
  FEED_SELECTORS,
  PANEL_SELECTORS,
  AD_SELECTORS,
  FEED_AD_SELECTORS,
}
