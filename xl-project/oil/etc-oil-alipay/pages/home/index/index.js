// pages/home/index/index.js
var AES = require('../../../utils/encrypt/aes-util');
import { weather } from '../../../constants/weather';
import { getLocation } from '../../../utils/location';
import { homeApi, cleanApi, test } from '../../../http/api';
import { getHttpPost, getPostPromise } from '../../../http/http';
import { keepDecimalFull, checkUrl } from '../../../utils/util';
import { showLoading, hideLoading, showToast} from '../../../utils/my';
import { StationPhotoDefault } from '../../../assets/url/url';
import { OPENID, WEATHER_INFO, WEATHER_TIME } from '../../../constants/global';
const app = getApp();
let locations = null;
let page_num_rights = 1;
let page_size_rights = 15;
let OIL_NO = "92#";
let flag = 0; //标志位 网络请求进度

Page({

    /**
     * 页面的初始数据
     */
    data: {
        city: "济南", //默认当前城市
        province: "山东省",
        area_code: '370100',
        center_lng: 117.12009, //默认经度
        center_lat: 36.65184, //默认纬度
        weathers: null, //天气状况
        gboilPrices: [], //国标油价
        gboilScroll: [], //用于视图展示的国标油价
        banners: [], //轮播图
        banner_current: 0,
        near: null, //最近的油站
        nearPrices: [], //最近的油站 所有油品及价格
        nearCurrent: null, //最近的油站 展示的价格
        nearOilType: OIL_NO, //最近的油站 展示的油品类型 默认值
        nearCurrentIndex: 0,
        rights: [], //权益
        load_status: 0, //刷新控件状态 0: 已加载完成 1:正在加载中 2:已加载全部
        refresher: false,
        loading: 0, //页面状态 1:正在加载... 2:加载完成 3:网络问题
        open_id: "",
        navigationBarHeight: app.globalData.navigationBarHeight,
        icon_default_station: StationPhotoDefault
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('home onLoad')
        this.getLocationInfo();
    },

    onShow() {
        console.log('home onShow')
        hideLoading();
        this.setData({
            open_id: my.getStorageSync({ key: OPENID }).data
        });
    },

    //获取当前的位置信息
    getLocationInfo() {
        getLocation(true, location => {
            this.setData({
                city: location.city,
                area_code: location.area_code,
                center_lng: location.longitude,
                center_lat: location.latitude,
                province: location.province
            });
            app.globalData.location = location;
            this.setData({
                loading: 1
            });
            this.getAllInfo();
        }, err => {
            showToast(err);
        });
    },
    onPullDownRefresh() {
        console.log('enter onPullDownRefresh')
        this.getLocationInfo();
    },

    //油价提醒
    onRemindClick() {
        // 支付宝小程序没这个功能
        my.requestSubscribeMessage({
            tmplIds: ['zKGezbrE32Mgqv4EiT2j6wW2WY6afaE7_oLB2JI1qyc'],
            success: res => {
                console.log(res);
            },
            fail: err => {
                console.log(err);
            }
        })
    },

    //轮播图点击事件
    onBannerItemClick(e) {
        const {
            target_url
        } = e.currentTarget.dataset.item;
        const tabUrl = ['/pages/stations/index/index', '/pages/mine/index/index'];
        if (target_url) {
            if (!checkUrl(target_url)) { //本地路径
                if (tabUrl.indexOf(target_url) != -1) {
                    my.switchTab({
                        url: target_url
                    });
                } else {
                    my.navigateTo({
                        url: target_url
                    })
                }
            }
        }
    },

    //banner滚动监听
    onBannersChange(e) {
        this.setData({
            banner_current: e.detail.current
        });
    },

    //改变油品类型
    onOilNoChange(e) {
        const {
            value
        } = e.detail;
        const {
            nearPrices
        } = this.data;
        if (nearPrices && nearPrices.length) {
            this.setData({
                nearCurrent: nearPrices[value],
                nearCurrentIndex: value,
                nearOilType: nearPrices[value] && nearPrices[value].oil_no
            });
        }
    },

    //选择油品类型时 拦截事件 
    onOilNoPicker() {},
    dealLogin() {
        const openid = my.getStorageSync({ key: OPENID }).data;
        this.setData({
            open_id: openid
        });
        if (!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return false;
        } else {
            return true;
        }
    },

    //油站详情
    onOilDetailClick() {
        const {
            near,
            nearOilType
        } = this.data;
        near.current_oil_no = nearOilType;
        const openid = my.getStorageSync({ key: OPENID }).data;
        if (!this.dealLogin()) return;
        const params = encodeURIComponent(JSON.stringify(near));
        my.navigateTo({
            url: `/pages/stations/details/details?params=${params}`
        });
    },
    //立即加油
    onOilClick() {
        const {
            near,
            nearOilType
        } = this.data;
        const supports = near.support_payments;

        if (!this.dealLogin()) return;

        near.current_oil_no = nearOilType;
        let details = encodeURIComponent(JSON.stringify(near));
        if (supports && supports.includes("ONE_KEY")) { //支持一键加油
            my.navigateTo({
                url: `/pages/stations/fast-oil/fast-oil?details=${details}`
            });
        } else { //二维码加油
            my.navigateTo({
                url: `/pages/stations/qrcode/qrcode?params=${details}`
            });
        }

    },

    //洗车机详情
    onCleanDetailClick() {
        const {
            nearClean
        } = this.data;
        const openid = my.getStorageSync({ key: OPENID }).data;
        if (!this.dealLogin()) return;
        const details = encodeURIComponent(JSON.stringify(nearClean));
        my.navigateTo({
            url: `/pages/stations/clean/clean-details/clean-details?params=${details}`
        });
    },
    //立即洗车
    onCleanClick() {
        if (!this.dealLogin()) return;
        this.onCleanCheck();
    },

    //权益 银行优惠 item点击
    onRightItemClick(e) {
        const item = e.currentTarget.dataset.item;
        if (!this.dealLogin()) return;
        let url = item.sub_activity_url; //子活动页面url
        const params = encodeURIComponent(JSON.stringify(item));
        if (url) {
            my.navigateTo({
                url: `/pages/home/rights/rights?params=${params}`
            })
        } else { //活动暂未上线
            showToast("活动即将上线,敬请期待");
        }
    },
    //获取国标油价
    getGboilPrice(province_name, area_code) {
        const params = {
            province_name: province_name,
            area_code: area_code
        }
        console.log('getGboilPrice:::params',JSON.stringify(params))
        getPostPromise(homeApi.gboilprice, params).then(res => {
            flag++;
            this.dealStatus()
            let array = [];
            const length = Math.ceil(res.data.length / 2);
            for (let i = 0; i < length; i++) {
                const item = res.data.slice(i * 2, i * 2 + 2);
                array.push(item);
            }
            this.setData({
                gboilScroll: array
            });
        }).catch(err => {
            flag++;
            this.dealStatus()
            console.log(err);
        });
    },

    //获取当前城市天气信息
    getWeatherInfo(city) {
        let weatherStr = my.getStorageSync({
            key: WEATHER_INFO
        }).data;
        let preTime = my.getStorageSync({
            key: WEATHER_TIME
        }).data || 0;
        let currentTime = new Date().getTime();
        let diff = currentTime - parseFloat(preTime);
        let hours = Math.floor(diff / (3600 * 1000));
        if (hours > 1) { //时间间隔大于1小时 再次请求天气
            console.log("时间间隔大于1小时");
            getPostPromise(homeApi.weather, {
                city_name: city
            }).then(res => {
                res.sd = res.sd && res.sd.substring(0, res.sd.length - 1);
                res.color = res.wash_car_index=='适宜'?"#00A170":res.wash_car_index=='较适宜'?"#88D600":res.wash_car_index=='较不宜'?"#F59F00":res.wash_car_index=='较不适宜'?"#F59F00":res.wash_car_index=='不适宜'?"#FF5311":res.wash_car_index=='不宜'?"#FF0000":"#88D600";
                // res.color = res.sd < 20 ? "#00A170" : res.sd < 40 ? "#88D600" : res.sd < 60 ? "#F59F00" : res.sd < 80 ? "#FF5311" : "#FF0000";
                flag++;
                this.dealStatus();
                this.setData({
                    weathers: res
                });
                my.setStorageSync({
                    key: WEATHER_INFO,
                    data: {
                        sd: res.sd,
                        temperature: res.temperature,
                        wash_car_index: res.wash_car_index
                    }
                });
                my.setStorageSync({
                    key: WEATHER_TIME,
                    data: currentTime
                });
            }).catch(err => {
                console.log(`${err.msg}:${err.code}`);
                flag++;
                this.dealStatus();
                this.setData({
                    weathers: weatherStr ? weatherStr : weather
                });
            });
        } else {
            flag++;
            this.dealStatus();
            this.setData({
                weathers: weatherStr ? weatherStr : weather
            });
        }
    },

    //获取轮播图
    getBanners(area_code) {
        const params = {
            area_code: area_code,
            purpose: "WXAPPLET"
        }
        getPostPromise(homeApi.banner, params).then(res => {
            flag++;
            this.dealStatus()
            this.setData({
                banners: res.data || []
            });
            console.log(res.data);
        }).catch(err => {
            flag++;
            this.dealStatus()
            console.log(err);
        });
    },

    //获取最近加油站
    getNearStation(center_lng, center_lat) {
        const params = {
            page_num: 1,
            page_size: 1,
            center_lng: center_lng,
            center_lat: center_lat,
            oil_type_name: OIL_NO,
            sort_class: 1,
            gasoline_brand: 'all',
            source: "WXAPPLET"
        }
        getPostPromise(homeApi.near, params).then(res => {
            this.dealNearInfo(res.data && res.data[0]);
            flag++;
            this.dealStatus()
        }).catch(err => {
            flag++;
            this.dealStatus()
            console.log(err);
            showToast(`${err.msg}:${err.code}`)
        });
    },
    //获取最近洗车机
    getNearClean(center_lng, center_lat) {
        const params = {
            page_num: 1,
            page_size: 1,
            center_lng: center_lng,
            center_lat: center_lat,
            washer_status: null,
            able_parking: null,
        }
        getPostPromise(cleanApi.list, params).then(res => {
            this.dealNearCleanInfo(res.data && res.data[0]);
            flag++;
            this.dealStatus()
        }).catch(err => {
            flag++;
            this.dealStatus()
            console.log(err);
            showToast(`${err.msg}:${err.code}`)
        });
    },

    //获取权益 银行优惠
    getRights(area_code) {
        const params = {
            page_num: page_num_rights,
            page_size: page_size_rights,
            area_code: area_code
        }
        getPostPromise(homeApi.rights, params).then(res => {
            flag++;
            this.dealStatus()
            this.setData({
                rights: res.data,
                load_status: res.data && res.data.length < page_size_rights ? 2 : 0
            });
            console.log('rights', this.data.rights)
        }).catch(err => {
            flag++;
            this.dealStatus()
            console.log(err);
        });
    },

    //获取推荐页面所有网络数据
    getAllInfo() {
        flag = 0;
        const {
            center_lng,
            center_lat,
            city,
            area_code,
            province
        } = this.data;
        showLoading("正在加载中...");
        this.getWeatherInfo(city);
        this.getGboilPrice(province, area_code);
        this.getNearStation(center_lng, center_lat);
        this.getNearClean(center_lng, center_lat);
        this.getBanners(area_code);
        // this.getRights(area_code);
    },
    //处理最近洗车机数据
    dealNearCleanInfo(near) {
        if (near) {
            near.distance_meter = keepDecimalFull(near.distance_meter, 1);
            near.washer_price = keepDecimalFull(near.washer_price, 0).replace('.', '');
            this.setData({
                nearClean: near,
            });
        }
    },

    //处理最近加油站的价格信息
    dealNearInfo(near) {
        if (near) {
            near.distance = keepDecimalFull(near.distance, 1);
            near.station_price = near.station_price && near.station_price.map(item => {
                item.xl_price = keepDecimalFull(item.xl_price, 2);
                item.list_price = item.list_price || item.gb_price || '';
                item.list_price = item.list_price ? keepDecimalFull(item.list_price, 2) : '';
                item.gb_price = keepDecimalFull(item.gb_price, 2);
                item.oil_price_difference = item.oil_price_difference > 0 ? keepDecimalFull(item.oil_price_difference, 2) : "";
                return item;
            });
            let currentObj = near.current_station_price;
            if (currentObj) {
                currentObj.xl_price = keepDecimalFull(currentObj.xl_price, 2);
                currentObj.list_price = currentObj.list_price || currentObj.gb_price || '';
                currentObj.list_price = currentObj.list_price ? keepDecimalFull(currentObj.list_price, 2) : '';
                currentObj.gb_price = keepDecimalFull(currentObj.gb_price, 2);
                currentObj.oil_price_difference = currentObj.oil_price_difference > 0 ? keepDecimalFull(currentObj.oil_price_difference, 2) : '';
                this.setData({
                    nearCurrent: currentObj,
                    nearCurrentIndex: this.getOilPrice(OIL_NO, near.station_price).index
                });
            }
            this.setData({
                near: near,
                nearPrices: near.station_price
            });
        }
    },

    //获取油品类型对应的价格及差价信息
    getOilPrice(oil_type, prices) {
        if (prices) {
            for (let i = 0; i < prices.length; i++) {
                const item = prices[i];
                if (item.oil_no == oil_type) {
                    item.index = i;
                    item.list_price = item.list_price || item.gb_price;
                    return item;
                }
            }
        }
        return "";
    },

    //下拉刷新
    onRefresh() {
        page_num_rights = 1;
        flag = 0;
        this.getAllInfo();
    },

    //加载更多 银行优惠信息
    onLoadMore() {
        // page_num_rights++;
        // this.setData({
        //     load_status: 1
        // });
        // this.getRights(this.data.area_code).then(res => {
        //     const list = this.data.rights.concat(res.data);
        //     this.setData({
        //         rights: list,
        //         load_status: list.length < page_size_rights ? 2 : 0
        //     });
        // }, err => {
        //     showToast(err.msg)
        //     this.setData({
        //         load_status: 0
        //     });
        // });
    },

    dealStatus() {
        if (flag == 5) {
            hideLoading();
            my.stopPullDownRefresh();
            this.setData({
                loading: 2,
                refresher: false
            });
        }
    },
    
    //立即洗车=》检查洗车机距离
    onCleanCheck() {
        showLoading("请稍候...")
        this.setData({
            openid: my.getStorageSync({ key: OPENID }).data
        });
        const { nearClean, center_lng, center_lat } = this.data;
        const paramsData = {
            washer_id: nearClean.washer_id,
            center_lng: center_lng,
            center_lat: center_lat,
        }
        getHttpPost(cleanApi.distance, paramsData, res => {
            hideLoading();
            if (res.result_code === "00000") {
                const details = encodeURIComponent(JSON.stringify(nearClean));
                my.navigateTo({
                    url: `/pages/stations/clean/park-confirm/park-confirm?params=${details}`
                });
            }
        }, err => {
            hideLoading();
            // this.setData({isShowFar:true,})
            showToast(err.msg)
        });
    },
    onShareAppMessage() {
        return {
            title: '',
            path: ''
        }
    },

    
})