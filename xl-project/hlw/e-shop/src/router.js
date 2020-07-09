import Vue from "vue";
import Router from "vue-router";
import routes from "@/routes";
import store from "@/store.js";
import Config from "@/utils/config";
// 解决路由跳转的时候两次push的path地址相同 报错问题
// const originalPush = Router.prototype.push;

Vue.use(Router);

const router = new Router({
    mode: "hash",
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});
// 路由守卫
router.beforeEach((to, from, next) => {
    // 不需要登录就能访问的
    const listPath = ["/home", "/shop", "/productDetails", "/commodity", "/productReview"];
    // 部分页面需要登录情况
    if (!store.state.token) {
        if ((listPath.indexOf(to.path) != -1) || (to.path == '/mineHome')) {
            next();
            store.commit('updateRedirectUrl', '');
            // 需要登录页面
        } else if (listPath.indexOf(to.path) == -1) {
            // 登录完成重定向
            store.commit('updateRedirectUrl', to.path);
            setTimeout(() => {
                window.location.href = Config.oauthUrl;
            }, 0);
        }
    }
    // 全部需要登录情况
    // if (!store.state.token) {
    //     if (to.path !== "/") {
    //         setTimeout(() => {
    //             window.location.href = Config.oauthUrl;
    //         }, 0);
    //         next(false);
    //     }
    // }
    next();
});
export default router;