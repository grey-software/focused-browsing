import{b as e}from"./assets/vendor.3d5ea50e.js";e.browserAction.onClicked.addListener((async s=>{console.log("executing script"),await e.tabs.executeScript(s.id,{file:"focus.js",runAt:"document_start"})})),e.runtime.onMessage.addListener((function(e){console.log(e)}));