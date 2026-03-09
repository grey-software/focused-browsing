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

/** Checks for a strict `true` return from an injected script. Used by shouldLoadFocusScript
 *  where the injected function returns `true` only when claiming the loading slot. */
export function getScriptExecutionResult(results: any): boolean {
  return Array.isArray(results) && results.length > 0 && results[0].result === true
}

/** Checks for any truthy return from an injected script. Used by checkFocusScript
 *  where the injected function returns `!!document.hasFocusScript` (truthy, not strict boolean). */
export function hasScriptExecutionResult(results: any): boolean {
  return Array.isArray(results) && results.length > 0 && !!results[0].result
}
