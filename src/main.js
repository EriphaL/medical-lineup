import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";

// import LineUpJS from 'lineupjs';


import './assets/scss/style.scss'
import './assets/scss/_variable.scss'
// import '@/themes/index.scss'
// import '@/assets/less/style.less'
// import './assets//scss/variables/config.scss'



Vue.config.productionTip = false;

// Vue.use(LineUpJS)
// import { LINEUP_COMPONENTS } from 'vue-lineup'
import * as VueLineUp from 'vue-lineup'
console.log('VueLineUp：', VueLineUp);
// console.log(LINEUP_COMPONENTS, "vuelineup")
Vue.use(VueLineUp);

new Vue({
    render: h => h(App)
}).$mount("#app");