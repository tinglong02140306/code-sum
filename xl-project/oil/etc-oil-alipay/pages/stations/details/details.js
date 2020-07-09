// pages/stations/details/details.js
import { StationPhotoDefault } from '../../../assets/url/url';
import { getCurrentData } from '../../../utils/util';
import { OPENID } from '../../../constants/global'
let Mock = require('../../../utils/mock.js');
let params = null;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        station: null,
        oil_types: [],
        order_list: [], //实时订单
        current_oil_no: "", //当前展示的油品类型
        current_index: 0, //当前展示油品类型的index
        current_price: "", //当前展示油品类型的油站价
        current_price_gb: "", //当前展示油品类型的国标价
        current_price_vip: "", //当前展示油品类型的会员价
        openid: "",
        is_support_no_sense: false, //是否支持无感支付
        background_default: StationPhotoDefault,
        isIphoneX: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            this.dealStyleData();
            params = JSON.parse(decodeURIComponent(options.params));
            this.setData({
                station: params
            });
            const current_oil_no = params.current_oil_no;
            const station_price = params.station_price;
            const current_Obj = this.getOilPrice(current_oil_no, station_price);
            let support_payments = params.support_payments;
            if (current_Obj) {
                this.setData({
                    oil_types: params.station_price,
                    current_oil_no: current_Obj.oil_no,
                    current_price: current_Obj.list_price,
                    current_price_gb: current_Obj.gb_price,
                    current_price_vip: current_Obj.xl_price,
                    current_index: current_Obj.index,
                    is_support_no_sense: support_payments && support_payments.includes("ETC_NO_SENSE")
                });
            }
            this.getOrders();
        } catch (error) {
            console.log(error)
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },

    onShow() {
        const openid = my.getStorageSync({
            key: OPENID
        }).data;
        this.setData({
            openid: openid
        });
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },

    //修改油品类型
    onOilNoChange(e) {
        const {
            value
        } = e.detail;
        const {
            oil_types
        } = this.data;
        if (oil_types && oil_types.length) {
            //选择的油品型号
            const current_oil_no = oil_types[value].oil_no;
            //当前选中的油品型号 所对应得所有价格
            let current_price_obj = this.getOilPrice(current_oil_no, params.station_price);
            this.setData({
                current_oil_no: current_oil_no,
                current_index: value,
                current_price: current_price_obj.list_price,
                current_price_gb: current_price_obj.gb_price,
                current_price_vip: current_price_obj.xl_price
            })
        }
    },

    //导航
    onNavigationClick() {
        const {
            station
        } = this.data;
        my.openLocation({
            latitude: station.latitude_tx,
            longitude: station.longitude_tx,
            name: station.name,
            address: station.address
        });
    },

    //快捷加油
    onOilClick() {
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
        const {
            station,
            current_oil_no
        } = this.data;
        const supports = station.support_payments;
        params.current_oil_no = current_oil_no;
        let details = encodeURIComponent(JSON.stringify(params));
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

    //ETC加油
    onEtcClick() {
        let details = encodeURIComponent(JSON.stringify(params));
        my.navigateTo({
            url: `/pages/stations/etc-pay/etc-pay?params=${details}`
        });
    },

    //获取油品类型对应的价格及差价信息
    getOilPrice(oil_type, prices) {
        if (prices) {
            for (let i = 0; i < prices.length; i++) {
                const item = prices[i];
                if (item.oil_no == oil_type) {
                    item.index = i;
                    return item;
                }
            }
        }
        return "";
    },

    //图片加载失败
    onImageError(e) {
        // const index = e.currentTarget.dataset.index;
        // const {order_list} = this.data;
        // order_list[index].img = '/assets/static/default-head.png';
        // this.setData({order_list:order_list});
    },

    //获取实时订单信息
    getOrders() {
        const data = getCurrentData();
        let res = Mock.mock({
            'data|8': [{
                'img': `https://i.picsum.photos/id/@integer(0,1000)/80/80.jpg`,
                'name': '@ctitle(1,1)',
                'time': data,
                'money': '@integer(1,3)',
                'discount': '@float(10, 50, 2, 2)'
            }]
        });
        const limit = Mock.mock('@integer(2, 6)');
        const list = res.data && res.data.filter((item, index) => {
            const interger = item.money;
            item.money = `${interger}00.00`;
            item.discount = `${interger}0.00`;
            return index < limit
        });
        this.setData({
            order_list: list
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