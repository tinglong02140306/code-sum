// pages/mine/ticket-buy/list/list.js
import { couponPackageApi, invoiceApi } from '../../../../http/api';
import { getHttpPost } from '../../../../http/http';
import { keepDecimalFull, keepTwoDecimalFull, dateFormat, formatTimes, getDifferTime} from "../../../../utils/util";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
const app = getApp();
let page_num = 1;
const PAGESIZE = 10;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_empty: false,
        card_list: [],
        is_refresh: false,
        show_finish: false,
        load_status: 0, //上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
        refresher: true, //下拉刷新状态
        status: 0, //1:列表为空 2:网络连接失败
        timeLimitCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
    },
    onShow() {
        showLoading("加载中...")
        this.getCouponPackageList()
    },
    /**
     * 点击详情
     */
    onCellClick(e) {
        const details = e.currentTarget.dataset.item;
        my.navigateTo({
            url: '/pages/mine/ticket-buy/details/details?details=' + encodeURIComponent(JSON.stringify(details))
        })
    },
    /**
     * 列表查询
     */
    getCouponPackageList() {
        // hideLoading();
        // let data = [{
        //     "background_url":"https://oss.etcsd.com/object/17e7048da2fa48f89e729d0ded3250be",
        //     "coupon_count":1,
        //     "description":"11",
        //     "discount_rate":"0.20",
        //     "instruction":["11111111111111111111111"],
        //     "package_id":17,
        //     "package_name":"11",
        //     "package_price":"10.00",
        //     "time_limit_flag": true,
        //     count_limit_flag: true,
        //     start_flag: true,
        //     start_time: "",
        //     end_time: "20:00",
        //     total_count: 100,
        //     saled_count: 50
        // }, {
        //     "background_url":"https://oss.etcsd.com/object/17e7048da2fa48f89e729d0ded3250be",
        //     "coupon_count":1,
        //     "description":"112222",
        //     "discount_rate":"0.20",
        //     "instruction":["11111111111111111111111"],
        //     "package_id":17,
        //     "package_name":"11",
        //     "package_price":"10.00",
        //     "time_limit_flag": true,
        //     count_limit_flag: true,
        //     start_flag: true,
        //     start_time: "",
        //     end_time: "22:21",
        //     total_count: 100,
        //     saled_count: 50
        // }, {
        //     "background_url":"https://oss.etcsd.com/object/17e7048da2fa48f89e729d0ded3250be",
        //     "coupon_count":1,
        //     "description":"55555",
        //     "discount_rate":"0.20",
        //     "instruction":["11111111111111111111111"],
        //     "package_id":17,
        //     "package_name":"11",
        //     "package_price":"10.00",
        //     "time_limit_flag": true,
        //     count_limit_flag: true,
        //     start_flag: true,
        //     start_time: "",
        //     end_time: "19:56",
        //     total_count: 100,
        //     saled_count: 50
        // }  ]
        // this.dealResponse(data);
        // return;
        const params = {
            page_num: page_num,
            page_size: PAGESIZE
        }
        getHttpPost(couponPackageApi.list, {}, res => {
            hideLoading();
            this.dealResponse(res.data);
        }, err => {
            hideLoading();
            showToast(err.msg);
            let status = this.data.card_list == null && err.code == 10 ? 2 : 0;
            this.setData({
                refresher: false,
                status: status,
                load_status: err.code == 10 ? 0 : this.data.load_status
            })
        })
    },

    // 时间倒计时
    countDown() {
        let { card_list, timeLimitCount } = this.data,
            step = 1000,
            that = this,
            leftTime = "";
        var timer = setInterval(function () {

            card_list && card_list.map((item, key) => {
                leftTime = item.leftTime;
                if(item.time_limit_flag) {
                    if(leftTime > 0) {
                        item.leftTime = leftTime - 1;
                        item.showTime = formatTimes(item.leftTime);
                    } else {
                        item.leftTime = -1;
                        card_list.splice(key, 1)
                    }  
                }
                return item;
            });
            let interList = card_list && card_list.filter((item) => {
                return item.time_limit_flag && item.leftTime < 0;
            })
            if(interList.length == timeLimitCount) clearInterval(timer);//清空计时

            that.setData({
                card_list: card_list
            });

            // if (leftTime >= 0) {
            //     that.formatTimes(leftTime),
            //         leftTime = leftTime - step;
            //     that.setData({
            //         leftTime: leftTime
            //     })
            // } else {
            //     that.setData({
            //         leftTime: 0
            //     })
            //     clearInterval(timer);//清空计时
            // }
        }, step);
    },

    //下拉刷新
    onRefresh() {
        page_num = 1;
        this.setData({
            refresher: true
        })
        this.getCouponPackageList();
    },

    //加油上拉加载更多
    onLoadMore() {
        page_num++;
        this.setData({
            load_status: 1
        })
        this.getCouponPackageList();
    },

    //网络连接失败 重新加载
    onRetryClick() {
        page_num = 1;
        this.getCouponPackageList();
    },

    /**
     * 数据处理
     */
    dealResponse(data) {
        let { timeLimitCount } = this.data;
        data && data.map(item => {
            let discount = item.discount_rate.toString().replace('0', '').replace('.', '');
            item.discount_rate = discount.replace('0', '');
            item.distance_meter = keepDecimalFull(item.distance_meter, 1);
            item.package_price = keepTwoDecimalFull(item.package_price);
            item.description = item.description.replace(/[\r\n]/g, "");
            item.leftTime = getDifferTime(item.end_time);
            item.showTime = formatTimes(item.leftTime);
            if(item.time_limit_flag) timeLimitCount++;
            return item;
        });
        const list = page_num == 1 ? data : this.data.card_list.concat(data);
        this.setData({
            card_list: list,
            isEmpty: list && list.length ? false : true,
            refresher: false,
            load_status: data.length < PAGESIZE ? 2 : 0,
            status: list && list.length ? 0 : 1,
            load_page: 2,
            timeLimitCount: timeLimitCount
        });
        console.log(this.data.card_list);
        if(timeLimitCount > 0) this.countDown();
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