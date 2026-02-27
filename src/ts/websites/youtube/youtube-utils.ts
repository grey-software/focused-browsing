export const YOUTUBE_HOME_FEED_SELECTORS = [
  'ytd-two-column-browse-results-renderer #primary',
  'ytd-browse #primary',
  '#contents.ytd-rich-grid-renderer',
]

export const YOUTUBE_SUGGESTIONS_SELECTORS = [
  'ytd-watch-flexy #secondary #secondary-inner',
  'ytd-watch-flexy #secondary',
  'ytd-watch-next-secondary-results-renderer',
]

export const YOUTUBE_COMMENTS_SELECTORS = [
  'ytd-watch-flexy #primary-inner ytd-comments',
  'ytd-comments',
  '#comments',
]

export const YOUTUBE_PANEL_SELECTORS = [
  'ytd-miniplayer.ytdMiniplayerComponentHost',
  'ytd-app ytd-miniplayer',
]

function getFeed(): Element | null {
  // Primary selector from skeleton
  const primary = document.querySelector(YOUTUBE_HOME_FEED_SELECTORS[0]);
  if (primary) return primary;

  // Fallback for variations (e.g., rich grid)
  return document.querySelector(YOUTUBE_HOME_FEED_SELECTORS[1]) || document.querySelector(YOUTUBE_HOME_FEED_SELECTORS[2]);
}

function getSuggestions(): Element | null {
  // Primary from skeleton
  let suggestions = document.querySelector(YOUTUBE_SUGGESTIONS_SELECTORS[1]);
  if (suggestions) return suggestions.querySelector('#secondary-inner') || suggestions;

  // Legacy fallback (original)
  const legacy = document.querySelector(YOUTUBE_SUGGESTIONS_SELECTORS[2]);
  return legacy ? (legacy.children[1] as Element) || legacy : null;
}

function getVideoComments(): Element | null {
  // Primary from skeleton
  let comments = document.querySelector(YOUTUBE_COMMENTS_SELECTORS[0]);
  if (comments) return comments;

  // Standard fallback
  return document.querySelector(YOUTUBE_COMMENTS_SELECTORS[1]) || document.querySelector(YOUTUBE_COMMENTS_SELECTORS[2]);
}

function hasFeedLoaded(): boolean {
  try {
    const feed = getFeed();
    return !!(feed && feed.children.length > 0 && feed.children.length < 50);  // Arbitrary cap to detect "infinite" vs. loaded
  } catch (err) {
    console.warn('Feed load check error:', err);
    return false;
  }
}

function isFeedHidden(): boolean {
  const feed = getFeed() as HTMLElement | null;
  return !!(feed && (feed.style.display === 'none' || feed.children.length === 0));
}

function haveSuggestionsLoaded(): boolean {
  try {
    const suggestions = getSuggestions();
    return !!(suggestions && suggestions.children.length > 1);  // >1 to ignore headers/spacers
  } catch (err) {
    console.warn('Suggestions load check error:', err);
    return false;
  }
}

function areSuggestionsHidden(): boolean {
  const suggestions = getSuggestions() as HTMLElement | null;
  return !!(suggestions && (suggestions.style.display === 'none' || suggestions.children.length <= 1));
}

function haveCommentsLoaded(): boolean {
  try {
    const comments = getVideoComments();
    return !!(comments && comments.children.length > 0);
  } catch (err) {
    console.warn('Comments load check error:', err);
    return false;
  }
}

function areCommentsHidden(): boolean {
  const comments = getVideoComments() as HTMLElement | null;
  return !!(comments && (comments.style.display === 'none' || comments.children.length === 0));
}

function isHomePage(url: string): boolean {
  return url === 'https://www.youtube.com/' || url.startsWith('https://www.youtube.com/?');  // Handles query params
}

function isVideoPage(url: string): boolean {
  return url.startsWith('https://www.youtube.com/watch') || url.includes('/watch?v=');
}

function isDarkTheme(): boolean {
  return document.documentElement.hasAttribute('dark');  // Or check :root[dark]
}

function getPanels(): Element | null {
  // Miniplayer as elegant "panel" equivalent (floating distraction)
  return document.querySelector(YOUTUBE_PANEL_SELECTORS[0]) || 
         document.querySelector(YOUTUBE_PANEL_SELECTORS[1]);
}

function havePanelsLoaded(): boolean {
  try {
    const panels = getPanels();
    return !!(panels && panels.children.length > 0);  // Miniplayer has content like info-bar
  } catch (err) {
    console.warn('Panels (miniplayer) load check error:', err);
    return false;
  }
}

function arePanelsHidden(): boolean {
  const panels = getPanels() as HTMLElement | null;
  return !!(panels && (panels.style.display === 'none' || panels.children.length === 0));
}

export default {
  getFeed,
  getSuggestions,
  getVideoComments,
  hasFeedLoaded,
  isFeedHidden,
  haveSuggestionsLoaded,
  areSuggestionsHidden,
  isHomePage,
  isVideoPage,
  haveCommentsLoaded,
  areCommentsHidden,
  isDarkTheme,
  getPanels,
  havePanelsLoaded,
  arePanelsHidden,
}
