// pages/stations/search/search.js
import { getLocation } from '../../../utils/location';
import { oils, sort, brands, oil_filter_tabs } from '../constants';
import { stationsApi } from '../../../http/api';
import { getHttpPost } from '../../../http/http';
import { keepDecimalFull, trim } from '../../../utils/util';
import {OPENID} from '../../../constants/global';
import { showLoading, hideLoading, showToast } from "../../../utils/my";
const app = getApp();
let navigationBarHeight;
const tabHeight = 84;
const tabs_oil = oil_filter_tabs;
let page_num_oil = 1;
const page_size_oil = 15;
let locations = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        search: "", //搜索内容
        center_lng: 117.12009, //默认经度
        center_lat: 36.65184, //默认纬度
        oil_type_name: oils[0].id, //加油 油品类型
        oil_sort_class: sort[0].id, //加油 1-距离，2-油价
        oil_brand: brands[0].id, //加油 品牌
        tabs_oil: tabs_oil, //筛选条件
        station_list: null, //油站列表
        load_status_oil: 0, //油站上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
        refresher_oil: false, //加油下拉刷新状态
        oil_status: 0, //1:油站列表为空 2:网络连接失败 
        tab_height: tabHeight,
        openid: "",
        drop_down_height: "",
        scroll_height: "",
        tab_list_top: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('search onLoad')
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
    },
    // 样式处理
    dealStyleData() {
        navigationBarHeight = app.globalData.navigationBarHeight
        this.setData({
            drop_down_height: `calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx)`,
            scroll_height: `calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx - 20rpx)`,
            tab_list_top: `calc(${navigationBarHeight}px + ${tabHeight}rpx)`
        })
    },

    onShow() {
        console.log('search onShow')
        const openid = my.getStorageSync({
            key: OPENID
        }).data;
        this.setData({
            openid: openid
        });
    },

    //搜索
    onSearch(key) {
        if (trim(key)) {
            this.setData({
                search: key
            })
            this.getStations();
        }
    },

    //筛选条件
    onOilSelectClick(data) {
        const {
            search
        } = this.data;
        this.setData({
            oil_type_name: data[0],
            oil_sort_class: data[1],
            oil_brand: data[2],
            station_list: null
        });
        if (search) {
            //重置页码
            page_num_oil = 1;
            this.getStations();
        }
    },

    //网络连接失败 重新加载
    onRetryClick() {
        page_num_oil = 1;
        this.getStations();
    },

    //油站item点击
    onStationClick(item) {
        this.setData({
            openid: my.getStorageSync({
                key: OPENID
            }).data
        });
        const {
            oil_type_name
        } = this.data;
        item.current_oil_no = oil_type_name;
        const params = encodeURIComponent(JSON.stringify(item));
        my.navigateTo({
            url: `/pages/stations/details/details?params=${params}`
        });
    },

    //立即加油
    onPayClick(station) {
        const {
            oil_type_name
        } = this.data;
        this.setData({
            openid: my.getStorageSync({
                key: OPENID
            }).data
        });
        const supports = station.support_payments;
        station.current_oil_no = oil_type_name;
        let details = encodeURIComponent(JSON.stringify(station));
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

    //导航
    onNavigationClick(e) {
        const item = e.currentTarget.dataset.item;
        my.openLocation({
            latitude: item.latitude_tx,
            longitude: item.longitude_tx,
            name: item.name,
            address: item.address
        });
    },

    //下拉刷新
    onOilRefresh() {
        page_num_oil = 1;
        this.getStations();
    },

    //上拉加载更多
    onOilLoadMore() {
        page_num_oil++;
        this.setData({
            load_status_oil: 1
        })
        this.getStations();
    },


    //加油油站查询
    getStations() {
        const {
            center_lng,
            center_lat,
            oil_type_name,
            oil_sort_class,
            oil_brand,
            search
        } = this.data;
        const params = {
            page_num: page_num_oil,
            page_size: page_size_oil,
            center_lng: center_lng,
            center_lat: center_lat,
            oil_type_name: oil_type_name,
            sort_class: oil_sort_class,
            station_name: search,
            gasoline_brand: oil_brand || null,
            source: "WXAPPLET"
        }
        page_num_oil == 1 && this.data.station_list == null ? showLoading("正在加载...") : "";
        getHttpPost(stationsApi.list, params, res => {
            hideLoading();
            const data = this.dealResponse(res.data);
            const list = page_num_oil == 1 ? data : this.data.station_list.concat(data);
            this.setData({
                station_list: list,
                refresher_oil: false,
                load_status_oil: data && data.length && data.length < page_size_oil ? 2 : 0,
                oil_status: list && list.length ? 0 : 1
            });
        }, err => {
            hideLoading();
            showToast(err.msg);
            let oil_status = this.data.station_list == null && err.code == 10 ? 2 : 0;
            this.setData({
                refresher_oil: false,
                oil_status: oil_status,
                load_status_oil: err.code == 10 ? 0 : this.data.load_status_oil
            })
        });
    },

    /**
     * 数据处理
     */
    dealResponse(data) {
        return data && data.map(item => {
            item.latitude_tx = Number(item.latitude_tx);
            item.longitude_tx = Number(item.longitude_tx);
            item.distance = keepDecimalFull(item.distance, 1);
            item.station_price = item.station_price && item.station_price.map(price => {
                price.xl_price = keepDecimalFull(price.xl_price, 2);
                price.list_price = price.list_price || price.gb_price || '';
                price.list_price = price.list_price ? keepDecimalFull(price.list_price, 2) : '';
                price.gb_price = keepDecimalFull(price.gb_price, 2);
                price.oil_price_difference = price.oil_price_difference > 0 ? keepDecimalFull(price.oil_price_difference, 2) : "";
                return price;
            });
            let currentObj = item.current_station_price;
            if (currentObj) {
                currentObj.xl_price = keepDecimalFull(currentObj.xl_price, 2);
                currentObj.list_price = currentObj.list_price || currentObj.gb_price || '';
                currentObj.list_price = currentObj.list_price ? keepDecimalFull(currentObj.list_price, 2) : '';
                currentObj.gb_price = keepDecimalFull(currentObj.gb_price, 2);
                currentObj.oil_price_difference = currentObj.oil_price_difference > 0 ? keepDecimalFull(currentObj.oil_price_difference, 2) : '';
            }
            item.no_sence = item.support_payments && item.support_payments.includes("ETC_NO_SENSE");
            return item;
        });
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '',
            path: ''
        }
    }
})