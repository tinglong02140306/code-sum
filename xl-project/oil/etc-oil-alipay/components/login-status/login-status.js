/*
 * @Author: sunmingmao
 * @Date: 2020-04-11 09:43:32
 * @LastEditors: longting
 * @LastEditTime: 2020-05-19 
 * @Description: login
 */
import { login, getOpenUserInfo } from '../../utils/login';
import { showLoading, hideLoading, showToast } from '../../utils/my';

Component({
    /**
     * 组件的属性列表
     */
    props: {
        //点击事件需要携带的数据
        source: null,
        openid: "",
        item: null,
    },
    /**
     * 组件的初始数据
     */
    data: {
        encrypted: null,
        width: 0,
        height: 0,
        open_id: ""
    },
    didMount() {
        my.createSelectorQuery().select('#content').boundingClientRect().exec((rect) => {
            if (rect && rect[0]) {
                this.setData({
                    width: rect[0].width,
                    height: rect[0].height
                });
            }
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getTap() {},
        //用户已登录
        getClick(e) {
            let source = this.props.source;
            this.props.onClick(source);
        },
        //用户未登录 获取手机号权限 async
        async onGetAuthorize() {
            try {
                // TODO 模拟登陆 待删除
                // if (!my.getStorageSync({
                //         key: OPENID
                //     }).data) {
                //     my.setStorageSync({
                //         key: OPENID,
                //         data: 'dsfgdfgdf'
                //     });
                // }
                // let userInfo = await getOpenUserInfo();
                // console.log(OPENID, my.getStorageSync({
                //     key: OPENID
                // }).data);
                // console.log('getOpenUserInfo', JSON.stringify(userInfo));
                // // my.alert({content: JSON.stringify(userInfo)})
                // let source = {
                //     ...userInfo,
                //     ...this.props.source
                // }
                // this.props.onClick(source);
                // return;
                showLoading("登录中...");
                login().then(res => {
                    hideLoading();
                    showToast("登录成功");
                    this.props.onClick(source);
                }).catch(err => {
                    hideLoading();
                    showToast(err);
                });
            } catch (e) {

            }

        },
    }
})