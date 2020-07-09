// pages/stations/etc-pay/etc-pay.js
let image01 = '/assets/static/etc-pay11.png';
let image02 = '/assets/static/etc-pay12.png';
let image11 = '/assets/static/etc-pay21.png';
let image12 = '/assets/static/etc-pay22.png';
let image21 = '/assets/static/etc-pay31.png';
let image22 = '/assets/static/etc-pay32.png';
const app = getApp();
let params = null;
const animation = my.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0,
});
let timer1 = null; //定时器
let timeAll = 15; //动画总用时时间
let timeEvery = 5; //动画间隔时间
let index = 0; //当前位置
let video = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_support_no_sense: false, //是否支持无感支付
        animation_move: null,
        index: index,
        controls: false,
        pause: true,
        count: timeEvery,
        show_background: true,
        first_image: image02,
        second_image: image11,
        third_image: image21,
        url: "http://oss.etcsd.com/gas/videos/etc_wgjy.mp4",
        isIphoneX: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        video = my.createVideoContext("video");
        try {
            params = JSON.parse(decodeURIComponent(options.params));
            let support_payments = params.support_payments;
            this.setData({
                is_support_no_sense: support_payments && support_payments.includes("ETC_NO_SENSE")
            });
        } catch (error) {
            // my.switchTab({url: '/pages/home/index/index'});
        }
    },

    onShow() {
        this.dealWidth();
        this.dealStyleData();
    },
    dealStyleData() {
        this.setData({
            isIphoneX: app.globalData.isIphoneX
        })
    },
    onHide() {
        clearInterval(timer1);
        timer1 = null;
    },
    onUnload() {
        clearInterval(timer1);
        timer1 = null;
        timeAll = 15;
        timeEvery = 5;
        index = 0;
    },
    onPlay() {
        this.setData({
            controls: true,
            pause: false,
            show_background: false
        });
    },
    onPause() {
        this.setData({
            controls: false,
            pause: true
        });
    },

    onEnd() {
        this.setData({
            controls: false,
            pause: true,
            show_background: true
        });
    },
    // //播放按钮
    onPlayClick() {
        video && video.play();
        this.setData({
            controls: true,
            pause: false,
            show_background: false
        });
    },

    // //暂停播放
    onPauseClick() {
        this.setData({
            controls: false,
            pause: true
        });
    },
    //导航前往
    onNavigationClick() {
        const {
            is_support_no_sense
        } = this.data;
        if (is_support_no_sense) { //支持无感支付
            my.openLocation({
                latitude: params.latitude_tx,
                longitude: params.longitude_tx,
                name: params.name,
                address: params.address
            });
        }
    },

    dealWidth() {
        my.createSelectorQuery().select('#flow').boundingClientRect().exec((rect) => {
            if (rect && rect[0]) {
                this.dealAnimation(rect[0].width / 3);
            }
        });
    },

    //处理动画
    dealAnimation(x) {
        timer1 = setInterval(() => {
            timeAll--;
            const count = timeAll % timeEvery;
            this.setData({
                count: count == 0 ? timeEvery : count
            });
            if (timeAll >= timeEvery) {
                if (count == 0) {
                    index++;
                    this.setData({
                        index: index,
                        animation_move: animation.translateX(x * index).step().export()
                    });
                }
            } else {
                clearInterval(timer1);
                timer1 = null;
            }
        }, 1000);
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