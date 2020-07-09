// pages/stations/index/index.js
import { billApi } from '../../../../http/api';
import { getHttpPost } from '../../../../http/http';
import { formatTime, keepTwoDecimalFull, dateFormat } from "../../../../utils/util";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
const app = getApp();
let page_num = 1;
const page_size = 15;
const tabHeight = 90;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_type:null, // null全部 GAS加油,WASH加油,COUPON_PACKAGE券包
        showConsume: false,
        isEmptyList: false,
        bill_list: [],
        isShowLoadingMore: false,
        loadingState: '',
        isLoadingFinish: false,
        is_refresh: false,
        show_finish: false,
        load_status: 0, //上拉加载状态 0: 已加载完成 1:正在加载中 2:已加载全部
        refresher: true, //下拉刷新状态
        status: 0, //1:列表为空 2:网络连接失败
        scroll_height: `calc(100vh - ${tabHeight}rpx - 20rpx)`
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        showLoading("正在加载...");
        this.getBillList();
    },

    /**
     * 开具发票
     */
    goInvoice() {
        this.setData({
            showConsume: false,
        });
        my.navigateTo({
            url: '/pages/mine/invoice/index/index'
        })
    },
    /**
     * 点击详情
     */
    onCellClick(e) {
        const details = e.currentTarget.dataset.item;
        this.setData({
            showConsume: false,
        });
        my.navigateTo({
            url: '/pages/mine/order/details/details?details=' + encodeURIComponent(JSON.stringify(details))
        })
    },

    /**
     * 选择类型
     */
    showType(e) {
        const showConsume = this.data.showConsume;
        this.setData({
            showConsume: !showConsume,
        });
    },

    /**
     * 消费类型
     */
    onChangeType(e) {
        const order_type = e.currentTarget.dataset.item;
        this.setData({
            order_type:order_type,
        });
        this.onRefresh();
    },

    /**
     * 账单查询
     */
    getBillList() {
        showLoading("正在加载...");
        const {
            order_type
        } = this.data;
        const params = {
            page_num: page_num,
            page_size: page_size,
            order_type: order_type,
        }
        getHttpPost(billApi.list, params, res => {
            console.log(res);
            my.stopPullDownRefresh();
            hideLoading();
            const data = this.dealResponse(res.data);
            const list = page_num == 1 ? data : this.data.bill_list.concat(data);
            this.setData({
                bill_list: list,
                isEmptyList: list && list.length ? false : true,
                refresher: false,
                load_status: data.length < page_size ? 2 : 0,
                status: list && list.length ? 0 : 1,
                load_page: 2
            });

        }, err => {
            hideLoading();
            showToast(err.msg);
            let status = this.data.bill_list == null && err.code == 10 ? 2 : 0;
            this.setData({
                refresher: false,
                status: status,
                load_status: err.code == 10 ? 0 : this.data.load_status
            })
        });
    },

    //下拉刷新
    onRefresh() {
        page_num = 1;
        this.setData({
            refresher: true
        })

        if (this.data.consume_type === 2) {
            this.setData({
                refresher: false
            })
        } else {
            this.getBillList();
        }
    },

    //加油上拉加载更多
    onLoadMore() {
        page_num++;
        this.setData({
            load_status: 1
        })
        this.getBillList();
    },

    //网络连接失败 重新加载
    onRetryClick() {
        page_num = 1;
        this.getBillList();
    },

    /**
     * 数据处理
     */
    dealResponse(data) {
        return data && data.map(item => {
            const m = item.create_time.substr(5, 2)
            const d = item.create_time.substr(8, 2)
            const ss = item.create_time.substr(10, 6)
            item.invoice_create_time_str = m + '月' + d + '日' + ss;
            item.order_price = keepTwoDecimalFull(item.order_price);
            item.order_quantity = keepTwoDecimalFull(item.order_quantity);
            return item;
        })
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