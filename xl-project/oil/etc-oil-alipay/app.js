import { getAuthCode } from "./utils/login";
import { getQueryString } from "./utils/util";
import { OPENID, CODE_WASHER } from './constants/global';
App({
    onLaunch(options) {
        this.dealUpdate();
        const res = my.getSystemInfoSync();
        console.log(res);
        this.globalData.statusBarHeight = res.statusBarHeight;
        this.globalData.titleBarHeight = res.platform == "android" ? 48 : 44;
        this.globalData.navigationBarHeight = this.globalData.statusBarHeight + this.globalData.titleBarHeight;
        this.globalData.isIphoneX = res.model.includes("iPhone X");
        this.globalData.screenWidth = res.screenWidth;
        this.globalData.screenHeight = res.screenHeight;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.windowWidth = res.windowWidth;
    },
    globalData: {
        userInfo: null,
        location: null, //当前所在位置的经纬度信息
        statusBarHeight: 0, //状态栏高度
        titleBarHeight: 0, //标题栏高度
        navigationBarHeight: 0, //导航栏高度
        isIphoneX: false,
        screenWidth: 375,
        screenHeight: 667,
        windowHeight: 603,
        windowWidth: 375,
        
    },
    dealUpdate() {
        if (my.canIUse('getUpdateManager')) {
            const updateManager = my.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                console.log("更新:" + res.hasUpdate);
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        my.confirm({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success() {
                                updateManager.applyUpdate()
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        my.confirm({
                            title: '温馨提示',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        } else {
            my.confirm({
                title: '温馨提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    onShow(options) {
        console.log('options onshow', JSON.stringify(options))
        let scene = options.scene;
        if (scene == 1011) {
            //扫码进入小程序停车确认页面
            my.setStorageSync({key: CODE_WASHER, data: true});
            if (options && options.query && options.query.qrCode) {
                let url = options.query.qrCode.split("?")[1],
                    id = getQueryString(url, 'id'),
                    marketCode = getQueryString(url, 'marketCode');
                console.log(id, marketCode)
                my.setStorageSync({key: 'marketCode', data: marketCode});
                my.setStorageSync({key: 'WASHID', data: id});
            }
        }else {
            my.setStorageSync({key: CODE_WASHER, data: false});
        }
        // TODO
        // my.setStorageSync({ key: 'avatar', data: "https://tfs.alipayobjects.com/images/partner/T1d.xCXotaXXXXXXXX" });
        // my.setStorageSync({ key: 'nickName', data: "polly" });
        my.setStorageSync({ key: OPENID, data: "YWE4NmNiNTNmNTY5NGY3MmI5OTlhZGUzNTUyNlNYNzQ="})
    }
});