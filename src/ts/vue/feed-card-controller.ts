import Vue from 'vue'
import FocusedFeedContainer from '../../components/FocusContainer.vue'

const app = new Vue({
  el: '#app',
  render: (createElement) => createElement(FocusedFeedContainer),
})
