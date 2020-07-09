// pages/stations/map/map.js
import { keepDecimalFull } from '../../../utils/util';
import { getLocation } from '../../../utils/location';
import { stationsApi, cleanApi } from '../../../http/api';
import { getHttpPost } from '../../../http/http';
import { OPENID } from '../../../constants/global';
import { MapSearch, MapToList, MapToLocation } from '../../../assets/url/url';
import { showLoading, hideLoading, showToast } from "../../../utils/my";
const app = getApp();
let map = null; //地图实例
let list = null; //
let list_clean = null; //
let marker_oil = []; //加油
let marker_clean = []; //洗车
let select_marker_oil = null; //加油 选中的marker
let select_marker_clean = null; //洗车 选中的marker
let oil_type_default = "92#"; //默认查询得油品类型
let oil_brand_default = "all"; //默认查询得油品品牌
let oil_brand_name_default = "全部品牌";
let locations = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page_type: 0, //0:加油 1:洗车
        scale: 14, //地图缩放级别
        center_lng: 117.12009, //默认经度
        center_lat: 36.65184, //默认纬度
        oil_type_name: '92#', //油品类型
        oil_sort_class: 1, //1-距离，2-油价
        oil_brand: '', //品牌
        oil_brand_name: "全部品牌",
        icon_search: MapSearch,
        icon_list: MapToList,
        icon_location: MapToLocation,
        markers: [], //地图中展示得marker集合
        select_marker: null, //选中得marker
        markers_clean: [], //地图中展示得marker集合----洗车
        select_marker_clean: null, //选中得marker-----洗车
        prefix: '920',
        map_height: "",
        isIphoneX: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 容器高度计算 处理
        this.dealViewheightStyle();
        map = my.createMapContext("map");
        try {
            let params = JSON.parse(decodeURIComponent(options.params));
            this.setData({
                page_type: params.page_type ? params.page_type : 0,
                oil_type_name: params.oil_type,
                oil_brand: params.oil_brand,
                oil_brand_name: params.oil_brand == 'all' ? '全部品牌' : params.oil_brand,
            });
            this.dealLocation();
        } catch (error) {
            this.setData({
                oil_type_name: oil_type_default,
                oil_brand: oil_brand_default,
                oil_brand_name: oil_brand_name_default,
            });
            this.dealLocation();
        }
    },
    /**
     *  容器高度、样式计算 处理
     */
    dealViewheightStyle() {
        let {
            navigationBarHeight,
            isIphoneX
        } = app.globalData;
        this.setData({
            map_height: `calc(100vh - ${navigationBarHeight}px)`,
            isIphoneX: isIphoneX
        });
    },

    //0:加油 1:洗车 2:停车
    onMenuClick(type) {
        if (type == 0) {
            if (list && list.length) {
                this.setData({
                    markers: type == 0 ? marker_oil : marker_clean,
                    select_marker: type == 0 ? select_marker_oil : select_marker_clean,
                })
            } else {
                this.getStations();
            }
        } else {
            if (list_clean && list_clean.length) {
                this.setData({
                    markers: type == 0 ? marker_oil : marker_clean,
                    select_marker: type == 0 ? select_marker_oil : select_marker_clean,
                })
            } else {
                this.getCleanList();
            }
        }
        this.setData({
            page_type: type,
            // markers:type==0?marker_oil:marker_clean,
            // select_marker:type==0?select_marker_oil:select_marker_clean,
        });
    },

    //搜索
    onSearchClick() {
        my.navigateTo({
            url: "/pages/stations/search/search"
        });
    },

    //查看列表模式
    onListClick() {
        my.navigateBack();
    },

    //条件筛选
    onFilterClick() {
        const {
            oil_type_name,
            oil_brand
        } = this.data;
        const params = {
            oil_type_name: oil_type_name,
            oil_brand: oil_brand
        }
        let _params = encodeURIComponent(JSON.stringify(params));
        my.navigateTo({
            url: `/pages/stations/filter/filter?params=${_params}`
        });
    },

    //移动到定位点
    onLocationClick() {
        const {
            center_lng,
            center_lat
        } = this.data;
        map && map.moveToLocation({
            longitude: center_lng,
            latitude: center_lat,
        });
        this.setData({
            scale: 14
        });
    },

    //视野发生变化时触发
    regionchange(e) {
        if (e.end == "end" && e.causedBy == "scale") {
            map && map.getScale({
                success: res => {
                    console.log(res.scale)
                    this.setData({
                        scale: res.scale
                    });
                }
            });
        }
    },

    //油站、洗车机详情
    onDetailClick() {
        const {
            page_type,
            oil_type_name
        } = this.data;
        if (page_type == 0) {
            select_marker_oil.current_oil_no = oil_type_name;
            const params = encodeURIComponent(JSON.stringify(select_marker_oil));
            my.navigateTo({
                url: `/pages/stations/details/details?params=${params}`
            });
        } else {
            const details = encodeURIComponent(JSON.stringify(select_marker_clean));
            my.navigateTo({
                url: `/pages/stations/clean/clean-details/clean-details?params=${details}`
            });
        }
    },
    //洗车机详情

    //立即加油
    onOilClick() {
        const supports = select_marker_oil.support_payments;
        let details = encodeURIComponent(JSON.stringify(select_marker_oil));
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
    onCleanClick() {
        this.onCleanCheck();
    },

    //导航
    onNavigationClick() {
        const {
            select_marker
        } = this.data;
        if (this.data.page_type == 1) {
            my.openLocation({
                latitude: select_marker_clean.lat_tx,
                longitude: select_marker_clean.lng_tx,
                name: select_marker_clean.washer_name,
                address: select_marker_clean.washer_address
            });
        } else {
            my.openLocation({
                latitude: select_marker.latitude_tx,
                longitude: select_marker.longitude_tx,
                name: select_marker.name,
                address: select_marker.address
            });
        }
    },
    tap(e) {},
    onCalloutTap(e) {
        console.log('onCalloutTap');
        console.log(e)
        const {
            markerId
        } = e;
        const {
            page_type,
            markers,
            markers_clean
        } = this.data;
        if (page_type == 0) {
            let markers_label = [];
            for (const marker of markers) {
                if (marker.id == markerId) {
                    marker.customCallout.descList[0].descColor = "#00A170";
                    marker.customCallout.descList[0].zIndex = 2;
                } else {
                    marker.customCallout.descList[0].descColor = "#333";
                    marker.customCallout.descList[0].zIndex = 1;
                }
                markers_label.push(marker);
            }
            this.setData({
                markers: markers_label
            });
            marker_oil = markers;

            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (markerId == item.station_id) {
                    select_marker_oil = item;
                    this.setData({
                        select_marker: select_marker_oil
                    });
                    break
                }
            }
        } else {
            let markers_label = [];
            for (const marker of markers_clean) {
                if (marker.id == markerId) {
                    marker.customCallout.descList[0].descColor = "#00A170";
                    marker.customCallout.descList[0].zIndex = 2;
                } else {
                    marker.customCallout.descList[0].descColor = "#333";
                    marker.customCallout.descList[0].zIndex = 1;
                }
                markers_label.push(marker);
            }
            this.setData({
                markers_clean: markers_label
            });
            marker_clean = markers;

            for (let i = 0; i < list_clean.length; i++) {
                const item = list_clean[i];
                if (markerId == item.washer_id) {
                    select_marker_clean = item;
                    this.setData({
                        select_marker_clean: select_marker_clean
                    });
                    break
                }
            }
        }
    },
    //气泡点击事件
    markertap(e) {
        console.log(e)
        const {
            markerId
        } = e;
        const {
            page_type,
            markers,
            markers_clean
        } = this.data;
        if (page_type == 0) {
            let markers_label = [];
            for (const marker of markers) {
                if (marker.id == markerId) {
                    marker.label.color = "#ffffff";
                    marker.label.bgColor = "#00A170";
                    // marker.label.borderColor = "#00A170";
                    marker.zIndex = 2;
                } else {
                    marker.label.color = "#00A170";
                    marker.label.bgColor = "#ffffff";
                    // marker.label.borderColor = "#D5D5D5";
                    marker.zIndex = 1;
                }
                markers_label.push(marker);
            }
            this.setData({
                markers: markers_label
            });
            marker_oil = markers;

            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (markerId == item.station_id) {
                    select_marker_oil = item;
                    this.setData({
                        select_marker: select_marker_oil
                    });
                    break
                }
            }
        } else {
            let markers_label = [];
            for (const marker of markers_clean) {
                if (marker.id == markerId) {
                    marker.label.color = "#ffffff";
                    marker.label.bgColor = "#00A170";
                    // marker.label.borderColor = "#00A170";
                    marker.zIndex = 2;
                } else {
                    marker.label.color = "#00A170";
                    marker.label.bgColor = "#ffffff";
                    // marker.label.borderColor = "#D5D5D5";
                    marker.zIndex = 1;
                }
                markers_label.push(marker);
            }
            this.setData({
                markers_clean: markers_label
            });
            marker_clean = markers;

            for (let i = 0; i < list_clean.length; i++) {
                const item = list_clean[i];
                if (markerId == item.washer_id) {
                    select_marker_clean = item;
                    this.setData({
                        select_marker_clean: select_marker_clean
                    });
                    break
                }
            }
        }

    },

    //处理当前定位的经纬度信息
    dealLocation() {
        const {
            page_type
        } = this.data;
        //获取当前位置的经纬度信息
        getLocation(true, location => {
            this.setData({
                center_lng: location.longitude,
                center_lat: location.latitude,
            });
            if (page_type == 1) {
                this.setData({
                    load_page_clean: 1
                });
                this.getCleanList();
            } else {
                this.setData({
                    load_page_oil: 1
                });
                this.getStations();
            }
        }, err => {
            showToast(err);
            if (page_type == 1) {
                this.setData({
                    load_page_clean: 1
                });
                this.getCleanList();
            } else {
                this.setData({
                    load_page_oil: 1
                });
                this.getStations();
            }
        });
    },

    //获取加油站列表
    getStations() {
        const {
            center_lng,
            center_lat,
            oil_type_name,
            oil_sort_class,
            oil_brand
        } = this.data;
        const params = {
            page_num: 1,
            page_size: 0,
            center_lng: center_lng,
            center_lat: center_lat,
            oil_type_name: oil_type_name,
            sort_class: oil_sort_class,
            gasoline_brand: oil_brand || null,
            source: "WXAPPLET"
        }
        showLoading("正在加载中...");
        getHttpPost(stationsApi.list, params, res => {
            hideLoading();
            list = this.dealResponse(res.data);
            this.dealMarkers(list);
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    //洗车查询
    getCleanList() {
        console.log(`洗车查询start:${new Date()}`);
        const {
            center_lng,
            center_lat
        } = this.data;
        const params = {
            page_num: 1,
            page_size: 0,
            center_lng: center_lng,
            center_lat: center_lat,
            washer_status: null,
            able_parking: null,
        }
        showLoading("正在加载中...");
        getHttpPost(cleanApi.list, params, res => {
            hideLoading();
            list_clean = this.dealCleanResponse(res.data);
            this.dealCleanMarkers(list_clean);
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    /**
     * 数据处理
     */
    dealCleanResponse(data) {
        return data && data.map(item => {
            item.latitude_tx = Number(item.latitude_tx);
            item.longitude_tx = Number(item.longitude_tx);
            item.distance_meter = keepDecimalFull(item.distance_meter, 1);
            item.washer_price = keepDecimalFull(item.washer_price, 0).replace('.', '');
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
            return item;
        });
    },

    //markers
    dealMarkers(data) {
        let markers = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                let price = item.current_station_price && item.current_station_price.xl_price ? item.current_station_price.xl_price : item.current_station_price.list_price;
                let content = price ? `￥${price}  |  ${item.brand}  ` : `${item.brand}`
                let marker = {
                    id: item.station_id,
                    latitude: item.latitude_tx,
                    longitude: item.longitude_tx,
                    iconPath: "/assets/static/map-empty.png",
                    width: 2,
                    height: 2,
                    customCallout: {
                        "type": 2,
                        "descList": [{
                            "desc": content,
                            "descColor": i ? "#333" : "#00A170"
                        }],
                        "isShow": 1,
                        "zIndex": i ? 1 : 2,
                        "bgColor": "#ffffff"
                    }
                }
                markers.push(marker);
            }
            marker_oil = markers;
            select_marker_oil = data && data[0];
            this.setData({
                markers: marker_oil,
                select_marker: select_marker_oil
            });

        }
    },
    dealCleanMarkers(data) {
        let markers_clean = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                let status = item.washer_status == '1' ? `空闲` : item.washer_status == '2' ? '使用中' : `维护中`;
                let brand = item.brand_name == 'DEFAULT' ? `信联智洗` : item.brand_name;
                let content = `${status}  |  ${brand}  `;
                let marker = {
                    id: item.washer_id,
                    latitude: item.lat_tx,
                    longitude: item.lng_tx,
                    iconPath: "/assets/static/map-empty.png",
                    width: 50,
                    height: 50,
                    customCallout: {
                        "type": 2,
                        "descList": [{
                            "desc": content,
                            "descColor": i ? "#333" : "#00A170"
                        }],
                        "isShow": 1,
                        // canShowOnTap:true,
                        // layout:{
                        //     params:{
                        //         title: content,
                        //         bgColor:'#FF00FF'
                        //     },
                        //     src:"/layout/map_callout.xml"
                        // }
                    },
                }
                markers_clean.push(marker);
                if (i == data.length - 1) console.log(markers_clean)
            }
            marker_clean = markers_clean;
            select_marker_clean = data && data[0];
            this.setData({
                markers_clean: marker_clean,
                select_marker_clean: select_marker_clean,
            });

        }
    },
    //立即洗车=》检查洗车机距离
    onCleanCheck() {
        showLoading("请稍候...")
        this.setData({
            openid: my.getStorageSync({
                key: OPENID
            }).data
        });
        const {
            center_lng,
            center_lat
        } = this.data;
        const paramsData = {
            washer_id: select_marker_clean.washer_id,
            center_lng: center_lng,
            center_lat: center_lat,
        }
        getHttpPost(cleanApi.distance, paramsData, res => {
            hideLoading();
            if (res.result_code === "00000") {
                const details = encodeURIComponent(JSON.stringify(select_marker_clean));
                my.navigateTo({
                    url: `/pages/stations/clean/park-confirm/park-confirm?params=${details}`
                });
            }
        }, err => {
            hideLoading();
            // this.setData({isShowFar:true,})
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