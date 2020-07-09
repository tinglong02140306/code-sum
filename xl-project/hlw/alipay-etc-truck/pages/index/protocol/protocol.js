import { hideLoading, showLoading, showTitledAlert, showToast } from "../../../utils/util";
import APIs from "../../../apis/index";

const app = getApp();
Page({
    data: {
        icbc: false,
        ccb: false,
        abc: false,
        wsBank: false,
        account: "",
        week: false,
        creditlimit: "", // 授信额度
        isShowBindBtn: false
    },
    // 换绑银行卡
    changeCard(e) {
        my.navigateTo({ url: `/pages/index/change-card/change-card?type=${e.target.dataset.type}` });
    },
    // 跳转到网商银行 查看授信额度
    jumpNetPage() {
        my.navigateToMiniProgram({
            appId: "77700207",
            path: "pages/home/index",
            success: res => {},
            fail: res => {}
        });
    },
    // 银行卡截断
    cutBankCardNo(account) {
        return account.substring(account.length - 4, account.length);
    },
    async onShow() {
        // 测试  待删
        // this.setData({ icbc: true, ccb: true, abc: true, wsBank: true });
        try {
            showLoading();
            let res,
                result;
            res = await APIs.signQueryById({
                origin: "FINANCE",
            });
            result = res.result;
            for (var i = 0; i < result.length; i++) {
                let channelCode = result[i].channel_code,
                    merchantCode = result[i].merchant_code;
                if (result[i].state == "ENABLED") {
                    // ap_mybank_second_account 网商二类户
                    // ap_mybank_loan_account // 网商周结卡
                    if (channelCode == "ap_mybank_second_account") { // 网商
                        this.setData({ wsBank: true })
                    } else if (channelCode == "apxl_trade") {
                        if (merchantCode == "2101") { // 工商
                            this.setData({ icbc: true });
                        } else if (merchantCode == "2102") { // 农行
                            this.setData({ abc: true });
                        } else if (merchantCode == "2103") { // 建设
                            this.setData({ ccb: true });
                        }
                        this.setData({ account: this.cutBankCardNo(result[i].account) })
                    }
                }

            }
            console.log(this.data, "longting1")
            const { data: curApplyType } = my.getStorageSync({ key: "curApplyType" });
            // 个人信息查询 -- 判断用户是否是周结用户 55: 周结 56：日结
            let infos,
                results,
                weekpay;
            if (curApplyType === "enterprise") {
                infos = await APIs.companyInfoQuery();
            } else {
                infos = await APIs.customerQuery();
            }
            results = infos.result;
            // 55 – 周结  61 – 新周结 65 - 新疆周结 70-天津周结 78-内蒙周结  82-云南网商周结  84-河北网商周结  86-广西网商周结  91-广东网商周结 
            weekpay = ['55', '61', '65', '70', '78', '82', '84', '86', '91'];
            this.setData({
                week: weekpay.indexOf(results.intention_product) != -1 ? true : false,
                creditlimit: results.creditlimit == null ? 0 : Number(results.creditlimit).toFixed(2),
                isShowBindBtn: curApplyType === "enterprise" ? false : true
            });
            hideLoading();
        } catch (error) {
            hideLoading();
            showTitledAlert(error.message);
        }
    }
});