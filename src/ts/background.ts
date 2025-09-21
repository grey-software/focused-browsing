import { AppState, FocusMode } from './focus/types'
import { browser } from 'webextension-polyfill-ts'

const appState: AppState = {
  Twitter: FocusMode.Focused,
  LinkedIn: FocusMode.Focused,
  Youtube: FocusMode.Focused,
  Github: FocusMode.Focused,
  Unsupported: FocusMode.Unfocused,
}

let activeURL: string | undefined = ''

browser.storage.local.set({ appState: appState, showQuote: true, fontSize: 16 })

export async function injectFocusScriptOnTabChange(
  tabId: number,
  changeInfo: { status?: string },
  tab: { url?: string }
) {
  const url = tab.url
  const isPageLoading = changeInfo && changeInfo.status === 'loading'
  
  if (!isPageLoading) {
    return
  }

  // Skip injection for browser internal pages
  if (url?.startsWith('chrome://') || url?.startsWith('edge://') || url?.startsWith('about:')) {
    return
  }

  try {
    const isFocusScriptInjected = await checkFocusScriptInjected(tabId)
    if (isFocusScriptInjected) {
      return
    }

    // Inject the script from the extension's build directory
    await browser.scripting.executeScript({
      target: { tabId },
      files: ['focus.js']  // Path relative to extension root
    })

    await browser.scripting.executeScript({
      target: { tabId },
      func: () => {
        (document as any).isFocusScriptInjected = true
      }
    })

    activeURL = url
  } catch (error) {
    console.error('Failed to inject focus script:', error)
  }
}

export async function checkFocusScriptInjected(tabId: number): Promise<boolean> {
  try {
    // First check if we can access this tab
    const tab = await browser.tabs.get(tabId)
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:')) {
      return false
    }

    const results = await browser.scripting.executeScript({
      target: { tabId },
      func: () => {
        return !!(document as any).isFocusScriptInjected
      }
    })
    
    return Array.isArray(results) && results.length > 0 ? !!results[0].result : false
  } catch (error) {
    // Don't log errors for browser pages we can't access
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes('Cannot access')) {
      console.error('Failed to check script injection:', error)
    }
    return false
  }
}

export function addListeners() {
  browser.tabs.onUpdated.addListener(injectFocusScriptOnTabChange)

  browser.tabs.onActivated.addListener(async function(activeInfo: { tabId: number }) {
    try {
      const response = await browser.tabs.sendMessage(activeInfo.tabId, { text: 'new-tab-activated' })
      if (response?.status === 'success') {
        return
      }
    } catch (error) {
      // Ignore errors from tabs where content script isn't loaded
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('Could not establish connection')) {
        console.error('Error sending message to tab:', error)
      }
    }
  })
}

addListeners()
