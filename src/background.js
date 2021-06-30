let focusState = { twitter: true, linkedin: true }

chrome.storage.local.clear()
chrome.storage.local.set({ focusState: focusState })
chrome.storage.local.get('focusState', function (data) {
  console.log(data)
})

async function injectFocusScriptOnTabChange(tabId, changeInfo) {
  const isPageLoading = changeInfo && changeInfo.status == 'loading'
  if (!isPageLoading) {
    return
  }
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
      code: 'var isFocusScriptInjected = document.isFocusScriptInjected || false; isFocusScriptInjected;',
      runAt: 'document_start',
    }
    chrome.tabs.executeScript(tabId, checkingScriptDetails, function (result) {
      resolve(result)
    })
  })
}

chrome.tabs.onUpdated.addListener(injectFocusScriptOnTabChange)


// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   let tabId = activeInfo.tabId
//   // send a message to the tab with the url
//   console.log("new tab activated")
//   chrome.tabs.sendMessage(tabId, {text: "current tab has changed"},function(response){
//     response = response || {};
//     if(response.status == "tab change confirmed"){
//       return
//     }
//   })
// })
