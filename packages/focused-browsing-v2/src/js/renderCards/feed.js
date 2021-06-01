import Vue from 'vue';
import FocusedFeedContainer from '../../components/Feed/FocusedFeedContainer.vue'

const app = new Vue({
    el: '#app',
    render: createElement => createElement(FocusedFeedContainer)
});