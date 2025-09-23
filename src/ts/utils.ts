// Shared size mapping for both quote text and source across all components
export const SIZE_MAP = {
  small: { quote: '1.5rem', source: '1.25rem' },   // S: 24px/20px
  medium: { quote: '2rem', source: '1.5rem' },     // M: 32px/24px
  large: { quote: '2.5rem', source: '2rem' },      // L: 40px/32px
  xlarge: { quote: '4rem', source: '3rem' }        // XL: 64px/48px
};

export type SizeKey = keyof typeof SIZE_MAP;

// Browser extension utilities
export function isBrowserInternalPage(url?: string): boolean {
  if (!url) return false
  return url.startsWith('chrome://')
    || url.startsWith('edge://')
    || url.startsWith('about:')
}

export function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function shouldLogError(errorMessage: string, ignoredPatterns: string[]): boolean {
  return !ignoredPatterns.some(pattern => errorMessage.includes(pattern))
}

// Script execution result utilities
export function getScriptExecutionResult(results: any): boolean {
  return Array.isArray(results) && results.length > 0 && results[0].result === true
}

export function hasScriptExecutionResult(results: any): boolean {
  return Array.isArray(results) && results.length > 0 && !!results[0].result
}

// Website detection utilities
export function isLinkedInURL(url: string): boolean {
  return url.includes('linkedin.com')
}

export function isYouTubeURL(url: string): boolean {
  return url.includes('youtube.com')
}

export function detectWebsiteFromURL(url: string): 'linkedin' | 'youtube' | 'unsupported' {
  if (isLinkedInURL(url)) return 'linkedin'
  if (isYouTubeURL(url)) return 'youtube'
  return 'unsupported'
}

// Storage operation helpers
export interface WebsiteToggles {
  linkedin: boolean
  youtube: boolean
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

// Console logging utilities for focus operations
export function logWebsiteDetection(website: string, enabled: boolean, hasController: boolean): void {
  const status = enabled ? 'enabled' : 'disabled'
  const controllerStatus = hasController ? 'controller initialized' : 'no controller initialized'
  console.log(`Detected website: ${website} (${status}) - ${controllerStatus}`)
}

export function logToggleChange(website: string, isEnabled: boolean, hasController: boolean, currentWebsite: string): void {
  console.log(`${website} toggle changed to: ${isEnabled}`)
  console.log(`Current state - controller: ${hasController ? 'exists' : 'null'}, website: ${currentWebsite}`)
}