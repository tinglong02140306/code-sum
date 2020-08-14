// pages/stations/clean/clean-doing/clean-doing.js
import { OPENID } from "../../../../constants/global";
import { getHttpPost } from "../../../../http/http";
import { cleanApi } from "../../../../http/api";
import { getCurrentDataTime, getDifferenceTime } from "../../../../utils/util";
import { showLoading, hideLoading, showToast } from "../../../../utils/my";
const app = getApp();
let params = null;
let washerTimer = null; //获取洗车机状态的定时任务
let setTimer = null; //洗车计时定时任务
let stopTimer = null; //洗车8分钟停止任务
const topHeight = 60;
let translateY = 250;
let originTranslateY = 250;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        stopTime: 480000, //洗车8分钟
        cleanTime: '08:00',
        hours: '00', // 时
        minute: '00', // 分
        second: '00', // 秒
        count: 0,
        animationData: {},
        washer_id: '',
        order_no: '',
        isFinish: false,
        rangeHeight: '80px',
        isCanStop: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // this.isCanStop({washer_id: '18'});
        try {
            this.dealStyleData();
            params = JSON.parse(decodeURIComponent(options.params));
            this.setData({
                details: params,
                washer_id: params.washer_id,
                order_no: params.order_no,
                start_time: params.start_time,
            });
            // 查询洗车机有没有 停止的功能
            this.isCanStop({washer_id: params.washer_id});
            if (params.start_time) {
                this.computationTime(params.start_time);
            } else {
                this.getSetTimer();
                setTimeout(()=> {
                    this.getWasherTimer();
                },10000)
            }
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
        my.setStorageSync({ key: 'cleaning', data: "1"})
        const openid = my.getStorageSync({ key: OPENID }).data;
        this.setData({
            openid: openid
        });
        this.getOrder();
    },
    onUnload() {
        my.navigateTo({
            url: `/pages/stations/index/index`
        });
        clearInterval(washerTimer);
        washerTimer = null;
        clearInterval(setTimer);
        setTimer = null;
        clearInterval(stopTimer);
        stopTimer = null;
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    dealStyleData() {
        var textHeight = 0,
            bgHeight = 0;
        my.createSelectorQuery().select('#reference').boundingClientRect().exec((rect) => {
            if (rect && rect[0]) {
                textHeight = rect[0].height;
                console.log(rect[0].height)
                my.createSelectorQuery().select('#bg').boundingClientRect().exec((rect) => {
                    if (rect && rect[0]) {
                        bgHeight = rect[0].height;
                    }
                    console.log(rect[0].height)
                    const resHeight = textHeight + Math.ceil(bgHeight * 0.07) + 1;
                    this.setData({
                        rangeHeight: `${resHeight}px` 
                    });
                    originTranslateY = translateY = Math.ceil(bgHeight * 0.85) - 2;
                    console.log('translateY', translateY)
                });

            }
        });
    },
    // 查询洗车机能否立即停止
    isCanStop(params) {
        getHttpPost(cleanApi.queryCanStop, params, res => {
            console.log(res)
            hideLoading();
            if (res.result_code === "00000") {
                this.setData({
                    isCanStop: res.can_stop ? true : false,
                    tel: res.tel
                })
            }
        }, err => {
            hideLoading();
            showToast(err.msg);
        });

    },
    onConfirmClick() {
        let that = this,
            tel = this.data.tel;
        if(!this.data.isCanStop) {
            my.makePhoneCall({ number: tel ? tel : "4008609599" });
        } else {
            my.confirm({
                title: '提示',
                content: '确定要停止洗车机吗？',
                confirmColor: '#05BA7D',
                success(res) {
                    if (!that.data.isFinish && res.confirm) {
                        that.stopWasher();
                    }
                }
            });
        }
        
    },

    onBackClick() {
        const pages = getCurrentPages();
        if (pages.length >= 2) {
            const prePage = pages[pages.length - 2];
            if (prePage.route == "pages/stations/clean/clean-notice/clean-notice") { //订单界面
                my.navigateBack({
                    delta: 3
                })
            } else if (prePage.route == "pages/stations/clean/park-confirm/park-confirm") { //停车确认界面界面
                my.navigateBack();
            }
        }
    },

    //计算已经洗车时间
    computationTime(start_time) {
        const {
            washer_id,
            order_no
        } = this.data;
        let alreadyTime = getDifferenceTime(start_time, getCurrentDataTime());
        console.log('当前时间' + getCurrentDataTime())
        console.log('start_time' + start_time)
        console.log('alreadyTime' + alreadyTime)
        if (alreadyTime[0] || alreadyTime[1] || alreadyTime[2] || alreadyTime[3] || alreadyTime[4] > 7) {
            //超过8分钟
            const resData = {
                washer_id: washer_id,
                order_no: order_no,
                status: '01',
            }
            this.removeCache();
            const details = encodeURIComponent(JSON.stringify(resData));
            my.navigateTo({
                url: `/pages/stations/clean/clean-result/clean-result?params=${details}`
            });
        } else {
            //8分钟以内 还在洗车
            this.setData({
                hours: alreadyTime[3], // 时
                minute: alreadyTime[4] < 10 ? '0' + alreadyTime[4] : alreadyTime[4], // 分
                second: alreadyTime[5] < 10 ? '0' + alreadyTime[5] : alreadyTime[5], // 秒
                stopTime: 480000 - alreadyTime[4] * 60 * 1000 - alreadyTime[4] * 1000,
            })
            this.getSetTimer();
            setTimeout(()=> {
                this.getWasherTimer();
            },10000)
            
        }
    },
    

    /**
     * 每3s获取一次洗车状态
     */
    getWasherTimer() {
        // this.onCleanCheck();
        washerTimer && clearInterval(washerTimer);
        washerTimer = null;
        washerTimer = setInterval(() => {
            this.onCleanCheck();
        }, 3000);
    },

    /**
     * 洗车-8分钟计时
     */
    getSetTimer() {
        const {
            washer_id,
            order_no
        } = this.data;
        this.setInterval();
        stopTimer && clearInterval(stopTimer);
        stopTimer = null;
        stopTimer = setTimeout(() => {
            // 8分钟计时完成
            clearInterval(washerTimer);
            washerTimer = null;
            clearInterval(stopTimer);
            stopTimer = null;
            clearInterval(stopTimer);
            stopTimer = null;
            const resData = {
                washer_id: washer_id,
                order_no: order_no,
                status: '01',
            }
            this.removeCache();
            const details = encodeURIComponent(JSON.stringify(resData));
            my.navigateTo({
                url: `/pages/stations/clean/clean-result/clean-result?params=${details}`
            });
        }, this.data.stopTime);
    },

    //检查洗车机状态
    onCleanCheck() {
        const {
            washer_id,
            order_no
        } = this.data;
        const paramsData = {
            washer_id: washer_id,
        }
        getHttpPost(cleanApi.check, paramsData, res => {
            hideLoading();
            // if (res.result_code === "00000") {
            if (res.washer_status != 2) {
                this.setData({
                    isFinish: true
                });
                clearInterval(washerTimer);
                washerTimer = null;
                clearInterval(setTimer);
                setTimer = null;
                clearInterval(stopTimer);
                stopTimer = null;
                const resData = {
                    washer_id: washer_id,
                    order_no: order_no,
                    status: '01',
                }
                this.removeCache();
                const details = encodeURIComponent(JSON.stringify(resData));
                my.navigateTo({
                    url: `/pages/stations/clean/clean-result/clean-result?params=${details}`
                });
            }
            // }
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    //停止洗车
    stopWasher() {
        showLoading("正在停止...")
        this.setData({
            openid: my.getStorageSync({
                key: OPENID
            }).data
        });
        const {
            order_no,
            washer_id
        } = this.data;
        const paramsData = {
            order_no: order_no,
        }
        getHttpPost(cleanApi.stop, paramsData, res => {
            hideLoading();
            if (res.result_code === "00000") {
                this.setData({
                    isFinish: true
                });
                clearInterval(washerTimer);
                washerTimer = null;
                clearInterval(setTimer);
                setTimer = null;
                clearInterval(stopTimer);
                stopTimer = null;
                const resData = {
                    washer_id: washer_id,
                    order_no: order_no,
                    status: '01',
                }
                this.removeCache();
                const details = encodeURIComponent(JSON.stringify(resData));
                my.navigateTo({
                    url: `/pages/stations/clean/clean-result/clean-result?params=${details}`
                });
            } else {
                hideLoading();
                showToast(res.msg);
                const resData = {
                    washer_id: washer_id,
                    order_no: order_no,
                    status: '02',
                }
                const details = encodeURIComponent(JSON.stringify(resData));
                my.navigateTo({
                    url: `/pages/stations/clean/clean-result/clean-result?params=${details}`
                });
            }
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    //删除用户在该洗车点的订单缓存
    removeCache() {
        const {
            washer_id,
            order_no
        } = this.data;
        const paramsData = {
            washer_id: washer_id,
        }
        getHttpPost(cleanApi.removeCache, paramsData, res => {
            hideLoading();
        }, err => {
            hideLoading();
            showToast(err.msg);
        });
    },

    // 计时器
    setInterval() {
        const { rangeHeight } = this.data;
        const that = this;
        var { second, minute, hours } = that.data;
        let animationData = my.createAnimation({
            duration: 2000, // 默认为400     动画持续时间，单位ms
            timingFunction: 'ease'
        });
        setTimer = setInterval(function () { // 设置定时器
            //动画的脚本定义必须每次都重新生成，不能放在循环外
            if(second % 2 == 0) {
                if(second != 0) translateY = translateY ? 0 : originTranslateY;
                animationData.translateY(translateY).step({
                    duration: 2000
                })
                // 更新数据
                that.setData({
                    animationData: animationData.export(),
                })
            }
            second++;
            if (second >= 60) {
                second = 0 //  大于等于60秒归零
                minute++
                if (minute >= 60) {
                    minute = 0 //  大于等于60分归零
                    hours++
                    // 少于10补零
                    that.setData({
                        hours: hours < 10 ? '0' + hours : hours
                    })
                }
                // 少于10补零
                that.setData({
                    minute: minute < 10 ? '0' + minute : minute
                })
            }
            // 少于10补零
            that.setData({
                second: second < 10 ? '0' + second : second
            })
        }, 1000)
    },
    //检查用户在该洗车点的订单信息
    getOrder() {
        console.log('洗车点的订单信息' + JSON.stringify(this.data.details))
        const {
            washer_id
        } = this.data;
        const paramsData = {
            washer_id: washer_id,
        }
        getHttpPost(cleanApi.getOrder, paramsData, res => {
            if (res.result_code === "00000") {
                if (res.order_status === '1') {
                    //支付成功<=启动洗车机
                    // my.navigateBack();
                } else if (res.order_status === '2') {
                    //消费成功<=洗车中
                    // my.navigateBack();
                } else {
                    //继续执行
                    // this.onCleanCheck();
                    this.onBackClick();
                }
            }
        }, err => {
            // this.setData({isShowFar:true,})
            showToast(err.msg);
        });
    },
})