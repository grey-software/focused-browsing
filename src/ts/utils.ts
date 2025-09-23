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