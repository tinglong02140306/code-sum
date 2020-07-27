// pages/stations/clean/park-confirm/park-confirm.js
import { OPENID, CODE_WASHER, STATIONPAGE} from "../../../../constants/global";
import { getHttpPost } from "../../../../http/http";
import { cleanApi } from "../../../../http/api";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
import { getLocation } from "../../../../utils/location";


let params = null;
const app = getApp();
let locations = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: false,
        openid: '',
        washer_id: 19, //洗车机ID
        details: null,
        center_lng: null,
        center_lat: null,
        isFistShow: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.dealStyleData();
        //获取当前位置的经纬度信息
        getLocation(true, location => {
            this.setData({
                center_lng: location.longitude,
                center_lat: location.latitude,
            });
        }, err => {
            showToast(err);
        });
        try {
            if (my.getStorageSync({ key : CODE_WASHER }).data) {
                if(options.params) {
                    params = JSON.parse(decodeURIComponent(options.params));
                    this.setData({
                        details: params,
                        washer_id: params.washer_id
                    });
                } else {
                    let washId = my.getStorageSync({ key : 'WASHID' }).data
                    if(washId) {
                        this.setData({
                            washer_id: washId
                        });
                    } else {
                        showToast('二维码无效');
                    }
                }
            } else {
                params = JSON.parse(decodeURIComponent(options.params));
                this.setData({
                    details: params,
                    washer_id: params.washer_id
                });
            }
        } catch (error) {
            console.log(error)
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },

    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            openid: my.getStorageSync({ key : OPENID }).data
        });
        setTimeout(()=> {
            this.setData({
                isFistShow: true
            });
            this.modalSuperFirst.fadeIn();
        })
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },
    modalSuperRefFirst(ref) {
        this.modalSuperFirst = ref;
    },
    //首次进入
    onHideFirst() {
        this.setData({
            isFistShow: false
        });
        this.modalSuperFirst.fadeOut();
    },
    //停车确认完毕
    onConfirmClick() {
        const openid = my.getStorageSync({ key : OPENID }).data
        this.setData({
            openid: openid
        });
        if(!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return;
        }
        // 扫码进入
        if (my.getStorageSync({ key : CODE_WASHER }).data) {
            this.onCleanClick();
        } else {
            this.getOrder();
        }
    },

    //检查用户在该洗车点的订单信息
    getOrder() {
        console.log('洗车点的订单信息')
        this.setData({
            openid: my.getStorageSync({ key : OPENID }).data
        });
        const { washer_id } = this.data;
        const paramsData = { washer_id: washer_id }
        getHttpPost(cleanApi.getOrder, paramsData, res => {
            if (res.result_code === "00000") {
                if (res.order_status === '1') {
                    //支付成功=>启动洗车机
                    const resData = {
                        washer_id: paramsData.washer_id,
                        order_no: res.order_no,
                        // start_time:res.start_time,
                    }
                    const details = encodeURIComponent(JSON.stringify(resData));
                    my.navigateTo({
                        url: `/pages/stations/clean/clean-notice/clean-notice?params=${details}`
                    });
                } else if (res.order_status === '2') {
                    //消费成功=>洗车中
                    const resData = {
                        washer_id: paramsData.washer_id,
                        order_no: res.order_no,
                        start_time: res.start_time,
                    }
                    const details = encodeURIComponent(JSON.stringify(resData));
                    my.navigateTo({
                        url: `/pages/stations/clean/clean-doing/clean-doing?params=${details}`
                    });
                } else {
                    //继续执行
                    this.onCleanCheck();
                }
            }
        }, err => {
            showToast(err.msg);
        });
    },

    //检查洗车机状态
    onCleanCheck() {
        console.log('检查洗车机状态')
        showLoading("检查洗车机状态中...")
        this.setData({
            openid: my.getStorageSync({ key : OPENID }).data
        });
        const { washer_id } = this.data;
        const paramsData = {
            washer_id: washer_id,
        }
        getHttpPost(cleanApi.check, paramsData, res => {
            hideLoading();
            console.log('洗车机状态' + res.washer_status)
            if (res.washer_status == '1') {
                showToast("车辆未停好");
            } else if (res.washer_status == '2') {
                showToast("洗车机正忙");
            } else if (res.washer_status == '3') {
                showToast("洗车机维护中");
            } else {
                this.createOrder();
            }
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    //创建订单
    createOrder() {
        console.log('提交订单')
        showLoading("提交订单...");
        const { washer_id } = this.data;
        const paramsData = { washer_id: washer_id };
        getHttpPost(cleanApi.createOrder, paramsData, res => {
            hideLoading();
            if (res.result_code === "00000") {
                const resData = {
                    washer_id: washer_id,
                    order_no: res.order_no,
                    station_name: res.station_name,
                    order_amount: res.order_amount,
                    wash_coupon_count: res.wash_coupon_count,
                }
                my.setStorageSync({key: CODE_WASHER, data: false});
                const params = encodeURIComponent(JSON.stringify(resData));
                my.navigateTo({
                    url: `/pages/stations/clean/clean-order/clean-order?params=${params}`
                });
            } else {
                hideLoading();
                showToast(res.msg);
            }
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    //检查洗车机距离
    onCleanClick() {
        console.log('检查洗车机距离')
        const { washer_id, center_lng, center_lat } = this.data;
        const paramsData = {
            washer_id: washer_id,
            center_lng: center_lng,
            center_lat: center_lat,
        };
        getHttpPost(cleanApi.distance, paramsData, res => {
            hideLoading();
            this.getOrder();
        }, err => {
            hideLoading();
            showToast(err.msg);
            my.setStorageSync({key:STATIONPAGE, data:0});
            my.switchTab({
                url: `/pages/stations/index/index`
            })
        });
    },
})