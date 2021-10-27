import { Action, browser, Runtime, Tabs } from 'webextension-polyfill-ts'

let focusState = { twitter: true, linkedin: true, youtube: true, github: true }

let activeURL: string | undefined = ''

browser.storage.local.set({ focusState: focusState })

async function injectFocusScriptOnTabChange(tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) {
  let url: string | undefined = tab.url
  const isPageLoading = changeInfo && changeInfo.status == 'loading'
  if (!isPageLoading) {
    return
  }
  const focusScriptInjectedResult = await checkFocusScriptInjected(tabId)
  const focusScriptInjected = focusScriptInjectedResult && focusScriptInjectedResult[0]
  if (focusScriptInjected) {
    if (url != activeURL && activeURL && url && !isHomeURLLoad(activeURL, url)) {
      activeURL = url
      browser.tabs
        .sendMessage(tabId, { text: 'new page loaded on website', url: activeURL })
        .then((response: { status?: string }) => {
          response = response || {}
          if (response.status == 'tab change within website confirmed') {
            return
          }
        })
    }

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
  return focusScriptInjectedResult
}

const isHomeURLLoad = (currentUrl: string, newUrl: string) => {
  if (newUrl.includes('twitter.com')) {
    return newUrl == 'https://twitter.com/home' && currentUrl == 'https://twitter.com/'
  } else if (newUrl.includes('linkedin.com')) {
    return newUrl.includes('/feed') && currentUrl == 'https://www.linkedin.com/'
  } else if (newUrl.includes('github.com')) {
    return currentUrl == 'https://github.com/'
  }
}

browser.tabs.onUpdated.addListener(injectFocusScriptOnTabChange)

browser.tabs.onActivated.addListener(async function (activeInfo: { tabId: number }) {
  let tabId = activeInfo.tabId

  browser.tabs.sendMessage(tabId, { text: 'different tab activated' }).then((response: { status?: string }) => {
    response = response || {}
    if (response.status == 'tab change confirmed') {
      return
    }
  })
})

browser.runtime.onMessage.addListener((message: { text: string }, sender: Runtime.MessageSender) => {
  if (message.text == 'unfocus from vue') {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs: Tabs.Tab[]) => {
      var activeTab = tabs[0]
      browser.tabs.sendMessage(activeTab.id!, { text: message.text })
    })
  }
})
