export function isLinkedInURL(url: string): boolean {
  try {
    const hostname = new URL(url).hostname
    return hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')
  } catch {
    return false
  }
}

export function isYouTubeURL(url: string): boolean {
  try {
    const hostname = new URL(url).hostname
    return hostname === 'youtube.com' || hostname.endsWith('.youtube.com')
  } catch {
    return false
  }
}

export function isXURL(url: string): boolean {
  try {
    const hostname = new URL(url).hostname
    return hostname === 'x.com' || hostname.endsWith('.x.com')
      || hostname === 'twitter.com' || hostname.endsWith('.twitter.com')
  } catch {
    return false
  }
}

export interface WebsiteToggles {
  linkedin: boolean
  youtube: boolean
  x: boolean
  linkedinCustomFocus?: boolean
  xCustomFocus?: boolean
}

export const DEFAULT_WEBSITE_TOGGLES: WebsiteToggles = { linkedin: true, youtube: true, x: true }

export interface WebsiteLoadingState {
  website: string
  timestamp: number
}

export interface PendingReload {
  website: string
  timestamp: number
  reason: string
}

export function logWebsiteDetection(website: string, enabled: boolean, hasController: boolean): void {
  const status = enabled ? 'enabled' : 'disabled'
  const controllerStatus = hasController ? 'controller initialized' : 'no controller initialized'
  console.log(`Detected website: ${website} (${status}) - ${controllerStatus}`)
}

export function logToggleChange(website: string, isEnabled: boolean, hasController: boolean, currentWebsite: string): void {
  console.log(`${website} toggle changed to: ${isEnabled}`)
  console.log(`Current state - controller: ${hasController ? 'exists' : 'null'}, website: ${currentWebsite}`)
}