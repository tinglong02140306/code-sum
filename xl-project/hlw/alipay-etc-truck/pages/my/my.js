import { hideLoading, showLoading, showTitledAlert, showToast } from "../../utils/util";
import APIs from "../../apis/index";

const app = getApp();
let interval = "";
Page({
    data: {
        name: "",
        avatar: "",
        user_id: "",
        modalOpened21: false,
        weekActive: true,
        dayActive: false,
        intentionProduct: "",
        signed_id: "",
        consume_sort: "",
        weekday: "",
        week_day: "",
        day_id: "",
        week_id: ""
    },
    openModa21() {
        this.setData({
            modalOpened21: true,
        });
    },
    onModalClose21() {
        this.setData({
            modalOpened21: false,
        });
    },
    week(e) {
        const idx = e.currentTarget.dataset.idx;
        this.setData({ weekday: idx });
        if (idx == "week") {
            this.setData({ weekActive: true });
            this.setData({ dayActive: false });
        } else {
            this.setData({ weekActive: false });
            this.setData({ dayActive: true });
        }
    },
    onModalClick21() {
        this.setData({
            modalOpened21: false,
        });
        if (this.data.weekday == "week") {
            let consume_sort_1 = parseInt(`${this.data.week_day}`) + 1;
            let parem = {
                signed_id: this.data.week_id,
                consume_sort: consume_sort_1
            };
            APIs.sort(parem).then((res) => {
                this.setData({ week_day: consume_sort_1 });
            }).catch(error => {
                hideLoading();
                console.log(error);
                showToast(error.message);
            });
        } else if (this.data.weekday == "day") {
            let consume_sort_2 = parseInt(`${this.data.week_day}`) + 1;
            let parem = {
                signed_id: this.data.day_id,
                consume_sort: consume_sort_2
            };
            APIs.sort(parem).then((res) => {
                this.setData({ week_day: consume_sort_2 });
            }).catch(error => {
                hideLoading();
                console.log(error);
                showToast(error.message);
            });
        }
    },
    //充值
    aboutUs() {
        my.navigateToMiniProgram({
            appId: "77700197",
            path: `pages/transIn/index?from=etcsd`,
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.error(res);
            }
        });
    },
    //提现
    install() {
        my.navigateToMiniProgram({
            appId: "77700197",
            path: `pages/transOut/index?from=etcsd`,
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.error(res);
            }
        });
    },
    bond() {
        my.navigateTo({ url: "/pages/bill/bond/bond" });
    },
    repaymentcopy() {
        my.navigateTo({ url: "/pages/index/protocol/protocol" });
    },
    mySign() {
        my.navigateTo({ url: "/pages/bill/my-list/my-list" });
    },
    // 账单管理
    billManage() {
        my.navigateTo({ url: "/pages/bill/bill-manage/bill-manage" });
    },
    //缴纳惩治金
    repayment() {
        my.navigateTo({
            url: "/pages/bill/repayment/repayment"
        });
    },
    CustomerService() {
        app.globalData.sign_str = "https://webchat.7moor.com/wapchat.html?accessId=035b3540-f479-11e9-967e-872357109e48&fromUrl=prod&urlTitle=支付宝小程序";
        my.navigateTo({
            url: "/pages/index/w-v/w-v"
        });
    },
    async onShow() {
        try {
            showLoading();
            let res;
            let sort = {
                origin: "FINANCE",
            };
            let week_day, week = [],
                day = [],
                week_id_arry = [],
                day_id_arry = [];
            res = await APIs.signQueryById(sort);
            let res0ne = res.result;
            for (var i = 0; i < res0ne.length; i++) {
                //周卡55
                if (res0ne[i].channel_code == "ap_mybank_loan_account") {
                    this.setData({ week_id: res0ne[i].signed_id });
                    week.push(res0ne[i].consume_sort);
                    // 日卡56
                } else if (res0ne[i].channel_code == "ap_mybank_second_account") {
                    day.push(res0ne[i].consume_sort);
                    this.setData({ day_id: res0ne[i].signed_id });
                } else {
                    if (res0ne[i].merchant_code == "2101") {
                        day.push(res0ne[i].consume_sort);
                        this.setData({ day_id: res0ne[i].signed_id });
                    } else if (res0ne[i].merchant_code == "2102") {
                        day.push(res0ne[i].consume_sort);
                        this.setData({ day_id: res0ne[i].signed_id });
                    } else if (res0ne[i].merchant_code == "2103") {
                        day.push(res0ne[i].consume_sort);
                        this.setData({ day_id: res0ne[i].signed_id });
                    }
                }
            }
            week.sort(function(a, b) {
                return b - a;
            });
            day.sort(function(a, b) {
                return b - a;
            });
            let weekone = parseInt(week[0]);
            let dayone = parseInt(day[0]);
            if (weekone > dayone) {
                this.setData({
                    weekActive: true,
                    dayActive: false,
                    week_day: weekone
                });
            } else if (weekone < dayone) {
                this.setData({
                    weekActive: false,
                    dayActive: true,
                    week_day: dayone
                });
            } else if (weekone == dayone) {
                this.setData({
                    weekActive: true,
                    dayActive: false,
                    week_day: weekone
                });
            }
            this.setData({ consume_sort: this.data.week_day });
            hideLoading();
        } catch (error) {
            hideLoading();
            showTitledAlert(error.message);
        }
    },
    async onLoad() {
        const { data: username } = my.getStorageSync({ key: "idName" }); //姓名
        const { data: mobile } = my.getStorageSync({ key: "mobile" }); //手机号
        const { data: avatar } = my.getStorageSync({ key: "avatar" }); //头像
        const { data: curApplyType } = my.getStorageSync({ key: "curApplyType" });
        this.setData({ name: username });
        this.setData({ user_id: mobile });
        this.setData({ avatar: avatar });
        try {
            showLoading();
            let res;
            if (curApplyType === "enterprise") {
                res = await APIs.companyInfoQuery();
            } else {
                res = await APIs.customerQuery();
            }
            let result = res.result;
            this.setData({ intentionProduct: result.intention_product });
            this.setData({ signed_id: result.signed_id });
            hideLoading();
        } catch (error) {
            hideLoading();
            showTitledAlert(error.message);
        }
    }
});