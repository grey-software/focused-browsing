import { browser, Tabs } from "webextension-polyfill-ts";


  browser.browserAction.onClicked.addListener(async (tab: Tabs.Tab) => {
    // console.log("tab object below");
    // console.log(tab);
    // console.log(tab.url)
    console.log("executing script")
    await browser.tabs.executeScript(tab.id,{
      file: 'focus.js',
      runAt: 'document_start',
    })

  })

  browser.runtime.onMessage.addListener(function(message: any){
    console.log(message)
  })

  
