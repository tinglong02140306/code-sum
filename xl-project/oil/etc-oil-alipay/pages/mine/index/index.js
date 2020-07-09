// pages/mine/test/test.js
import { OPENID } from '../../../constants/global';
import { MineDefaultHead, MineNext, MineShareH, MineOrdersH, MineContactH, MineInvoicesH, MineEtcAdd } from '../../../assets/url/url';
const DEFAULT_PAGE = 0;
import { formatSpaceId, formatSpacePlate, trim } from "../../../utils/util";
import { showLoading, hideLoading, showToast } from "../../../utils/my";
import { getHttpPost, getPostPromise } from "../../../http/http";
import { etcApi, userApi } from "../../../http/api";
const app = getApp();
const obj = {
    bind_status: true,
    car_plate_color: '',
    car_plate_no: "",
    etc_card_no: "",
    etc_card_no_str: "",
    is_enough: true
}
const cardHeightBig = 'height:260rpx';
const cardHeightSmall = 'height:230rpx';
let timeOut = null;
Page({

    currentView: DEFAULT_PAGE,
    /**
     * 页面的初始数据
     */
    data: {
        navigationBarHeight: 40,
        isIphoneX: false,
        openid: '',
        iconDefaultHead: MineDefaultHead,
        iconNext: MineNext,  // 无用
        iconOrders: MineOrdersH,
        iconInvoices: MineInvoicesH,
        iconEtcAdd: MineEtcAdd,
        iconContact: MineContactH,
        iconShare: MineShareH,
        unusedCouponCount: 0, //未用券数量
        accountBalance: '0.00', //加油金余额
        paymentWayCount: 0, //支付方式
        toView: `card_${DEFAULT_PAGE}`,
        cardList: [], //ETC列表
        isCardEmpty: true, //ETC列表为空
        isEnough: false, //是否满5张ETC
        isEtcRefresh: false, //刷新ETC列表
        isRefresh: false, //个人信息
        showPop: false, //弹层
        clickType: 1, //1:解绑2：启用 3：停用
        cardHeight: 'height:260rpx',
        avatar: '',
        nickName: '',
        scrollItemWidth: 326,
        curToViewIndex: 0,
        updateScrollFlag: false,
        delayFlag: false

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.dealStyleData();
        const openid = my.getStorageSync({ key: OPENID }).data;
        this.setData({
            openid: openid
        });
        if (openid) {
            this.getAllInfo();
            const avatar = my.getStorageSync({ key: 'avatar' }).data;
            const nickName = my.getStorageSync({ key: 'nickName' }).data;
            console.log('onShow', avatar, nickName);
            this.setData({
                openid: openid,
                avatar: avatar,
                nickName: nickName
            });
            setTimeout(()=> {
                this.setData({
                    delayFlag: true
                })
            },2000)
        } else {
            this.setData({
                isCardEmpty: true,
                unusedCouponCount: 0, //未用券数量
                accountBalance: '0.00', //加油金余额
                paymentWayCount: 0, //支付方式
            });
        }
    },
    /**
     * 获取个人中心页面所有网络数据
     */
    getAllInfo() {
        // showLoading("正在加载中...");
        this.getCardData();
        this.getUserData();
    },
    dealStyleData() {
        const { isIphoneX, navigationBarHeight } = app.globalData;
        this.setData({
            isIphoneX: isIphoneX,
            navigationBarHeight: navigationBarHeight + 40
        });
        my.createSelectorQuery().select('#scrollContent').boundingClientRect().exec((rect) => {
        console.log('enter touchEnd');
            console.log('rect::', rect[0])
            if (rect && rect[0]) {
                this.setData({
                    scrollItemWidth: rect[0].width
                });
            }
        });
    },
    onGetAuthorize() {
        my.getOpenUserInfo({
            success: res => {
                let result = JSON.parse(res.response).response;
                console.log('avatar-nickName',JSON.stringify(result))
                // my.alert({
                //     content: JSON.stringify(result)
                // });
                my.setStorageSync({ key: 'avatar', data: result.avatar });
                my.setStorageSync({ key: 'nickName', data: result.nickName });
                my.navigateTo({
                    url: `/pages/login/login?type=mine`
                });
            },
            fail: err => {
                showToast("请授权小程序获取您的基本信息");
            }
        });
    },

    /**
     * 切换账号
     */
    onChangeUserClick(source) {
        const { openid } = this.data;
        //已登录状态 切换账号
        if (openid) {
            my.confirm({
                title: '切换账号',
                content: '确定要切换账号吗？',
                success: (res) => {
                    if (res.confirm) {
                        my.setStorageSync({ key: OPENID,data: ''});
                        my.setStorageSync({ key: 'avatar',data: ''});
                        my.setStorageSync({ key: 'nickName',data: ''});
                        this.setData({
                            openid: "",
                            isCardEmpty: true,
                            unusedCouponCount: 0, //未用券数量
                            accountBalance: '0.00', //加油金余额
                            paymentWayCount: 0, //支付方式
                            avatar: '',
                            nickName: '',
                        });
                    }
                }
            });
        } else { //未登录状态 登录
            my.navigateTo({
                url: `/pages/login/login?type=mine`
            });
        }
    },

    //处理登录逻辑
    dealLogin() {
        const openid = my.getStorageSync({
            key: OPENID
        }).data;
        this.setData({
            openid: openid
        });
        if(!openid) {
            my.navigateTo({
                url: `/pages/login/login?type=mine`
            });
            return false;
        } else {
            this.getAllInfo();
            return true;
        }
        
    },
    //券包购买
    goBuyClick() {
        if(!this.dealLogin()) return;
        my.navigateTo({
            url: '/pages/mine/ticket-buy/list/list'
        });
    },

    //添加ETC卡
    onEtcAddClick() {
        if(!this.dealLogin()) return;
        my.navigateTo({
            url: '/pages/mine/etc/bind/bind'
        });
    },

    //优惠券
    onCouponsClick(e) {
        if(!this.dealLogin()) return;
        my.navigateTo({
            url: '/pages/mine/coupons/list/list'
        });
    },

    //加油金
    onCargoClick(e) {
        if(!this.dealLogin()) return;
        my.navigateTo({
            url: '/pages/mine/gold/list/list'
        });
    },

    //支付管理
    onPaysClick() {
        if(!this.dealLogin()) return;
        my.navigateTo({
            url: '/pages/mine/pay/list/list'
        });
    },
    //我的订单
    onOrdersClick() {
        if(!this.dealLogin()) return;
        my.navigateTo({
            url: '/pages/mine/order/list/list'
        });
    },

    //发票抬头管理
    onInvoicesClick() {
        if(!this.dealLogin()) return;
        my.navigateTo({
            url: '/pages/mine/invoice/index/index'
        });
    },
    // 获取 popup组件实例
    popupRef(ref) {
        this.popUp = ref;
    },
    // etc卡点击
    onETCItemClick(item) {
        this.setData({
            showPop: true,
            clickType: 1,
        })
        this.popUp.fadeIn(true);
        this.setData({
            etc_card_no: item.etc_card_no,
        })
    },
    //启用停用
    statusChange(item) {
        this.popUp.fadeIn(true);
        this.setData({
            showPop: true,
            etc_card_no: item.etc_card_no,
            clickType: item.enabled ? 3 : 2,
        });
    },
    //弹框
    onPopClick() {
        const {
            clickType
        } = this.data;
        if (clickType === 1) {
            this.onUnbindClick(()=>{ 
                this.popUp.fadeOut(true)
            });
        } else {
            this.etcChangeStatus(()=>{ 
                this.popUp.fadeOut(true)
            });
        }
    },
    //取消弹框
    onCancelClick() {
        this.setData({
            showPop: false
        });
        this.popUp.fadeOut(true)
    },
    //ETC列表滚动监听
    onScroll(e) {
        if(this.data.updateScrollFlag) {
            const {scrollLeft, scrollTop, scrollHeight, scrollWidth } = e.detail;
            const {scrollItemWidth, cardList} = this.data;
            let bal = scrollLeft % scrollItemWidth,
                comp = scrollItemWidth / 2,
                num = scrollLeft / scrollItemWidth;
            this.setData({
                curToViewIndex: bal >= comp ? Math.ceil(num) : Math.floor(num)
            });
            clearTimeout(timeOut)
            timeOut = setTimeout(()=> {
                this.setData({
                    updateScrollFlag: false
                });
                this.dealScrollHeight();
            },100)
        }
    },
    // ETC列表开始滑动
    touchStart(e) {
        console.log('enter touchStart');
        this.setData({
            updateScrollFlag: false
        });
    },
    touchEnd() {
        this.setData({
            updateScrollFlag: true
        })
        timeOut = setTimeout(()=> {
            this.dealScrollHeight();
        },20)
    },
    dealScrollHeight() {
        const {cardList} = this.data;
        cardList.map((item, index) => {
            item.cardHeight = index == this.data.curToViewIndex ? cardHeightBig : cardHeightSmall;
            this.setData({
                cardHeight: this.data.curToViewIndex == cardList.length ? cardHeightBig : cardHeightSmall
            })
            return item;
        })
        this.setData({
            toView: `card_${this.data.curToViewIndex}`,
            cardList: cardList
        });
    },
    //解绑ETC
    onUnbindClick(callback) {
        let that = this;
        my.confirm({
            title: '提示',
            content: '确定要解绑此卡吗？',
            confirmColor: '#cf3046',
            success(res) {
                if (res.confirm) {
                    that.etcUnbind(callback);
                }
            }
        });
    },
    //解绑请求
    etcUnbind(callback) {
        const params = {
            etc_card_no: trim(this.data.etc_card_no),
        };
        showLoading("正在解绑...");
        getHttpPost(etcApi.unbind, params, res => {
            if (res.result_code === "00000") {
                hideLoading();
                showToast("解绑成功");
                this.setData({
                    showPop: false
                })
                this.getCardData();
                // 显示tabBar 执行动画效果
                callback && callback();
            } else {
                hideLoading();
                showToast(res.msg);
            }
        }, fail => {
            hideLoading();
            showToast(fail.msg);
        })
    },
    //ETC启停用
    etcChangeStatus(callback) {
        const params = {
            etc_card_no: trim(this.data.etc_card_no),
            enabled: this.data.clickType === 2 ? true : false,
        };
        showLoading(this.data.clickType === 2 ? '正在启用...' : '正在停用...');
        getHttpPost(etcApi.changeStatus, params, res => {
            if (res.result_code === "00000") {
                hideLoading();
                showToast(this.data.clickType === 2 ? '启用成功' : '已停用');
                this.setData({
                    showPop: false
                });
                // 显示tabBar 执行动画效果
                callback && callback();
                this.getCardData();
            } else {
                hideLoading();
                showToast(res.msg);

            }
        }, fail => {
            hideLoading();
            showToast(fail.msg);
        })
    },
    //获取用户信息
    getUserData() {
        getHttpPost(userApi.userInfo, {}, res => {
            hideLoading();
            this.setData({
                isRefresh: false,
            });
            if (res.result_code === "00000") {
                this.setData({
                    unusedCouponCount: res.unused_coupon_count,
                    accountBalance: res.account_balance ? res.account_balance : 0.00,
                    paymentWayCount: res.payment_way_count ? res.payment_way_count : 0,
                })
            } else {
                hideLoading();
                showToast(res.result_msg);
            }
        }, fail => {
            hideLoading();
            showToast(fail.msg);
        })
    },
    // 处理etc列表数据
    dealCardData(data) {
        if (data && data.length) {
            let list = [];
            list = data.filter((item, index) => {
                item.etc_card_no_str = formatSpaceId(item.etc_card_no);
                item.is_enough = false;
                item.is_click = false;
                index === 0 && this.setData({cardHeight: cardHeightSmall});
                item.cardHeight = index === 0 ? cardHeightBig : cardHeightSmall;
                return item;
            });
            let arr = list;
            this.setData({
                isEnough: list.length < 5 ? true : false,
                isCardEmpty: false,
                cardList: arr,
                status: 0,
                toView: `card_${DEFAULT_PAGE}`
            });
            console.log('list', list);
        } else {
            this.setData({
                isCardEmpty: true,
                status: 1,
            });
        }

    },

    //获取etc列表
    getCardData() {
        // TODO
        // let list =[{
        //     "enabled": true,
        //     "car_plate_color": 0,
        //     "car_plate_no": "鲁A11111",
        //     "etc_card_no": "37012222222222222222",
        // }];
        // ,{
        //     "enabled": true,
        //     "car_plate_color": 0,
        //     "car_plate_no": "鲁A12345",
        //     "etc_card_no": "37012222222222229999",
        // },{
        //     "enabled": true,
        //     "car_plate_color": 0,
        //     "car_plate_no": "鲁A789654",
        //     "etc_card_no": "37012222222222220000",
        // },{
        //     "enabled": true,
        //     "car_plate_color": 0,
        //     "car_plate_no": "鲁A46859",
        //     "etc_card_no": "3701222222222221234",
        // }
        // this.dealCardData(list);
        // return;
        
        getHttpPost(etcApi.query, {}, res => {
            hideLoading();
            if (res.result_code === "00000") {
                this.dealCardData(res.data);
            } else {
                hideLoading();
                showToast(res.result_msg);
            }
        }, fail => {
            hideLoading();
            showToast(fail.msg);
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