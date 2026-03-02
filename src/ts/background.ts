import { AppState, FocusMode } from './focus/types'
import { browser } from 'webextension-polyfill-ts'
import { 
  isBrowserInternalPage, 
  formatErrorMessage, 
  shouldLogError, 
  getScriptExecutionResult,
  hasScriptExecutionResult 
} from './utils'

// Type augmentation for document extensions
declare global {
  interface Document {
    hasFocusScript?: boolean
  }
}

const appState: AppState = {
  LinkedIn: FocusMode.Focused,
  Youtube: FocusMode.Focused,
  Unsupported: FocusMode.Unfocused,
}

let activeURL: string | undefined = ''

// Runs on every service worker startup. In MV3, the worker is killed and
// restarted frequently, so this resets appState to Focused and restores
// showQuote/textSize to defaults each time. To preserve user preferences
// across restarts, this would need to move behind a runtime.onInstalled guard.
browser.storage.local.set({
    appState: appState,
    showQuote: true,
    textSize: 'medium'
})

// Atomically checks whether focus.js has already been injected into a tab,
// and claims the loading slot if not. executeScript runs the function inside
// the page's JS context (not the service worker), so document.hasFocusScript
// acts as a per-page flag that prevents double injection when onUpdated fires
// multiple times for the same navigation.
async function shouldLoadFocusScript(tabId: number): Promise<boolean> {
  const hasScript = await browser.scripting.executeScript({
    target: { tabId },
    func: () => {
      if (document.hasFocusScript) {
        return false
      }
      document.hasFocusScript = true
      return true
    }
  })

  return getScriptExecutionResult(hasScript)
}

async function loadFocusScript(tabId: number): Promise<void> {
  await browser.scripting.executeScript({
    target: { tabId },
    files: ['focus.js']
  })
}

export async function checkFocusScript(tabId: number): Promise<boolean> {
  try {
    const tab = await browser.tabs.get(tabId)
    if (isBrowserInternalPage(tab.url)) {
      return false
    }

    const results = await browser.scripting.executeScript({
      target: { tabId },
      func: () => {
        return !!document.hasFocusScript
      }
    })
    
    return hasScriptExecutionResult(results)
  } catch (error) {
    // Don't log errors for browser pages we can't access
    const errorMessage = formatErrorMessage(error)
    if (shouldLogError(errorMessage, ['Cannot access'])) {
      console.error('Failed to check script injection:', error)
    }
    return false
  }
}

export async function loadFocusScriptOnTabChange(
  tabId: number,
  changeInfo: { status?: string },
  tab: { url?: string }
) {
  const url = tab.url
  const isPageLoading = changeInfo && changeInfo.status === 'loading'
  
  if (!isPageLoading) {
    return
  }

  if (isBrowserInternalPage(url)) {
    return
  }

  try {
    const shouldLoad = await shouldLoadFocusScript(tabId)
    if (shouldLoad) {
      await loadFocusScript(tabId)
      activeURL = url
    }
  } catch (error) {
    console.error('Failed to load focus script:', error)
  }
}

async function sendMessageToTab(tabId: number, message: any): Promise<any> {
  try {
    const response = await browser.tabs.sendMessage(tabId, message)
    return response
  } catch (error) {
    const errorMessage = formatErrorMessage(error)
    if (shouldLogError(errorMessage, ['Could not establish connection'])) {
      console.error('Error sending message to tab:', error)
    }
    throw error
  }
}

async function notifyTabActivation(tabId: number): Promise<void> {
  try {
    const response = await sendMessageToTab(tabId, { text: 'new-tab-activated' })
    if (response?.status === 'success') {
      return
    }
  } catch (error) {
    // Error already logged in sendMessageToTab
  }
}

export function addListeners() {
  browser.tabs.onUpdated.addListener(loadFocusScriptOnTabChange)

  browser.tabs.onActivated.addListener(async function(activeInfo: { tabId: number }) {
    await notifyTabActivation(activeInfo.tabId)
  })
}

addListeners()
