import Vue from 'vue'
import FocusedFeedContainer from '../components/FocusedFeedContainer.vue'

const app = new Vue({
  el: '#app',
  render: (createElement) => createElement(FocusedFeedContainer),
})
