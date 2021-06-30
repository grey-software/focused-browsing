let focusState = { twitter: true, linkedin: true }

let activeURL = ""
chrome.storage.local.clear()
chrome.storage.local.set({ focusState: focusState })
chrome.storage.local.get('focusState', function (data) {
  console.log(data)
})

async function injectFocusScriptOnTabChange(tabId, changeInfo, tab) {
  let url = tab.url
  const isPageLoading = changeInfo && changeInfo.status == 'loading'
  if (!isPageLoading) {
    return
  }

  const focusScriptInjectedResult = await checkFocusScriptInjected(tabId)
  const focusScriptInjected = focusScriptInjectedResult && focusScriptInjectedResult[0]

  if (focusScriptInjected) {
    if(url != activeURL && !isHomeURLLoad(activeURL, url)){
      console.log("url is: "+ url)
      console.log("activeURL is: " + activeURL)
      activeURL = url
      chrome.tabs.sendMessage(tabId, { text: 'new page loaded on website', url:activeURL}, function (response) {
        response = response || {}
        if (response.status == 'tab change within website confirmed') {
          return
        }
      })
    }

    return 
  }

  chrome.tabs.executeScript(tabId, {
    file: 'focus.js',
    runAt: 'document_start',
  })

  chrome.tabs.executeScript(tabId, {
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
  if(newUrl.includes("twitter.com")){
    return newUrl == "https://twitter.com/home" && currentUrl == "https://twitter.com/"
  }else if(newUrl.includes("linkedin.com")){
    return newUrl == "https://www.linkedin.com/feed/" && currentUrl == "https://www.linkedin.com/"
  }
}

chrome.tabs.onUpdated.addListener(injectFocusScriptOnTabChange)

chrome.tabs.onActivated.addListener(async function (activeInfo) {
  let tabId = activeInfo.tabId
  console.log("sending message")
  chrome.tabs.sendMessage(tabId, { text: 'different tab activated' }, function (response) {
    response = response || {}
    if (response.status == 'tab change confirmed') {
      return
    }
  })
})

async function getActiveURL() {
  return new Promise(function (resolve, _) {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        resolve(tabs)
      }
    )
  })
}
