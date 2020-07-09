// pages/station/fast-oil/fast-oil.js
import { StationNavigator, FastOilNav, FastOilPerfer, FastOilHint } from '../../../assets/url/url';
import { oil_guns, moneys, picker_guns } from '../constants';
import { checkMoney, keepDecimalFull } from '../../../utils/util';
import { getPostPromise } from '../../../http/http';
import { stationsApi } from '../../../http/api';
import { showToast } from "../../../utils/my";
const app = getApp();
let discount_params = null; //计算折扣金额的请求参数
let prices = []; //所有的油品类型及金额的集合
Page({

    /**
     * 页面的初始数据
     */
    data: {
        oil_info: {},
        oil_nums: [], //油号集合
        checkOilNum: 0, //选中的油号
        oil_guns: oil_guns, //油枪集合
        checkOilGun: 0, //选中的油枪
        picker_guns: picker_guns,
        is_picker: false,
        picker_index: '',
        picker_value: "其他",
        moneys: moneys, //可选择的支付金额
        current_price: "", //油号所对应的油站价
        checkMoney: '', //默认选中的支付金额
        inputMoney: '', //默认输入的支付金额
        discount_amount: '', //折扣金额
        payable_amount: '', //应付金额
        icon: StationNavigator,
        icon_nav: FastOilNav,
        icon_perfer: FastOilPerfer,
        icon_hint: FastOilHint,
        showBottom: false,
        top: 20,
        isCanSubmit: false,
        isShowFar: false, //展示油站距离超过500米的提示
        isShowPrice: false, //展示价格选择
        isIphoneX: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            this.dealStyleData();
            let details = JSON.parse(decodeURIComponent(options.details));
            prices = details.station_price || [];
            let current_price_obj = this.getOilPrice(details.current_oil_no, prices);
            this.setData({
                oil_info: details,
                oil_nums: prices
            });
            if (current_price_obj) {
                this.setData({
                    current_price: current_price_obj.list_price,
                    checkOilNum: current_price_obj.index
                });
                discount_params = {
                    station_id: details.station_id,
                    oil_no: current_price_obj.oil_no,
                    oil_type: current_price_obj.oil_type,
                    oil_gun: oil_guns[0] + 1,
                    order_amount: moneys[0]
                }
                this.getDiscount(discount_params);
            }
        } catch (error) {
            console.log(error);
            my.switchTab({
                url: '/pages/home/index/index'
            });
        }
    },
    modalSuperRef(ref) {
        this.modalSuper = ref;
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },


    //选择油号
    onChangeOilNum(e) {
        const { oil_nums } = this.data;
        const index = e.currentTarget.dataset.item;
        let oil_num_obj = oil_nums[index];
        this.setData({
            checkOilNum: index,
            current_price: oil_num_obj.list_price
        });
        discount_params.oil_no = oil_num_obj.oil_no;
        discount_params.oil_type = oil_num_obj.oil_type;
        this.getDiscount(discount_params);
    },

    //选择油枪
    onChangeOilGun(e) {
        const index = e.currentTarget.dataset.item;
        this.setData({
            checkOilGun: index,
            is_picker: false,
            picker_index: "",
            picker_value: "其他"
        });
        discount_params.oil_gun = index + 1;
        this.getDiscount(discount_params);
    },

    //选择油枪 滚动器
    onPickerChange(e) {
        const index = e.detail.value;
        this.setData({
            picker_index: index,
            picker_value: picker_guns[index],
            checkOilGun: picker_guns[index],
            is_picker: true
        });
        discount_params.oil_gun = picker_guns[index];
        this.getDiscount(discount_params);
    },

    //选择加油金额
    onChangeMoney(e) {
        const money = e.currentTarget.dataset.item;
        this.setData({
            checkMoney: money,
            inputMoney: money
        });
        discount_params.order_amount = money;
        this.getDiscount(discount_params);
    },

    //加油金额输入
    onInputMoney(e) {
        this.setData({
            isShowPrice: true,
            checkMoney: '',
        });
        const value = e.detail.value;
        if (value && !checkMoney(value)) {
            showToast("请输入正确的金额");
        } else {
            this.setData({
                inputMoney: value
            });
            discount_params.order_amount = value;
            if(value) {
                this.getDiscount(discount_params)
            } else {
                this.setData({
                    discount_amount: 0
                });

            }
        }
    },

    //加油金额输入完成 计算折扣金额
    onInputBlur() {
        const {
            inputMoney
        } = this.data;
        if (checkMoney(inputMoney)) {
            discount_params.order_amount = inputMoney;
            this.getDiscount(discount_params);
        }
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

    //提交订单按钮
    onSubmitClick() {
        const {
            oil_info,
            inputMoney,
            isCanSubmit
        } = this.data;
        if (isCanSubmit) {
            if (inputMoney && checkMoney(inputMoney)) {
                if (keepDecimalFull(inputMoney, 2) == "0.00") {
                    showToast("请输入有效金额");
                } else {
                    if (oil_info.distance > 0.5) {
                        this.modalSuper.fadeIn();
                        this.setData({
                            isShowFar: true
                        });
                    } else {
                        this.submitOrder(discount_params);
                    }
                }
            } else {
                showToast(inputMoney ? "请输入正确的金额" : "请输入加油金额");
            }
        }
    },
    // 隐藏弹框
    hideModal() {
        this.modalSuper.fadeOut();
        this.setData({
            isShowFar: false
        });
    },
    //继续支付
    onContinuePay() {
        this.hideModal();
        this.submitOrder(discount_params);
    },
    //重选油站
    onReSelect() {
        this.hideModal();
        my.navigateBack();
    },

    //提交订单
    submitOrder(params) {
        const details = encodeURIComponent(JSON.stringify(params));
        getPostPromise(stationsApi.order, params).then(res => {
            params.discount_amount = keepDecimalFull(res.discount_amount, 2);
            params.payable_amount = res.payable_amount;
            params.order_status = res.order_status;
            params.order_no = res.order_no;
            params.station_name = res.station_name;
            params.balance_amount = res.balance_amount;
            const details = encodeURIComponent(JSON.stringify(params));
            my.navigateTo({
                url: `/pages/stations/fast-order/fast-order?details=${details}`
            })
        }).catch(err => {
            showToast(`${err.msg}:${err.code}`);
        });
    },

    //折扣计算
    getDiscount(params) {
        getPostPromise(stationsApi.discount, params).then(res => {
            this.setData({
                discount_amount: res.discount_amount,
                payable_amount: res.payable_amount,
                isCanSubmit: true
            });
        }).catch(err => {
            this.setData({
                discount_amount: 0,
                isCanSubmit: false
            });
            showToast(`${err.msg}:${err.code}`);
        });
    },
})