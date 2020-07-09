import { hideLoading, showConfirm, showLoading, showTitledAlert, showToast, trimAll } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();

Page({
    data: {
        current: "week",
        showWeekDetail: false,
        showDayDetail: false,
        signed_id: "",
        consume_sort: '100',
        signed_id: "",
        consume_sort: '',
        weekday: "",
        week_day: '',
        day_id: '',
        week_id: '',
        creditLimit: '',
        target: ''
    },
    next() {
        if (this.data.weekday == "week") {
            let consume_sort_1 = parseInt(`${this.data.week_day}`) + 1;
            console.log(consume_sort_1, 25)
            console.log(consume_sort_1, 52)
            let parem = {
                signed_id: this.data.week_id,
                consume_sort: consume_sort_1
            }
            console.log(parem, 53)
            APIs.sort(parem).then((res) => {
                this.setData({ week_day: consume_sort_1 })
                console.log(res, 56)
                console.log("123")
                my.reLaunch({ url: "/pages/my/my" });
            }).catch(error => {
                hideLoading();
                console.log(error);
                showToast(error.message);
            });
        } else if (this.data.weekday == "day") {
            console.log(this.data.week_day, 67)
            let consume_sort_2 = parseInt(`${this.data.week_day}`) + 1;
            console.log(consume_sort_2, 25)
            console.log(consume_sort_2, 68)
            let parem = {
                signed_id: this.data.day_id,
                consume_sort: consume_sort_2
            }
            console.log(parem, 53)
            APIs.sort(parem).then((res) => {
                this.setData({ week_day: consume_sort_2 })
                console.log(res, 56)
                console.log("123")
                my.reLaunch({ url: "/pages/my/my" });
            }).catch(error => {
                hideLoading();
                console.log(error);
                showToast(error.message);
            });
        } else {
            my.reLaunch({ url: "/pages/my/my" });
        }

    },
    change(e) {
        const idx = e.currentTarget.dataset.idx;
        this.setData({ weekday: idx })
        if (idx == "week") {
            this.setData({ current: "week" })
        } else {
            this.setData({ current: "day" })
        }
    },
    onModalClick() {
        this.setData({ showWeekDetail: false, showDayDetail: false });
    },
    showDetail(e) {
        const idx = e.currentTarget.dataset.idx;
        idx === "week" ? this.setData({ showWeekDetail: true }) : this.setData({ showDayDetail: true });
    },
    async onLoad(options) {
        let { result } = await APIs.customerQuery();
        console.log(result, 123)
        this.setData({ intentionProduct: result.intention_product })
        this.setData({ signed_id: result.signed_id })
        const target = options.target;
        if (target) {
            this.setData({ target: target });
            console.log(this.data.target)
            if (this.data.target == "day") {
                this.setData({ current: "day" })
            }
            console.log(this.data.target, 87)
        }
        let sort = {
            // merchant_code: "2001",
            origin: "FINANCE",
        }
        let week_day;
        let week = [];
        let day = [];
        let week_id_arry = [];
        let day_id_arry = [];
        APIs.signQueryById(sort).then((res) => {
            console.log(res, 132)
            let res0ne = res.result;
            console.log(res0ne, 106)
                //   if(res0ne){
            for (var i = 0; i < res0ne.length; i++) {
                console.log(res0ne[i].channel_code, 135)
                if (res0ne[i].state == "ENABLED") {
                    //周卡55
                    if (res0ne[i].channel_code == "ap_mybank_loan_account") {
                        this.setData({ week_id: res0ne[i].signed_id })
                        week.push(res0ne[i].consume_sort)
                        console.log(this.data.week_id, 173)
                            // 日卡56
                    } else if (res0ne[i].channel_code == "ap_mybank_second_account") {
                        day.push(res0ne[i].consume_sort)
                        this.setData({ day_id: res0ne[i].signed_id })
                        console.log(this.data.day_id, 174)
                    } else {
                        if (res0ne[i].merchant_code == "2101") {
                            console.log(176)
                            day.push(res0ne[i].consume_sort)
                            this.setData({ day_id: res0ne[i].signed_id })
                        } else if (res0ne[i].merchant_code == "2102") {
                            console.log(201)
                            day.push(res0ne[i].consume_sort)
                            this.setData({ day_id: res0ne[i].signed_id })
                        } else if (res0ne[i].merchant_code == "2103") {
                            day.push(res0ne[i].consume_sort)
                            this.setData({ day_id: res0ne[i].signed_id })
                        }
                    }
                    console.log(res0ne[i])
                }
            };
            console.log(week, day, 142)
            week.sort(function(a, b) {
                return b - a;
            })
            day.sort(function(a, b) {
                return b - a;
            })
            console.log(week[0], day[0], 132)
            let weekone = parseInt(week[0]);
            let dayone = parseInt(day[0]);
            console.log(weekone, dayone, 100)
            console.log(1111)
            if (weekone > dayone) {
                console.log("133")
                this.setData({
                    current: "week",
                    week_day: weekone
                })
                return;
            } else if (weekone < dayone) {
                console.log("140")
                this.setData({
                    current: "day",
                    week_day: dayone
                })
                return;
            } else if (weekone == dayone) {
                this.setData({
                    current: "week",
                    week_day: dayone
                })
                console.log(this.data.week_day, 152)
                return;
            }
            this.setData({ consume_sort: this.data.week_day })
                // }
        }).catch(error => {
            hideLoading();
            console.log(error, 160)
            showToast(error.message);
        });

        //透支额 
    },
    async onShow() {
        APIs.customerQuery().then((res) => {

            let pamrm = {
                    serialno: res.result.serialno
                }
                //透传额度
            APIs.creditQuery(pamrm).then((res) => {
                console.log(res.result.credit_result, 39)
                if (res.result.credit_result == "ACCEPTED") {
                    this.setData({ creditLimit: res.result.credit_limit })
                }
            }).catch(error => {
                hideLoading();
                console.log(error);
                showToast(error.message);
            });
        }).catch(error => {
            hideLoading();
            console.log(error);
            showToast(error.message);
        });

    }

});