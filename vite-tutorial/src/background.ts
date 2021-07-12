import { browser } from "webextension-polyfill-ts";
import { createStore } from "vuex";



interface FocusedBrowsingState {
  isTwitterFocused: boolean;
  isLinkedinFocused: boolean;
  config: Object;
  currentURL: String;
}

// Create a new store instance.
const store = createStore({
  state() {
    return {
      isTwitterFocused: true,
      isLinkedinFocused: true,
      config: {},
      currentURL: ""
    };
  },

  

  mutations: {
    unfocus(state: FocusedBrowsingState) {
      console.log("unfocusing");
      if(state.currentURL.includes("linkedin.com")){
        state.isLinkedinFocused = false;
      }else{
        state.isTwitterFocused = false;
      }
    },
    focus(state: FocusedBrowsingState){
      console.log("focusing")
      if(state.currentURL.includes("linkedin.com")){
        state.isLinkedinFocused = false;
      }else{
        state.isTwitterFocused = false;
      }
    },
    changeURL(state: FocusedBrowsingState, url: String){
      state.currentURL = url
    }
  },

  getters:{
    getCurrentURL(state: FocusedBrowsingState){
      return state.currentURL
    }
  },

  actions: {
    fetchURL(context){
      browser.tabs.query({currentWindow: true, active: true}).then((tabs: any) => {
        let tab = tabs[0]; // Safe to assume there will only be one result
        console.log(tab);
        console.log(tab.url)
      }, console.error); 
    }
  },


});

try {
  browser.browserAction.onClicked.addListener((tab: any) => {
    // console.log("tab object below");
    // console.log(tab);
    // console.log(tab.url)
    store.dispatch('fetchURL')
  });

} catch (err) {
  console.log("here is the error");
  console.log(err);
}
