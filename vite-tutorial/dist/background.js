import{c as o,b as s}from"./assets/vendor.7c3aa7c0.js";const e=o({state:()=>({isTwitterFocused:!0,isLinkedinFocused:!0,config:{}}),mutations:{unfocus(o){console.log("unfocusing"),o.focused=!1}}});try{s.browserAction.onClicked.addListener((o=>{console.log("tab object below"),console.log(o),e.commit("unfocus")}))}catch(c){console.log("here is the error"),console.log(c)}
