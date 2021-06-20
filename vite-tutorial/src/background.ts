import { browser } from "webextension-polyfill-ts";

try {
    browser.browserAction.onClicked.addListener(tab => {
        console.log("tab object below")
        console.log(tab)
    })
}catch(err){
    console.log("here is the error")
    console.log(err)
}

