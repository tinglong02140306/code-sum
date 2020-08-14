// pages/login/login.js
import { OPENID, CODE } from '../../constants/global';
import { getAuthCode } from "../../utils/login";
import { loginApi, test} from '../../http/api';
import { getPostPromise } from '../../http/http';
import { showLoading, hideLoading, showToast } from "../../utils/my";
let timer = null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        type: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('login', options)
        this.setData({
            type: options.type ? options.type : ""
        })
        getAuthCode();
        timer = setInterval(() => {
            getAuthCode();
        }, 60000 * 5)
    },

    onUnload() {
        hideLoading();
        clearInterval(timer);
        timer = null;
    },
    //用户未登录  获取手机号权限 async
    async onGetAuthorize() {
        try {
            this.getPhoneNumber();
        } catch (e) {
        }
    },
    onAuthError() {

    },
    // 获取会员基本信息 姓名 头像
    getOpenUserInfo() {
        return new Promise((resolve, reject) => {
            my.getOpenUserInfo({
                success: res => resolve(JSON.parse(res.response).response),
                fail: err => reject({
                    message: "请授权小程序获取您的基本信息"
                })
            });
        });
    },
    // 获取手机号权限 姓名头像 电话号码
    getPhoneNumber() {
        my.getPhoneNumber({
            success: res => {
                // response sign
                let data = JSON.parse(res.response);
                let param = {
                    response: data.response,
                    sign: data.sign,
                    auth_code: my.getStorageSync({ key: CODE }).data,
                    invite_code: my.getStorageSync({ key: 'marketCode' }).data
                }
                showLoading("登录中...");
                this.login(param);
            },
            fail: err => {
                showToast("请授权小程序获取您的基本信息");
            }
        });
    },
    //登录
    login(params) {
        getPostPromise(loginApi.userLogin, params).then(res => {
            hideLoading();
            showToast("登录成功");
            my.setStorageSync({ key: OPENID, data: res.token });
            // 手机号脱敏
            // a.substring(0,3) + '******' + a.substring(9,11)
            timer && clearInterval(timer);
            if (this.data.type == 'mine') {
                my.switchTab({
                    url: `/pages/mine/index/index`
                });
            } else {
                my.navigateBack();
            }
        }).catch(err => {
            hideLoading();
            showToast(`${err.msg}:${err.code}`)
            timer && clearInterval(timer);
            getAuthCode();
            timer = setInterval(() => {
                getAuthCode();
            }, 60000 * 5)
        });
    },
})