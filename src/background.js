async function injectFocusScriptOnTabChange(tabId, changeInfo) {
  const isPageLoading = changeInfo && changeInfo.status == 'loading'
  if (!isPageLoading) {
    return
  }

  // the result of the resolved promise is an array that looks like: [false]
  const focusScriptInjectedResult = await checkFocusScriptInjected(tabId)
  const focusScriptInjected = focusScriptInjectedResult && focusScriptInjectedResult[0]

  if (focusScriptInjected) {
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
}

async function checkFocusScriptInjected(tabId) {
  return new Promise(function (resolve, _) {
    /*
      This code queries the document for whether or not the focus script 
      is already injected. We return the answer in our code so that we can determine whether or not we should 
      inject the focus script again.
    */
    const checkingScriptDetails = {
      code: 'let isFocusScriptInjected = document.isFocusScriptInjected || false; isFocusScriptInjected;',
      runAt: 'document_start',
    }
    chrome.tabs.executeScript(tabId, checkingScriptDetails, function (result) {
      resolve(result)
    })
  })
}

chrome.tabs.onUpdated.addListener(injectFocusScriptOnTabChange)
