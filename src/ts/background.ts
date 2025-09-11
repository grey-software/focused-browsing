import { AppState, FocusMode } from './focus/types'
import { browser, Runtime, Tabs } from 'webextension-polyfill-ts'

const appState: AppState = {
  Twitter: FocusMode.Focused,
  LinkedIn: FocusMode.Focused,
  Youtube: FocusMode.Focused,
  Github: FocusMode.Focused,
  Unsupported: FocusMode.Unfocused,
}

let activeURL: string | undefined = ''

browser.storage.local.set({ appState: appState })

export async function injectFocusScriptOnTabChange(tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) {
  let url: string | undefined = tab.url
  const isPageLoading = changeInfo && changeInfo.status == 'loading'
  if (!isPageLoading) {
    return
  }
  const isFocusScriptInjected = await checkFocusScriptInjected(tabId)
  if (isFocusScriptInjected) {
    return
  }

  browser.scripting.executeScript({
    target: { tabId: tabId },
    files: ['focus.js'],
  })

  browser.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      document.isFocusScriptInjected = true
    },
  })
  activeURL = url
}

export async function checkFocusScriptInjected(tabId: number) {
  /*
    This code queries the document for whether or not the focus script 
    is already injected. We return the answer in our code so that we can determine whether or not we should 
    inject the focus script again.
  */
  const focusScriptInjectedResult = (await browser.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      return document.isFocusScriptInjected || false
    },
  })) as any
  return focusScriptInjectedResult && focusScriptInjectedResult[0].result
}

export function addListeners() {
  browser.tabs.onUpdated.addListener(injectFocusScriptOnTabChange)

  browser.tabs.onActivated.addListener(async function (activeInfo: { tabId: number }) {
    let tabId = activeInfo.tabId

    browser.tabs.sendMessage(tabId, { text: 'new-tab-activated' }).then((response: { status?: string }) => {
      response = response || {}
      if (response.status == 'success') {
        return //Success
      }
    })
  })
}

addListeners()


