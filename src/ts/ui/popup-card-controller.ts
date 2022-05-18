import Vue from 'vue'
import { browser } from 'webextension-polyfill-ts'
import Popup from '../../components/Popup.vue'

new Vue({
  el: '#app',
  render: (createElement) => createElement(Popup),
})
