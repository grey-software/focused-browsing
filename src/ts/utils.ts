// Shared size mapping for both quote text and source across all components
export const SIZE_MAP = {
  small: { quote: '1.5rem', source: '1.25rem' },   // S: 24px/20px
  medium: { quote: '2rem', source: '1.5rem' },     // M: 32px/24px
  large: { quote: '2.5rem', source: '2rem' },      // L: 40px/32px
  xlarge: { quote: '4rem', source: '3rem' }        // XL: 64px/48px
};

export type SizeKey = keyof typeof SIZE_MAP;

/** Returns true if the URL is a browser-internal page (chrome://, edge://, about:). */
export function isBrowserInternalPage(url?: string): boolean {
  if (!url) return false
  return url.startsWith('chrome://')
    || url.startsWith('edge://')
    || url.startsWith('about:')
}

/** Extracts a string message from an unknown error value. */
export function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/** Returns true if the error message does not match any of the ignored patterns. */
export function shouldLogError(errorMessage: string, ignoredPatterns: string[]): boolean {
  return !ignoredPatterns.some(pattern => errorMessage.includes(pattern))
}

/** Returns true if the script execution result array contains a truthy first result. */
export function getScriptExecutionResult(results: any): boolean {
  return Array.isArray(results) && results.length > 0 && results[0].result === true
}

/** Returns true if the script execution result array has any result value. */
export function hasScriptExecutionResult(results: any): boolean {
  return Array.isArray(results) && results.length > 0 && !!results[0].result
}

/** Returns true if the URL belongs to linkedin.com. */
export function isLinkedInURL(url: string): boolean {
  return url.includes('linkedin.com')
}

/** Returns true if the URL belongs to youtube.com. */
export function isYouTubeURL(url: string): boolean {
  return url.includes('youtube.com')
}

/** Detects which supported website a URL belongs to. */
export function detectWebsiteFromURL(url: string): 'linkedin' | 'youtube' | 'unsupported' {
  if (isLinkedInURL(url)) return 'linkedin'
  if (isYouTubeURL(url)) return 'youtube'
  return 'unsupported'
}

// Storage operation helpers
export interface WebsiteToggles {
  linkedin: boolean
  youtube: boolean
  linkedinCustomFocus?: boolean
}

export interface WebsiteLoadingState {
  website: string
  timestamp: number
}

export interface PendingReload {
  website: string
  timestamp: number
  reason: string
}

/** Logs website detection with enabled/disabled status and controller state. */
export function logWebsiteDetection(website: string, enabled: boolean, hasController: boolean): void {
  const status = enabled ? 'enabled' : 'disabled'
  const controllerStatus = hasController ? 'controller initialized' : 'no controller initialized'
  console.log(`Detected website: ${website} (${status}) - ${controllerStatus}`)
}

/** Logs a website toggle change with current controller state. */
export function logToggleChange(website: string, isEnabled: boolean, hasController: boolean, currentWebsite: string): void {
  console.log(`${website} toggle changed to: ${isEnabled}`)
  console.log(`Current state - controller: ${hasController ? 'exists' : 'null'}, website: ${currentWebsite}`)
}