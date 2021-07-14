import { browser } from "webextension-polyfill-ts"

let focusState = { twitter: true, linkedin: true }

let activeURL = ''


chrome.storage.local.set({ focusState: focusState })

async function injectFocusScriptOnTabChange(tabId, changeInfo, tab) {
  let url = tab.url
  const isPageLoading = changeInfo && changeInfo.status == 'loading'
  if (!isPageLoading) {
    return
  }
  
  const focusScriptInjectedResult = await checkFocusScriptInjected(tabId)
  const focusScriptInjected = focusScriptInjectedResult && focusScriptInjectedResult[0]
  if (focusScriptInjected) {
    if (url != activeURL && !isHomeURLLoad(activeURL, url)) {
      activeURL = url
      chrome.tabs.sendMessage(tabId, { text: 'new page loaded on website', url: activeURL }, function (response) {
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

async function checkFocusScriptInjected(tabId) {
  return new Promise(function (resolve, _) {
    /*
      This code queries the document for whether or not the focus script 
      is already injected. We return the answer in our code so that we can determine whether or not we should 
      inject the focus script again.
    */
    const checkingScriptDetails = {
      code: 'var isFocusScriptInjected = document.isFocusScriptInjected || false; isFocusScriptInjected;',
      runAt: 'document_start',
    }
    chrome.tabs.executeScript(tabId, checkingScriptDetails, function (result) {
      resolve(result)
    })
  })
}

const isHomeURLLoad = (currentUrl, newUrl) => {
  console.log("here checking homeURL")
  if (newUrl.includes('twitter.com')) {
    return newUrl == 'https://twitter.com/home' && currentUrl == 'https://twitter.com/'
  } else if (newUrl.includes('linkedin.com')) {
    return newUrl.includes('/feed') && currentUrl == 'https://www.linkedin.com/'
  }
}

chrome.tabs.onUpdated.addListener(injectFocusScriptOnTabChange)

chrome.tabs.onActivated.addListener(async function (activeInfo) {
  let tabId = activeInfo.tabId
  chrome.tabs.sendMessage(tabId, { text: 'different tab activated' }, function (response) {
    response = response || {}
    if (response.status == 'tab change confirmed') {
      return
    }
  })
})

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.text == "unfocus from vue"){
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      var activeTab = tabs[0]
      browser.tabs.sendMessage(activeTab.id, { text: message.text })
    })
  }
});
