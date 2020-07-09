import $ from 'expose-loader?jQuery!jquery';

import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router/';
import ElementUI from 'element-ui';

import '@/assets/ueditor/ueditor.config.js'
import '@/assets/ueditor/ueditor.all.min.js'
import '@/assets/ueditor/lang/zh-cn/zh-cn.js'
// import '@/assets/ueditor/ueditor.parse.min.js'

import VueResource from 'vue-resource';

import axios from 'axios'; // 第三方axios方法

// import jquery from 'jquery'; // 引入jquery

import qs from 'qs'; // 参数转换

import api from './api/action'; // ajax方法

import iView from 'iview';
import '@/assets/styles/iview1.css';
import '@/assets/styles/iview2.css';
import '@/assets/styles/iview3.css';

// 基础样式
import '@/assets/styles/base.less';
// iview样式重写
import '@/assets/styles/iview-reset.less';
// iconfont图标
import '@/assets/font/iconfont.css';

import '@/assets/styles/theme.less';

// import vueUploadWeb from 'vue-upload-web';

// import EasyScroll from 'easyscroll';
// Vue.use(EasyScroll);
// Vue.use(vueUploadWeb);
Vue.use(VueResource);
axios.defaults.withCredentials = true;

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$api = api;
Vue.prototype.$ = $;
Vue.use(iView);
Vue.use(ElementUI);

Vue.http.options.emulateJSON = true;
Vue.http.options.xhr = { withCredentials: true };
Vue.http.interceptors.push((request, next) => {
    request.credentials = true
    next()
});


router.beforeEach((to, from, next) => {
    // 判断该路由是否需要登录权限
    if (to.meta.requireAuth) {
        if (store.getters.isLogin) {
            next();
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
        }
    } else {
        if (sessionStorage.menuState) {
            store.commit('setState', {
                menuState: sessionStorage.menuState
            });
        }
        if (localStorage.fontFlag) {
            store.commit('setState', {
                fontFlag: localStorage.fontFlag
            });
        }
        if (localStorage.colorFlag) {
            store.commit('setState', {
                colorFlag: localStorage.colorFlag
            });
        }
        // 高拍仪实例化对象
        // if (localStorage.dev) {
        //     store.commit('setState', {
        //         dev: localStorage.dev
        //     });
        // }
        if (localStorage.gpyConfigInfo) {
            store.commit('setState', {
                gpyConfigInfo: localStorage.gpyConfigInfo
            });
        }
        // if (localStorage.clipCkecked) {
        //     store.commit('setState', {
        //         clipCkecked: localStorage.gpyConfigInfo
        //     });
        // }
        // if (localStorage.takePicFlag) {
        //     store.commit('setState', {
        //         takePicFlag: takePicFlag
        //     });
        // }

       // to.fullPath.indexOf('guideWrap') != -1 || to.fullPath.indexOf('receiverSuccess') != -1 || to.fullPath.indexOf('eventDetails') != -1 || to.fullPath.indexOf('receiptDetails') != -1 || to.fullPath.indexOf('affairsGuide') != -1
       if(to.fullPath.indexOf('eventDetails') != -1 || to.fullPath.indexOf('eventReceiptDetails') != -1) {
            store.commit('setState', {
                isNew: false
            });
        } else {
            store.commit('setState', {
                isNew: true
            });
        }
        if (to.fullPath.indexOf('searchMatters') != -1) {
            store.commit('setState', {
                isIndexPage: true
            });
        } else {
            store.commit('setState', {
                isIndexPage: false
            });
        }
        next();
    }
});

/* eslint-disable no-new */
let vueVm = new Vue({
    // 过载到 vm.$el 中
    el: '#app',
    // 当前 vm 使用的路由
    router,
    // 当前 vm 使用的数据
    store,
    // 模板视图
    template: '<App/>',
    // 组件
    components: { App }
});

// 路由监听
router.beforeEach((to, from, next) => {
    // eventReceiptDetails
    if (to.fullPath.indexOf('eventDetails') != -1 || to.fullPath.indexOf('eventReceiptDetails') != -1) {
        store.commit('setState', {
            isNew: false
        });
    } else {
        store.commit('setState', {
            isNew: true
        });
    }
    next();
});