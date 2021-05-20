import Vue from 'vue';

import Focus from '../components/Focus.vue';

const app = new Vue({
    el: '#app',
    render: createElement => createElement(Focus)
});