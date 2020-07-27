// pages/stations/clean-details/clean-details.js
import { StationPhotoDefault } from '../../../../assets/url/url';
import { OPENID } from "../../../../constants/global";
import { getHttpPost } from "../../../../http/http";
import { cleanApi } from "../../../../http/api";
import { getLocation } from "../../../../utils/location";
import { keepDecimalFull } from "../../../../utils/util";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";

const app = getApp();
let params = null;
let locations = null;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: false,
        isFistShow: false,
        openid: '',
        isShowFar: false,
        center_lng: '',
        center_lat: '',
        icon_default_wash: 'https://oss.etcsd.com/object/69342d074c0c4b40a26cc8ef959e851a',
        details: {
            // washer_id:'',//洗车机ID
            // washer_name:'小睿智洗-奥体东荷P5站',//场地名称
            // washer_address:'济南市奥体中路与天辰南路交叉口',//场地地址
            // distance_meter:114,//距离
            // lng_tx:'118.0764976143837',//腾讯经度
            // lat_tx:'36.49728394908562',//腾讯纬度
            // washer_price:15,//洗车价格
            // washer_status:true,//是否可用
            // photo_url:'https://oss.etcsd.com/object/69342d074c0c4b40a26cc8ef959e851a',//洗车机图片
            // free_parking_min:30,//免费停车时长
            // tel:'0531-12345678',//服务电话
        },
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
        }, err => {
            showToast(err);
        });
        try {
            params = JSON.parse(decodeURIComponent(options.params));
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.dealStyleData();
        const openid = my.getStorageSync({key: OPENID}).data;
        this.setData({
            openid: openid
        });
        // setTimeout(()=> {
        //     this.setData({
        //         isFistShow: true
        //     });
        //     this.modalSuperFirst.fadeIn();
        // })
        
    },
    modalSuperRefFar(ref) {
        this.modalSuperFar = ref;
    },
    modalSuperRefFirst(ref) {
        this.modalSuperFirst = ref;
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },
    //首次进入
    onHideFirst() {
        this.setData({
            isFistShow: false
        });
        this.modalSuperFirst.fadeOut();
    },
    //一键洗车
    onContinuePay() {
        const openid = my.getStorageSync({key: OPENID}).data;
        this.setData({
            openid: openid
        });
        if (!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return;
        }
        const params = encodeURIComponent(JSON.stringify(params));
        my.navigateTo({
            url: `/pages/stations/clean/park-confirm/park-confirm?params=${params}`
        });
    },

    //重选洗车机
    onReSelect() {
        this.setData({
            isShowFar: false
        });
        this.modalSuperFar.fadeOut();
        my.navigateBack();
    },

    //拨打电话
    callClick() {
        my.makePhoneCall({
            phoneNumber: this.data.details.tel,
            success() {
                console.log("拨打电话成功！")
            },
            fail() {
                console.log("拨打电话失败！")
            }
        })
    },

    //导航
    onNavigationClick() {
        const { details } = this.data;
        my.openLocation({
            latitude: details.lat_tx,
            longitude: details.lng_tx,
            name: details.washer_name,
            address: details.washer_address
        });
    },

    //券包购买
    goBuyClick() {
        const openid = my.getStorageSync({key: OPENID}).data;
        this.setData({
            openid: openid
        });
        if (!openid) {
            my.navigateTo({
                url: `/pages/login/login`
            });
            return;
        }
        my.navigateTo({
            url: '/pages/mine/ticket-buy/list/list'
        });
    },

    //刷新洗车机详情
    onRefreshClick() {
        showLoading("刷新中...")
        this.setData({
            openid: my.getStorageSync({
                key: OPENID
            }).data
        });
        const {
            details,
        } = this.data;
        const params = {
            washer_id: details.washer_id,
        }
        getHttpPost(cleanApi.details, params, res => {
            hideLoading();
            const data = this.dealResponse(res.data);
            this.setData({
                details: data
            });
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    //检查洗车机距离
    onCleanClick() {
        showLoading("请稍候...")
        this.setData({
            openid: my.getStorageSync({
                key: OPENID
            }).data
        });
        const {
            details,
            center_lng,
            center_lat
        } = this.data;
        const paramsData = {
            washer_id: details.washer_id,
            center_lng: center_lng,
            center_lat: center_lat,
        }
        getHttpPost(cleanApi.distance, paramsData, res => {
            hideLoading();
            if (res.result_code === "00000") {
                const details = encodeURIComponent(JSON.stringify(params));
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
     * 数据处理
     */
    dealResponse(data) {
        return data && data.map(item => {
            item.latitude_tx = Number(item.latitude_tx);
            item.longitude_tx = Number(item.longitude_tx);
            item.distance = keepDecimalFull(item.distance, 1);
            return item;
        })
    },
})