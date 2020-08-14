// pages/person/pay/pay.js
import { aliPay, UnionPay, PersionNext, PayDiscounts, PayMove, CCBLOGO } from "../../../../assets/url/url";
import { getHttpPost } from "../../../../http/http";
import { paymentApi } from "../../../../http/api";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isWeChat: false,
        isWxVehicle: false,
        isCCB: false,
        isUpdate: false,
        isEmpty: true,
        isShowHint: false,
        is_refresh: false,
        optionList: [],
        movableViewInfo: {
            y: 0,
            showClass: 'none',
            data: {}
        },
        pageInfo: {
            rowHeight: 120,
            scrollHeight: 100,
            startIndex: null,
            scrollY: true,
            readyPlaceIndex: null,
            startY: 0,
            selectedIndex: null,
        },
        alipay_icon: aliPay,
        union_icon: UnionPay,
        next_icon: PersionNext,
        discounts_icon: PayDiscounts,
        move_icon: PayMove,
        icon_ccb: CCBLOGO,
        show: false,
        id: ""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getPaymentSequence();
    },

    onShow(options) {
        if (this.data.is_refresh) {
            this.getPaymentSequence();
        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        // if (this.data.isUpdate) {
        //     this.verdictPaymentSequence();
        // }
    },
    popupRef(ref) {
        this.popupRef = ref;
    },
    // 解约弹框点击事件
    unsignClick(e) {
        this.setData({
            show: true,
            id: e.currentTarget.dataset.id
        })
        this.popupRef.fadeIn();
    },
    onCancelClick() {
        this.setData({
            show: false
        })
        this.popupRef.fadeOut();
    },
    onSureClick() {
        showLoading("正在解约...");
        getHttpPost(paymentApi.unsign, {id: this.data.id}, res => {
            hideLoading();
            this.getPaymentSequence();
            this.onCancelClick();
        },
        fail => {
            hideLoading();
            showToast(fail.msg);
        });
    },

    // 开通支付宝免密支付
    signAlipay() {
        showLoading("正在加载...");
        getHttpPost(paymentApi.sign, {}, res => {
            hideLoading();
            if (res.result_code === "00000") {
                this.paySignCenter(res.sign_params); 
            }
        },
        fail => {
            hideLoading();
            showToast(fail.msg);
        });
        
    },
    // 跳转到支付宝免密代扣签约页面
    paySignCenter(signStr) {
        my.paySignCenter ({
            signStr:signStr,
            success:( res )=>{
                // my.alert ({
                //     title:'success' ,  // alert框的标题 
                //     content:JSON . stringify ( res )
                // });
                if(res.resultStatus == '7000') {
                    // 重新刷新列表数据
                    this.getPaymentSequence();
                }
            },
            fail:( res )  =>  {
                // my.alert ({
                //     title:'fail' ,  // alert框的标题 
                //     content:JSON . stringify ( res )
                // });
                // const details = encodeURIComponent(JSON.stringify({ isSuccess: false }));
                // my.navigateTo({
                //     url: `/pages/mine/pay/result/result?params=${details}`
                // });
            }
        });

    },

    //支付方式排序列表
    getPaymentSequence() {
        let list = [{
            title:"支付宝免密支付",
            bank_title_logo: aliPay
        }];
        // this.setData({
        //     isEmpty: !list.length,
        //     is_refresh: false,
        //     optionList: list.length > 0 ? list : [],
        // });
        // return;
        showLoading("正在加载...");
        getHttpPost(paymentApi.paymentList, {}, res => {
            hideLoading();
            const data = res.data;
            if(data.length > 0) {
                list = [{...list[0], ...data[0]}];
            }
            this.setData({
                isEmpty: !data.length,
                is_refresh: false,
                optionList: data.length > 0 ? list : [],
            });
        },
        fail => {
            hideLoading();
            showToast(fail.msg);
        });
    },

    dragStart(event) {
        let startIndex = event.target.dataset.index
        // 初始化页面数据
        let pageInfo = this.data.pageInfo
        pageInfo.startY = event.touches[0].clientY
        pageInfo.readyPlaceIndex = startIndex
        pageInfo.selectedIndex = startIndex
        pageInfo.scrollY = false
        pageInfo.startIndex = startIndex
        this.setData({
            'movableViewInfo.y': pageInfo.startY - pageInfo.rowHeight
        })
        // 初始化拖动控件数据
        let movableViewInfo = this.data.movableViewInfo
        movableViewInfo.data = this.data.optionList[startIndex]
        movableViewInfo.showClass = "inline"
        this.setData({
            movableViewInfo: movableViewInfo,
            pageInfo: pageInfo
        })
    },

    dragMove(event) {
        let optionList = this.data.optionList
        let pageInfo = this.data.pageInfo
        // 计算拖拽距离
        let movableViewInfo = this.data.movableViewInfo
        let movedDistance = event.touches[0].clientY - pageInfo.startY
        movableViewInfo.y = pageInfo.startY - pageInfo.rowHeight + movedDistance
        // 修改预计放置位置
        let movedIndex = parseInt(movedDistance / (pageInfo.rowHeight / 2))
        let readyPlaceIndex = pageInfo.startIndex + movedIndex
        if (readyPlaceIndex < 0) {
            readyPlaceIndex = 0
        } else if (readyPlaceIndex >= optionList.length) {
            readyPlaceIndex = optionList.length - 1
        }
        if (readyPlaceIndex != pageInfo.selectedIndex) {
            let selectedData = optionList[pageInfo.selectedIndex]
            optionList.splice(pageInfo.selectedIndex, 1)
            optionList.splice(readyPlaceIndex, 0, selectedData)
            pageInfo.selectedIndex = readyPlaceIndex
        }
        // 移动movableView
        pageInfo.readyPlaceIndex = readyPlaceIndex
        this.setData({
            movableViewInfo: movableViewInfo,
            optionList: optionList,
            pageInfo: pageInfo
        })
    },

    dragEnd(event) {
        this.setData({
            isUpdate: true,
        });
        // 重置页面数据
        let pageInfo = this.data.pageInfo
        pageInfo.readyPlaceIndex = null
        pageInfo.startY = null
        pageInfo.selectedIndex = null
        pageInfo.startIndex = null
        pageInfo.scrollY = true
        // 隐藏movableView
        let movableViewInfo = this.data.movableViewInfo
        movableViewInfo.showClass = 'none'
        this.setData({
            pageInfo: pageInfo,
            movableViewInfo: movableViewInfo
        })
    },

    //判断顺序是否改变
    verdictPaymentSequence() {
        let dataArr = this.data.optionList;
        let updateArr = [];
        for (let i = 0; i < dataArr.length; i++) {
            let sign_sequence = i;
            let id = dataArr[i].id;
            let sign_type = dataArr[i].sign_type;
            let item = {
                id: id,
                sign_sequence: sign_sequence,
                sign_type: sign_type
            }
            updateArr.push(item);
        }
        const params = updateArr;
        for (let j = 0; j < dataArr.length; j++) {
            if (dataArr[j].sign_sequence != updateArr[j].sign_sequence) {
                this.updatePaymentSequence(params);
            }
        }
    },

    //修改顺序
    updatePaymentSequence(params) {
        showLoading("正在保存...");
        getHttpPost(paymentApi.updatePayment, params, res => {
                hideLoading();
            },
            fail => {
                hideLoading();
                showToast(fail.msg);
            }
        );
    },

});