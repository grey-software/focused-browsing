const LINKEDIN_FEED_CLASS = 'scaffold-layout__main'
const PANEL_CLASS = 'scaffold-layout__aside'
const AD_CLASS = 'ad-banner-container is-header-zone'

function getLinkedInFeed(): Element | null {
  const feed = document.querySelector('[aria-label="Main Feed"]');
  return feed || null;
}

function getLinkedInPanel(): Element | null {
  const panel = document.querySelector('[aria-label="Add to your feed"]');
  return panel || null;
}

function getAdHeader(): Element | null {
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
  let spanElements: HTMLElement[] = Array.from(document.querySelectorAll('.feed-shared-actor__sub-description'))
  let targetSpanElements: HTMLElement[] = spanElements.filter((element) => element.innerText === 'Promoted')
  return targetSpanElements
    .map((promotedSpanElement) => promotedSpanElement.closest('.occludable-update'))
    .filter((it): it is HTMLElement => it !== null)
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
}
