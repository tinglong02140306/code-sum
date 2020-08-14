import { getPostPromise } from "../../../../http/http";
import { accountApi } from "../../../../http/api";
import { keepDecimalFull } from '../../../../utils/util';
import { OPENID, STATIONPAGE } from "../../../../constants/global";
import { PreferenceMoney, PerferPull, PerferUsed, PerferLose, PerferQrcode, PreferenceCar } from '../../../../assets/url/url'
const app = getApp();
let PAGE_OIL = 1; //加油券
let PAGE_COUPON = 1; //提货券
let PAGE_FINISH = 1; //已结束
const PAGE_SIZE = 10;
const tabHeight = 90;
const bottomHeight = 120;
const tabs = [
    // {title:'加油券',key:0},
    // {title:'提货券',key:1},
    // {title:'已结束',key:2},
    {
        title: '未使用',
        key: 1
    },
    {
        title: '已使用',
        key: 2
    },
    {
        title: '已过期',
        key: 4
    },
]

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: app.globalData.isIphoneX,
        tab_height: tabHeight,
        scroll_height: `calc(100vh - ${tabHeight}rpx - ${bottomHeight}rpx)`,
        tabs: tabs,
        type: 1, //0:加油券 1:提货券 2:已结束 ==> 1-未使用，2-已使用，4-已过期
        oil_list: [], //加油券 ==> 未使用券
        coupon_list: [], //提货券 ==> 已使用券
        finish_list: [], //已结束 ==> 已过期券
        oil_load_status: 0, //上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
        oil_refresher: false, //下拉刷新状态
        oil_status: 0, //1:列表为空 2:网络连接失败
        coupon_load_status: 0, //上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
        coupon_refresher: false, //下拉刷新状态
        coupon_status: 0, //1:列表为空 2:网络连接失败
        finish_load_status: 0, //上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
        finish_refresher: false, //下拉刷新状态
        finish_status: 0, //1:列表为空 2:网络连接失败

        coupon_code: '', //券码
        unUsedStyleObj: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getOilList();
    },

    onShow: function () {
        PAGE_OIL = 1; //未使用
        this.setData({
            openid: wx.getStorageSync(OPENID)
        });
    },

    onUnload: function () {
        PAGE_OIL = 1;
        PAGE_COUPON = 1;
        PAGE_FINISH = 1;
    },

    //扫一扫
    onCodeScan: function () {
        let _this = this;
        wx.scanCode({
            success: (res) => {
                let result = res.result;
                _this.setData({
                    coupon_code: result,
                })
            }
        })
    },
    //输入兑换码
    onCouponCodeInput: function (e) {
        const value = e.detail.value;
        this.setData({
            coupon_code: value
        });
    },
    //兑换
    onCodeClick: function (e) {
        if (this.data.coupon_code) {
            this.redeemCoupon();
        } else {
            wx.showToast({
                title: "请输入兑换码",
                icon: 'none'
            });
        }
    },
    //设置默认使用
    onSetDefault: function (e) {
        this.getSetDefaultHttp(e.detail.coupon_put_id);
    },

    //立即使用
    onSetSelect: function (e) {
        let type = e.detail.coupon_type;
        if (type == '0' || type == '1' || type == '4') {
            PAGE_OIL = 1; //未使用
            // 0 加油  1 洗车
            wx.setStorageSync(STATIONPAGE, type == '0' ? 0 : 1);
            //加油优惠券
            wx.switchTab({
                url: `/pages/stations/index/index`
            })
        }
    },
    // template TODO
    onSetSelectClick: function(e) {
        let type = e.target.dataset.item.coupon_type;
        if (type == '0' || type == '1' || type == '4') {
            PAGE_OIL = 1; //未使用
            // 0 加油  1 洗车
            wx.setStorageSync(STATIONPAGE, type == '0' ? 0 : 1);
            //加油优惠券
            wx.switchTab({
                url: `/pages/stations/index/index`
            })
        }
    },
    //查看券码
    onSeeCoupon: function (e) {
        wx.navigateTo({
            url: `/pages/mine/coupons/coupon/coupon?coupon_put_id=${e.detail}`
        })
    },
    // template TODO
    onSeeCouponClick: function (e) {
        wx.navigateTo({
            url: `/pages/mine/coupons/coupon/coupon?coupon_put_id=${e.target.dataset.item}`
        })
    },

    //刷新未使用优惠券
    onRefreshCoupon: function () {
        PAGE_OIL = 1;
        this.getOilList();
    },

    //切换Tab
    onTabItemClick: function (e) {
        const {
            type
        } = this.data;
        const index = e.currentTarget.dataset.item;
        if (type != index) {
            switch (index) {
                case 1:
                    PAGE_OIL = 1;
                    this.getOilList();
                    break;
                case 2:
                    PAGE_COUPON = 1;
                    this.getCouponList();
                    break;
                case 4:
                    PAGE_FINISH = 1;
                    this.getFinishList();
                    break;
            }
        }
        this.setData({
            type: index
        });
    },

    //重新加载
    onRetryClick: function () {
        const {
            type
        } = this.data;
        switch (type) {
            case 0:
                PAGE_OIL = 1;
                this.getOilList();
                break;
            case 1:
                PAGE_COUPON = 1;
                this.getCouponList();
                break;
            case 2:
                PAGE_FINISH = 1;
                this.getFinishList();
                break;
        }
    },

    //加油券 下拉刷新
    onOilRefresh: function () {
        PAGE_OIL = 1;
        this.setData({
            oil_refresher: true
        });
        this.getOilList();
    },

    //加油券 加载更多
    onOilLoadMore: function () {
        this.setData({
            oil_load_status: 1
        });
        PAGE_OIL++;
        this.getOilList();
    },

    //提货券下拉刷新
    onCouponRefresh: function () {
        PAGE_COUPON = 1;
        this.setData({
            coupon_refresher: true
        });
        this.getCouponList();
    },

    //提货券加载更多
    onCouponLoadMore: function () {
        this.setData({
            coupon_load_status: 1
        });
        PAGE_COUPON++;
        this.getCouponList();
    },

    //已使用下拉刷新
    onFinishRefresh: function () {
        PAGE_FINISH = 1;
        this.setData({
            finish_refresher: true
        });
        this.getFinishList();
    },

    //已使用加载更多
    onFinishLoadMore: function () {
        this.setData({
            finish_load_status: 1
        });
        PAGE_FINISH++;
        this.getFinishList();
    },

    //兑换优惠券
    redeemCoupon: function () {
        const {
            coupon_code
        } = this.data;
        wx.showLoading({
            title: "正在兑换...",
            mask: true
        });
        const params = {
            coupon_code: coupon_code
        }
        getPostPromise(accountApi.redeemCoupon, params).then(res => {
            wx.hideLoading();
            this.setData({
                coupon_code: null,
                type: 1,
            });
            this.timer = setTimeout(() => {
                wx.showToast({
                    title: "兑换成功",
                    icon: "none"
                });
                // this.onOilRefresh();
                PAGE_OIL = 1;
                this.getOilList();
                clearTimeout(this.timer);
            }, 500);
        }).catch(err => {
            wx.hideLoading();
            wx.showToast({
                title: `${err.msg}`,
                icon: "none"
            });
        });
    },

    //设置默认代扣(洗车需求没有)
    getSetDefaultHttp: function (coupon_put_id) {
        wx.showLoading({
            title: "正在设置...",
            mask: true
        });
        const params = {
            coupon_put_id: coupon_put_id
        }
        getPostPromise(accountApi.couponSet, params).then(res => {
            wx.hideLoading();
            wx.showToast({
                title: "设置成功",
                icon: "none"
            });
            PAGE_OIL = 1;
            this.getOilList();
        }).catch(err => {
            wx.hideLoading();
            wx.showToast({
                title: `${err.msg}:${err.code}`,
                icon: "none"
            });
        });
    },

    //获取加油券==未使用
    getOilList: function () {
        PAGE_OIL == 1 && wx.showLoading({
            title: "正在加载中...",
            mask: true
        });
        const params = {
            coupon_use_status: 1,
            page_num: PAGE_OIL,
            page_size: PAGE_SIZE
        }
        getPostPromise(accountApi.couponList, params).then(res => {
            wx.hideLoading();
            const data = this.dealResponse(res.data);
            const list = PAGE_OIL == 1 ? data : this.data.oil_list.concat(data);
            this.setData({
                oil_list: list,
                oil_refresher: false,
                oil_load_status: data && data.length < PAGE_SIZE ? 2 : 0,
                oil_status: !list || !list.length ? 1 : 0,
                coupon_code: null,
            });
            //TODO
            this.dealUnUsedStyle()
        }).catch(err => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
                title: `${err.msg}:${err.code}`,
                icon: "none"
            });
            const {
                oil_list
            } = this.data;
            this.setData({
                oil_refresher: false,
                oil_load_status: 0,
                oil_status: !oil_list || !oil_list.length ? 2 : 0,
            });
        });
    },
    //获取提货券==>已使用
    getCouponList: function () {
        PAGE_COUPON == 1 && wx.showLoading({
            title: "正在加载中...",
            mask: true
        });
        const params = {
            coupon_use_status: 2,
            page_num: PAGE_COUPON,
            page_size: PAGE_SIZE
        }
        getPostPromise(accountApi.couponList, params).then(res => {
            wx.hideLoading();
            const data = this.dealResponse(res.data);
            const list = PAGE_COUPON == 1 ? data : this.data.coupon_list.concat(data);
            console.log(list)
            this.setData({
                coupon_list: list,
                coupon_refresher: false,
                coupon_load_status: data && data.length < PAGE_SIZE ? 2 : 0,
                coupon_status: !list || !list.length ? 1 : 0,
                coupon_code: null,
            });
        }).catch(err => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
                title: `${err.msg}:${err.code}`,
                icon: "none"
            });
            const {
                coupon_list
            } = this.data;
            this.setData({
                coupon_refresher: false,
                coupon_load_status: 0,
                coupon_status: !coupon_list || !coupon_list.length ? 2 : 0,
            });
        });
    },

    //已使用的优惠券==>已过期
    getFinishList: function () {
        PAGE_FINISH == 1 && wx.showLoading({
            title: "正在加载中...",
            mask: true
        });
        const params = {
            coupon_use_status: 4,
            page_num: PAGE_FINISH,
            page_size: PAGE_SIZE
        }
        getPostPromise(accountApi.couponList, params).then(res => {
            wx.hideLoading();
            const data = this.dealResponse(res.data);
            const list = PAGE_FINISH == 1 ? data : this.data.finish_list.concat(data);
            this.setData({
                finish_list: list,
                finish_refresher: false,
                finish_load_status: data && data.length < PAGE_SIZE ? 2 : 0,
                finish_status: !list || !list.length ? 1 : 0,
                coupon_code: null,
            });
        }).catch(err => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
                title: `${err.msg}:${err.code}`,
                icon: "none"
            });
            const {
                finish_list
            } = this.data;
            this.setData({
                finish_refresher: false,
                finish_load_status: 0,
                finish_status: !finish_list || !finish_list.length ? 2 : 0,
            });
        });
    },

    /**
     * 数据处理
     */
    dealResponse: function (data) {
        return data && data.map(item => {
            const y = item.invalid_time.substr(0, 4);
            const m = item.invalid_time.substr(5, 2);
            const d = item.invalid_time.substr(8, 2);
            item.invalid_time = y + '/' + m + '/' + d;
            let coupon_amt = keepDecimalFull(item.coupon_amt, 0).toString();
            item.coupon_amt = coupon_amt.replace('.', '');
            return item;
        })
    },

    // 未使用样式修改 TODO
    dealUnUsedStyle() {
        let unUsedStyleObj = {
                type: 1,
                money_icon: PreferenceMoney,
                car_icon: PreferenceCar,
                pull_icon: PerferPull,
                finish_icon: PerferUsed,
                prefer_qrcode: PerferQrcode,
                // showRules: false, //是否展示使用规则 
                titleColor: `color:#333`,
                contentColor: `color:#333`,
                moneyStyle: `text-shadow:6px 6px 12px #B34E23;`,
                borderRadius: `border-bottom-left-radius: 8rpx;`,
                background: `background:linear-gradient(to bottom right, ${'#FFC854'}, ${'#B34E23'});`,
                backgroundG: `background:linear-gradient(to bottom right, ${'#44B291'}, ${'#164D3F'});`,
                backgroundB: `background:linear-gradient(to bottom right, ${'#5BC7FF'}, ${'#074DB4'});`,
                backgroundY: `background:linear-gradient(to bottom right, ${'#FFC854'}, ${'#B34E23'});`,
                backgroundGray: `background:linear-gradient(to bottom right, ${'#999'}, ${'#333'});`,
                finish_icon: PerferLose,
            };
        this.setData({
            unUsedStyleObj: unUsedStyleObj
        })
    },
    // 分享 TODO
    onShareAppMessage(options) {
        console.log("longting", JSON.stringify(options))
        var that = this;
        var shareObj = {
            title: "ETC加油助手",
            desc: "送你一张洗车券",
            path: 'pages/home/donate/index/index',
            //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            imageUrl: 'https://oss.etcsd.com/object/a7d73297c8ac4ee4baed1c1cd9736f1e',
            success(res) {
                // 转发成功之后的回调
                // if (res.errMsg == 'shareAppMessage:ok') {}
                console.log(JSON.stringify(res))
            },
            fail(res) {
                console.log(JSON.stringify(res))
                // // 转发失败之后的回调
                // if (res.errMsg == 'shareAppMessage:fail cancel') {
                //     // 用户取消转发
                // } else if (res.errMsg == 'shareAppMessage:fail') {
                //     // 转发失败，其中 detail message 为详细失败信息
                // }
            },
        };
        // 来自页面内的按钮的转发
        if (options.from == 'button') {
            var target = options.target.dataset;
            console.log(target.item); // shareBtn
            // 此处可以修改 shareObj 中的内容
            shareObj.path = 'pages/home/index/index?item=' + target.item;
        }
        return shareObj;

    },
})