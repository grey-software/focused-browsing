import { AppState, FocusMode } from './focus/types'
import { browser, Runtime, Tabs } from 'webextension-polyfill-ts'

const appState: AppState = {
  Twitter: FocusMode.Focused,
  LinkedIn: FocusMode.Focused,
  Youtube: FocusMode.Focused,
  Github: FocusMode.Focused,
  FaceBook: FocusMode.Focused,
  Unsupported: FocusMode.Unfocused,
}

let activeURL: string | undefined = ''

browser.storage.local.set({ appState: appState })

async function injectFocusScriptOnTabChange(tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) {
  let url: string | undefined = tab.url
  const isPageLoading = changeInfo && changeInfo.status == 'loading'
  if (!isPageLoading) {
    return
  }
  const isFocusScriptInjected = await checkFocusScriptInjected(tabId)
  if (isFocusScriptInjected) {
    return
  }

  browser.tabs.executeScript(tabId, {
    file: 'focus.js',
    runAt: 'document_start',
  })

  browser.tabs.executeScript(tabId, {
    code: 'document.isFocusScriptInjected = true',
    runAt: 'document_start',
  })
  activeURL = url
}

async function checkFocusScriptInjected(tabId: number) {
  /*
    This code queries the document for whether or not the focus script 
    is already injected. We return the answer in our code so that we can determine whether or not we should 
    inject the focus script again.
  */
  const focusScriptInjectedResult = await browser.tabs.executeScript(tabId, {
    code: 'var isFocusScriptInjected = document.isFocusScriptInjected || false; isFocusScriptInjected;',
    runAt: 'document_start',
  })
  return focusScriptInjectedResult && focusScriptInjectedResult[0]
}

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

browser.runtime.onMessage.addListener((message: { text: string }, sender: Runtime.MessageSender) => {
  if (message.text == 'unfocus-from-ui') {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs: Tabs.Tab[]) => {
      let activeTab = tabs[0]
      browser.tabs.sendMessage(activeTab.id!, { text: message.text })
    })
  }
})
