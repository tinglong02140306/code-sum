/*
 * @Author: sunmingmao
 * @Date: 2020-04-13 08:05:12
 * @LastEditors: longting
 * @LastEditTime: 2020-04-17 16:13:17
 * @Description: 加油站筛选
 */
import { brands, oil_gas, oil_diesel } from '../constants';
let params = null;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        brands: brands,
        oil_gas: oil_gas,
        oil_diesel: oil_diesel,
        select_oil_no: "92#",
        select_brand: "all",
        select_brand_name: "全部品牌",
        isIphoneX: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        params = options.params;
        try {
            this.dealStyleData();
            params = JSON.parse(decodeURIComponent(options.params));
            this.setData({
                select_oil_no: params.oil_type_name,
                select_brand: params.oil_brand,
            });
        } catch (error) {
            console.log(`${error}`);
        }
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },

    //油品型号
    onOilNoClick(e) {
        this.setData({
            select_oil_no: e.currentTarget.dataset.item
        });
    },

    //品牌
    onBrandClick(e) {
        const index = e.currentTarget.dataset.item;
        this.setData({
            select_brand: brands[index].id,
            select_brand_name: brands[index].title,
        });
    },

    //完成
    onFinishClick() {
        const {
            select_oil_no,
            select_brand,
            select_brand_name
        } = this.data;
        const pages = getCurrentPages();
        if (pages.length >= 2) {
            const prePage = pages[pages.length - 2];
            if (prePage.route = "pages/stations/map/map") {
                prePage.setData({
                    oil_type_name: select_oil_no,
                    oil_brand: select_brand,
                    oil_brand_name: select_brand_name,
                });
                prePage.getStations();
                my.navigateBack();
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