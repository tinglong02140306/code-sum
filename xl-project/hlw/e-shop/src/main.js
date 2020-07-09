import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "amfe-flexible/index.js";
import vConsole from 'vconsole'
Vue.prototype.$vConsole= new vConsole()


import axios from 'axios'; // 第三方axios方法

import '@/assets/styles/base.less';

// 跨域访问需要发送cookie时一定要加
// axios.defaults.withCredentials = true;
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");