// pages/mine/ticket-buy/details/details.js
import { getHttpPost } from "../../../../http/http";
import { cleanApi, couponPackageApi } from "../../../../http/api";
import { getLocation } from "../../../../utils/location";
import { OPENID, STATIONPAGE } from "../../../../constants/global";
import { keepDecimalFull } from '../../../../utils/util';
import { showLoading, hideLoading, showToast } from '../../../../utils/my';
const app = getApp();
let timer = null;
let params = null;
let locations = null;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEmptyList: false,
        amount: 0,
        details: {},
        clean_list: [],
        clean_data: {},
        center_lng: 117.12009, //默认经度
        center_lat: 36.65184, //默认纬度
    },

    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取当前位置的经纬度信息
        getLocation(true, location => {
            this.setData({
                center_lng: location.longitude,
                center_lat: location.latitude,
            });
            this.getCleanList();
        }, err => {
            showToast(err);
            this.getCleanList();
        });

        try {
            params = JSON.parse(decodeURIComponent(options.details));
            this.setData({
                details: params
            });
        } catch (error) {
            console.log(error)
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },

    onShow() {
        this.setData({
            openid: my.getStorageSync({ key: OPENID }).data
        });
    },
    onHide() {
        timer && clearTimeout(timer);
    },
    //全部洗车站点
    onAllClick() {
        my.setStorageSync({ key: STATIONPAGE, data: 1 });
        my.switchTab({
            url: '/pages/stations/index/index'
        });
    },

    //洗车机详情
    onDetailsClick() {
        const {
            clean_data
        } = this.data;
        const details = encodeURIComponent(JSON.stringify(clean_data));
        my.navigateTo({
            url: `/pages/stations/clean/clean-details/clean-details?params=${details}`
        });
    },

    //导航
    onNavigateClick() {
        const {
            clean_data
        } = this.data;
        my.openLocation({
            latitude: clean_data.lat_tx,
            longitude: clean_data.lng_tx,
            name: clean_data.washer_name,
            address: clean_data.washer_address
        });
    },

    //购买
    onSubmitClick() {
        const {
            details
        } = this.data;
        showLoading("请稍候...");
        const params = {
            package_id: details.package_id,
            wash_order_no: null,
        };
        getHttpPost(couponPackageApi.order, params, response => {
            hideLoading();
            this.goPay(response.pay_params)
        }, err => {
            hideLoading();
            showToast(`${err.msg}:${err.code}`);
        });
    },

    //调起支付 
    goPay(tradeNO) {
        try {
            my.tradePay({
                tradeNO: tradeNO,
                success(res) {
                    my.navigateBack();
                },
                fail(err) {
                }
            })
        } catch (err) {
            showToast("参数格式错误");
        }
    },

    //洗车查询
    getCleanList() {
        const {
            center_lng,
            center_lat
        } = this.data;
        const params = {
            page_num: 1,
            page_size: 1,
            center_lng: center_lng,
            center_lat: center_lat,
            washer_status: null,
            able_parking: null,
        }
        showLoading("正在加载...")
        getHttpPost(cleanApi.list, params, res => {
            hideLoading();
            this.dealNearCleanInfo(res.data && res.data[0]);
            this.setData({
                amount: res.amount,
                isEmptyList: res.data && res.data.length ? false : true,
            });
        }, err => {
            hideLoading();
            showToast(err.msg);
            this.setData({
                isEmptyList: true,
            })
        });
    },

    //处理最近洗车机数据
    dealNearCleanInfo(near) {
        if (near) {
            near.distance_meter = keepDecimalFull(near.distance_meter, 1);
            near.washer_price = keepDecimalFull(near.washer_price, 0).replace('.', '');
        }
        this.setData({
            clean_list: near,
            clean_data: near,
        });
    },
})