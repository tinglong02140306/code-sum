// pages/mine/etc/bind/bind.js
import { formatPlateNumber, checkPlateNumber } from "../../../../utils/util";
import { provinces, letters } from '../../../../constants/plate_number';
import { getPostPromise } from '../../../../http/http';
import { etcApi, paymentApi} from '../../../../http/api';
import { checkETCNo } from '../../../../utils/util';
import { showLoading, hideLoading, showToast } from '../../../../utils/my';
const app = getApp();
let isIphoneX = app.globalData.isIphoneX;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        etc_card_no: '', //ETC卡号
        car_plate_no: '', //车牌号全
        plate_no_index: [0, 0], //车牌前缀 [鲁 A]
        car_plate_input: "", //车牌信息 [89056]
        plate_number_list: [], //系统检测到的用户的车牌信息
        car_plate_color: 0, //车牌颜色 默认蓝色
        show: false,
        isIphoneX: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.dealStyleData();
        this.getOwnedList();
    },
    dealStyleData() {
        const {
            isIphoneX
        } = app.globalData;
        this.setData({
            isIphoneX: isIphoneX
        })
    },

    //etc卡号
    onETCChange(value) {
        this.setData({
            etc_card_no: value
        });
    },

    //车牌号
    onPlateChange(detail) {
        const {
            plate_header,
            palte_no,
            index
        } = detail;
        this.setData({
            car_plate_no: `${plate_header}${palte_no}`,
            plate_no_index: index,
            car_plate_input: palte_no
        });
    },

    //车牌颜色
    onPlateColorChange(detail) {
        this.setData({
            car_plate_color: detail
        });
    },

    //用户点击监测到的车牌号
    onItemClick(e) {
        const item = e.currentTarget.dataset.item;
        let car_plate_no = item.car_plate_no;
        const _province = car_plate_no.substring(0, 1);
        const _letter = car_plate_no.substring(1, 2);
        const _content = car_plate_no.substring(2, car_plate_no.length);
        let index = [this.getIndex(_province, provinces), this.getIndex(_letter, letters)];
        this.setData({
            etc_card_no: item.etc_card_no,
            plate_no_index: index,
            car_plate_input: _content,
            show: false,
            car_plate_no: item.car_plate_no,
            car_plate_color: item.car_plate_color
        });
    },

    //取消展示监测到的车牌号
    onCancelClick() {
        this.setData({
            show: false
        });
    },

    //提交
    onNextClick() {
        const {
            etc_card_no,
            car_plate_no
        } = this.data;
        if (!checkETCNo(etc_card_no)) {
            showToast("请输入正确的ETC卡号");
        } else if (!checkPlateNumber(car_plate_no)) {
            showToast("请输入正确的车牌号");
        } else {
            this.bindETC();
        }
    },

    //用户名下ETC查询
    getOwnedList() {
        showLoading("正在加载...");
        console.log(etcApi.owned)
        getPostPromise(etcApi.owned, {}).then(res => {
            hideLoading();
            const list = res.data && res.data.map(item => {
                item.plate_number_formate = formatPlateNumber(item.car_plate_no);
                return item;
            });
            this.setData({
                plate_number_list: list
                // show: list && list.length
            })
        }).catch(err => {
            hideLoading();
            showToast(`${err.msg}:${err.code}`);
        });

    },

    //绑定ETC
    bindETC() {
        showLoading("正在提交...");
        const {
            car_plate_no,
            car_plate_color,
            etc_card_no
        } = this.data;
        const province = checkETCNo(etc_card_no);
        const params = {
            etc_belong_province_code: province,
            etc_card_no: etc_card_no,
            car_plate_no: car_plate_no.toUpperCase(),
            car_plate_color: car_plate_color
        }
        getPostPromise(etcApi.bind, params).then(res => {
            hideLoading();
            showToast(`绑定成功`);
            this.hasPayWay();
            // 请求列表
            // this.timer = setTimeout(() => {
            //     const pages = getCurrentPages();
            //     if (pages.length >= 2) {
            //         const prePage = pages[pages.length - 2];
            //         if (prePage.route = "pages/mine/etc/list/list") { //刷新ETC列表
            //             prePage.getCardData();
            //             my.navigateBack();
            //         }
            //     }
            //     clearTimeout(this.timer);
            // }, 500);
        }).catch(err => {
            hideLoading();
            showToast(`${err.msg}:${err.code}`);
        });
    },
    // 判断是否开通了支付方式
    hasPayWay() {
        getPostPromise(paymentApi.paymentList, {}).then(res => {
            const data = res.data;
            if(data.length > 0) {
                my.navigateBack();
            } else {
                my.navigateTo({
                    url: `/pages/mine/pay/list/list`
                });
            }
        }).catch(err => {
            showToast(`${err.msg}:${err.code}`);
        });

    },

    getIndex(search, data) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (search == item) {
                    return i;
                }
            }
        }
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