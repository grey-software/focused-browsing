import { browser } from "webextension-polyfill-ts";
import { createStore } from "vuex";

interface FocusedBrowsingState {
  isTwitterFocused: boolean;
  isLinkedinFocused: boolean;
  config: Object;
}

// Create a new store instance.
const store = createStore({
  state() {
    return {
      isTwitterFocused: true,
      isLinkedinFocused: true,
      config: {},
    };
  },
  mutations: {
    unfocus(state: FocusedBrowsingState) {
      console.log("unfocusing");
      state.focused = false;
    },
  },
});

try {
  browser.browserAction.onClicked.addListener((tab) => {
    console.log("tab object below");
    console.log(tab);
    store.commit("unfocus");
  });
} catch (err) {
  console.log("here is the error");
  console.log(err);
}
