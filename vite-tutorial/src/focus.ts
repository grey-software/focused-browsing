import { browser,Tabs } from "webextension-polyfill-ts"; 


(async function(){
    console.log("focus.ts injected")

    let tabInfo:Tabs.Tab[] = await browser.tabs.query({active:true, currentWindow: true })
    const activeTab = tabInfo[0]
    console.log(activeTab)
    // browser.tabs.sendMessage(activeTab.id, { text: 'unfocus from vue' })

})();
