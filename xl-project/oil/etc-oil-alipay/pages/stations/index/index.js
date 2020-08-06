// pages/stations/index/index.js
import { getLocation } from '../../../utils/location';
import { stationsApi, cleanApi} from '../../../http/api';
import { getHttpPost, getPostPromise } from '../../../http/http';
import { oils, sort, brands, clean_sort, clean_enable, clean_status, oil_filter_tabs, clear_filter_tabs } from '../constants';
import { keepDecimalFull } from '../../../utils/util';
import { showLoading, hideLoading, showToast } from "../../../utils/my";
import { StationToMap } from '../../../assets/url/url.js';
import { OPENID, STATIONPAGE} from '../../../constants/global';
const app = getApp();
let locations = null;
let page_num_oil = 1;
const page_size_oil = 15;
let page_num_clean = 1;
const page_size_clean = 15;
const tabHeight = 84;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        center_lng: 117.12009, //默认经度
        center_lat: 36.65184, //默认纬度
        oil_type_name: oils[0].id, //加油 油品类型
        oil_sort_class: sort[0].id, //加油 1-距离，2-油价
        oil_brand: brands[0].id, //加油 品牌
        clean_sort_class: clean_sort[0].id, //洗车 1-距离，2-价格
        clean_enable: clean_enable[0].id, //洗车 1-全部 2-可停车
        clean_status: clean_status[0].id, //洗车 1-空闲，2-使用中
        station_list: null, //油站列表
        clean_list: null, //洗车列表
        tabs_oil: oil_filter_tabs, //加油筛选条件
        tabs_clean: clear_filter_tabs, //洗车筛选条件
        load_status_oil: 0, //刷新控件 油站上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
        load_status_clean: 0, //刷新控件 洗车上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
        load_page_oil: 0, //页面加载状态 1:加载中 2:加载完成
        refresher_oil: false, //加油下拉刷新状态
        refresher_clean: false, //洗车下拉刷新状态
        oil_status: 0, //1:油站列表为空 2:网络连接失败 
        clean_status: 0, //1:洗车列表为空 2:网络连接失败 
        page_type: 0, //0:洗车  1:加油 
        bar_list: ["洗车","加油"],
        tab_height: tabHeight,
        icon_station_to_map: StationToMap,
        openid: "",
        drop_down_height: '',
        scroll_height: '',
        tab_list_top: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('stations onLoad')
        this.dealHeightStyle();
        this.getLocationInfo();
    },
    onShow() {
        console.log('stations onShow')
        hideLoading();
        this.setData({
            openid: my.getStorageSync({ key: OPENID }).data
        });
        this.getList();
    },
    getList() {
        let page = my.getStorageSync({key: STATIONPAGE}).data || 0;
        this.setData({
            page_type: page
        })
        if (page == 0 && this.data.clean_list == null) {
            this.setData({
                load_page_clean: 1
            });
            this.getCleanList();
        } else if(page == 1 && this.data.station_list == null){
            this.setData({
                load_page_oil: 1
            });
            this.getStations();
        }
    },
    getLocationInfo() {
        //获取当前位置的经纬度信息
        getLocation(true, location => {
            this.setData({
                center_lng: location.longitude,
                center_lat: location.latitude,
            });
            this.getList();
        }, err => {
            showToast(err);
            this.getStations();
        }); 

    },
    // 子组件高度 样式数据处理
    dealHeightStyle() {
        // 自定义标题栏样式处理
        const {
            navigationBarHeight
        } = app.globalData;
        this.setData({
            drop_down_height: `calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx)`,
            scroll_height: `calc(100vh - ${navigationBarHeight}px - ${tabHeight}rpx - 20rpx)`,
            tab_list_top: `calc(${navigationBarHeight}px + ${tabHeight}rpx)`,
        });
    },

    //0:洗车  1:加油 
    onMenuClick(index) {
        my.setStorageSync({key:STATIONPAGE, data: index});
        this.setData({
            page_type: index
        });
        if (index == 0 && !this.data.clean_list) {
            this.getCleanList();
        } else if(index == 1 && !this.data.station_list) {
            this.getStations();
        }
    },
    stationBarRef(ref) {
        this.stationRef = ref;
    },

    //加油筛选条件
    onOilSelectClick(data) {
        this.setData({
            oil_type_name: data[0],
            oil_sort_class: data[1],
            oil_brand: data[2],
            station_list: null,
            load_page_oil: 1
        });
        //重置页码
        page_num_oil = 1;
        this.getStations();
    },

    //洗车筛选条件
    onCleanSelectClick(data) {
        this.setData({
            clean_sort_class:data[0],
            able_parking:data[1],
            washer_status:data[2],
            clean_list:null
        });
        page_num_clean = 1;
        this.getCleanList();
    },

    //搜索
    onSearchClick() {
        my.navigateTo({
            url: "/pages/stations/search/search"
        });
    },
    //地图模式
    onMapClick() {
        const {
            oil_type_name,
            oil_brand,
            page_type
        } = this.data;
        const filter = {
            oil_type: oil_type_name,
            oil_brand: oil_brand,
            page_type: page_type,
        }
        const params = encodeURIComponent(JSON.stringify(filter));
        my.navigateTo({
            url: `/pages/stations/map/map?params=${params}`
        });
    },

    //网络连接失败 重新加载
    onRetryClick() {
        const {
            page_type
        } = this.data;
        if (page_type == 1) {
            page_num_oil = 1;
            this.getStations();
        } else {
            page_num_clean = 1;
            this.getCleanList();
        }
    },

    //油站item点击
    onStationClick(item) {
        const openid = my.getStorageSync({ key: OPENID}).data;
        this.setData({
            openid: openid
        });
        if (!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return;
        }
        const { oil_type_name } = this.data;
        item.current_oil_no = oil_type_name;
        const params = encodeURIComponent(JSON.stringify(item));
        my.navigateTo({
            url: `/pages/stations/details/details?params=${params}`
        });
    },

    //洗车item点击
    onCleanClick(e) {
        const openid = my.getStorageSync({ key: OPENID}).data;
        this.setData({
            openid: openid
        });
        if (!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return;
        }
        const item = e.currentTarget.dataset.item;
        const params = encodeURIComponent(JSON.stringify(item));
        my.navigateTo({
            url: `/pages/stations/clean/clean-details/clean-details?params=${params}`
        });
    },

    //立即加油
    onPayClick(station) {
        const { oil_type_name } = this.data;
        const openid = my.getStorageSync({
            key: OPENID
        }).data;
        this.setData({
            openid: openid
        });
        if (!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return;
        }
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
    //立即洗车
    toCleanClick(e) {
        const openid = my.getStorageSync({ key: OPENID }).data;
        this.setData({
            openid: openid
        });
        if (!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return;
        }
       
        const item = e.currentTarget.dataset.item;
        this.onCleanCheck(item);
    },

    //导航
    onNavigationClick(item) {
        // const item = e.currentTarget.dataset.item;
        my.openLocation({
            latitude: item.latitude_tx,
            longitude: item.longitude_tx,
            name: item.name,
            address: item.address
        });
    },

    //加油下拉刷新
    onOilRefresh() {
        page_num_oil = 1;
        this.getStations();
    },

    //加油上拉加载更多
    onOilLoadMore() {
        page_num_oil++;
        this.setData({
            load_status_oil: 1
        })
        this.getStations();
    },

    //洗车下拉刷新
    onCleanRefresh() {
        page_num_clean = 1;
        this.getCleanList();
    },

    //洗车上拉加载更多
    onCleanLoadMore() {
        page_num_clean++;
        this.setData({
            load_status_clean: 1
        });
        this.getCleanList();
    },

    //加油油站查询
    getStations() {
        const { center_lng, center_lat, oil_type_name, oil_sort_class, oil_brand } = this.data;
        const params = {
            page_num: page_num_oil,
            page_size: page_size_oil,
            center_lng: center_lng,
            center_lat: center_lat,
            oil_type_name: oil_type_name,
            sort_class: oil_sort_class,
            gasoline_brand: oil_brand || null,
            source: "WXAPPLET"
        }
        page_num_oil == 1 && this.data.station_list == null ? showLoading("正在加载...") : "";
        getHttpPost(stationsApi.list, params, res => {
            my.stopPullDownRefresh();
            console.log(`加油油站查询end:${new Date()}`);
            hideLoading();
            const data = this.dealResponse(res.data);
            let list = page_num_oil == 1 ? data : this.data.station_list.concat(data);
            this.setData({
                station_list: list,
                refresher_oil: false,
                load_status_oil: data && data.length && data.length < page_size_oil ? 2 : 0,
                oil_status: list && list.length ? 0 : 1,
                load_page_oil: 2
            });
        }, err => {
            my.stopPullDownRefresh();
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

    //洗车查询 功能暂未开通
    getCleanList() {
        const { center_lng, center_lat, washer_status, able_parking } = this.data;
        const params = {
            page_num: page_num_clean,
            page_size: page_size_clean,
            center_lng: center_lng,
            center_lat: center_lat,
            washer_status: washer_status,
            able_parking: able_parking,
        }
        page_num_clean == 1 && this.data.clean_list == null ? showLoading("正在加载...") : "";
        getHttpPost(cleanApi.list, params, res => {
            my.stopPullDownRefresh();
            hideLoading();
            const data = this.dealCleanResponse(res.data);
            let list = page_num_clean == 1 ? data : this.data.clean_list.concat(data);

            
            this.setData({
                clean_list: list,
                refresher_clean: false,
                load_status_clean: data && data.length && data.length < page_size_clean ? 2 : 0,
                clean_status: list && list.length ? 0 : 1,
                load_page_clean: 2
            });
        }, err => {
            my.stopPullDownRefresh();
            hideLoading();
            my.showToast(err.msg);
            let clean_status = this.data.clean_list == null && err.code == 10 ? 2 : 0;
            this.setData({
                refresher_clean: false,
                clean_status: clean_status,
                load_page_clean: err.code == 10 ? 0 : this.data.load_page_clean
            })
        });
    },
    /**
     * 数据处理
     */
    dealCleanResponse: function (data) {
        return data && data.map(item => {
            item.latitude_tx = Number(item.latitude_tx);
            item.longitude_tx = Number(item.longitude_tx);
            item.distance_meter = keepDecimalFull(item.distance_meter, 1);
            item.washer_price = keepDecimalFull(item.washer_price, 0).replace('.', '');
            if(item.hours_begin && item.hours_end) {
                item.time = item.hours_begin.substr(0,2) < 1 && item.hours_end.substr(0,2) > 22 ? "24小时营业" : item.hours_begin + "-" + item.hours_end;
            }
            return item;
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
        })
    },
    onPullDownRefresh() {
        this.getLocationInfo(() => {
            let pageType = my.getStorageSync({key:STATIONPAGE}).data;
            showLoading("正在加载...")
            if(pageType == 0) {
                this.onOilRefresh();
            } else {
                this.onCleanRefresh();
            }
        })
    },
    onRefreshClick() {
        this.getLocationInfo(() => {
            showLoading("正在加载...")
            this.onCleanRefresh();
        })
    },
    //立即洗车=>检查洗车机距离
    onCleanCheck(item) {
        showLoading('请稍候...')
        this.setData({
            openid: my.getStorageSync({key:OPENID}).data
        });
        const { center_lng, center_lat } = this.data;
        const paramsData = {
            washer_id: item.washer_id,
            center_lng: center_lng,
            center_lat: center_lat,
        }
        getHttpPost(cleanApi.distance, paramsData, res => {
            hideLoading();
            if (res.result_code === "00000") {
                const details = encodeURIComponent(JSON.stringify(item));
                my.navigateTo({
                    url: `/pages/stations/clean/park-confirm/park-confirm?params=${details}`
                });
            }
        }, err => {
            hideLoading();
            showToast(err.msg);
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