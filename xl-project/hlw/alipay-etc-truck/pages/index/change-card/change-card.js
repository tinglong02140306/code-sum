import APIs from "../../../apis/index";
import {
    showTitledAlert,
    showToast,
    trimAll,
    showLoading,
    hideLoading,
} from "../../../utils/util";

const app = getApp();
let interval = "";
Page({
    data: {
        // 姓名     王磊
        // 身份证   370126199404033436
        // 手机号   13791118203
        // 银行卡   6217856000072578866(中行)
        // 夏风鲁  371524199205101651    6228210259028435377  15634131276
        // "AccNo":"6228481849035508877","Name":"于陈炜","CustomID":"372321199302038122",
        userName: "", //姓名
        certNo: "", // 账户名
        cardNo: "", // 身份证号
        mobile: "", //手机号码
        captcha: "", // 验证码
        carType: "", // CCB ABC ICBC
        // carTypeNo: "", // 67-工商 68-农行 73-建行
        cardTypeText: "", // 卡的类型 CCB:中国建设银行 ABC:中国农业银行 ICBC:中国工商银行
        enableSmallButton: true,
        smallButtonText: "点击发送",
        // oldCardNo: "", // 发送完短信后保存一下  防止用户更改
        issuer: "", // 卡片发行方 ABC:中国农业银行  CCB: 中国建设银行  ICBC: 中国工商银行
        accountType: "", // 账户类型
        seqNo: "", // 短信流水号
        staffId: "",
        mechanismId: "",

    },
    onItemInput(e) {
        this.setData({
            [e.target.dataset.field]: e.detail.value,
        });
    },
    onClear(e) {
        this.setData({
            [e.target.dataset.field]: "",
        });
    },
    dealShowToast(msg) {
        setTimeout(() => {
            showToast(msg);
        })
    },
    checkParams(isVerifyCode) {
        if (!trimAll(this.data.cardNo)) {
            showToast("请填写银行卡号");
            return false;
        }
        console.log(this.data.cardNo.length, 155)
        if (trimAll(this.data.cardNo.length) < 14) {
            showToast("请填写正确的银行卡号");
            return false;
        }
        if (!trimAll(this.data.userName)) {
            showToast("请填写银行卡账户名");
            return false;
        }
        if (!trimAll(this.data.certNo)) {
            showToast("请填写身份证号");
            return false;
        }
        if (!(/^1\d{10}$/.test(this.data.mobile))) {
            showToast("手机号码有误，请重填");
            return;
        }
        if (!trimAll(this.data.mobile)) {
            showToast("请填写银行预留手机号");
            return false;
        }

        if (isVerifyCode) {
            if (!trimAll(this.data.captcha) || trimAll(this.data.captcha.length) != 6) {
                showToast("请填正确的验证码");
                return false;
            }
        }
        return true;
    },
    countDown() {
        this.setData({
            enableSmallButton: false,
            smallButtonText: "重新发送(60)",
        });
        let count = 60;
        interval = setInterval(() => {
            count--;
            if (count > 0) {
                this.setData({
                    smallButtonText: `重新发送(${count})`
                });
            } else {
                clearInterval(interval);
                this.setData({
                    enableSmallButton: true,
                    smallButtonText: `重新发送`,
                });
            }
        }, 1000);
    },
    // 调用通用短信
    async ABCMsgNotify() {
        try {
            if (this.data.issuer === "ABC") {
                const params = {
                    credential_code: this.data.certNo,
                    mobile: this.data.mobile,
                    username: this.data.userName,
                    account: this.data.cardNo,
                    merchant_code: "2102",
                    credential_type: "01",
                    account_type: "1"
                };
                // 农行一类户签约四要素验证   不通过后台就一直验证到通过为止
                let { result } = await APIs.signCheckABC(params);
                // console.log(typeof result, 'longting');
                // console.log(result);
                this.setData({ seqNo: result });

                // 共同部分
                hideLoading();
                // showToast("发送成功");
                this.dealShowToast("发送成功");
                // this.setData({ oldCardNo: this.data.cardNo });
                this.countDown();
            } else {
                hideLoading();
                // showToast("请输入农行银行卡号");
                this.dealShowToast("请输入农行银行卡号");
            }
        } catch (error) {
            hideLoading();
            showToast(error.message);
        }

    },
    // 调用通用短信
    async CCBMsgNotify() {
        if (this.data.issuer === "CCB") {
            await APIs.sendMsgCommon({ mobile: this.data.mobile });
            hideLoading();
            // showToast("发送成功");
            this.dealShowToast("发送成功");
            // this.setData({ oldCardNo: this.data.cardNo });
            this.countDown();
        } else {
            hideLoading();
            this.dealShowToast("请输入建设银行卡号");
            // showToast("请输入建设银行卡号");
        }
    },
    // 调用通用短信
    async ICBCMsgNotify() {
        if (this.data.issuer === "ICBC") {
            await APIs.sendMsgCommon({ mobile: this.data.mobile });
            hideLoading();
            // showToast("发送成功");
            this.dealShowToast("发送成功");
            this.setData({ oldCardNo: this.data.cardNo });
            this.countDown();
        } else {
            hideLoading();
            // showToast("请输入工商银行卡号");
            this.dealShowToast("请输入工商银行卡号");
        }
    },
    // 重置清除定时器
    delInterVal() {
        if (interval) {
            clearInterval(interval);
            this.setData({
                smallButtonText: `点击发送`,
                disableInput: false
            });
        }

    },
    // 获取解绑银行卡 参数
    getUnbindCardParams() {
        let params = {
                username: this.data.userName,
                mobile: this.data.mobile,
                account: this.data.cardNo,
                credential_code: this.data.certNo
            },
            cardType = this.data.cardType;
        if (cardType == "ABC") {
            params = Object.assign({}, params, {
                sub_channel: "ABC_TRUCK",
                merchant_code: "2102",
                credential_type: "01",
                account_type: this.data.accountType,
                seq_no: this.data.seqNo,
                verify_code: this.data.captcha
            });
        } else if (cardType == "CCB") {
            params = Object.assign({}, params, {
                sub_channel: "CCB_TRUCK",
                merchant_code: "2103"
            });

        } else if (cardType == "ICBC") {
            params = Object.assign({}, params, {
                sub_channel: "ICBC2",
                merchant_code: "2101"
            });
        }
        return params;
    },
    async sendMsg() {
        if (!this.checkParams()) {
            return;
        }
        showLoading();
        try {
            //  卡bin 查询 issuer_code： 判断当前是什么卡 农行 建设工商等,  accountType： 信用卡借记卡
            let { result } = await APIs.checkCardBin({ account: this.data.cardNo }),
                cardType = this.data.cardType;
            if (result.account_type == "1") {
                showTitledAlert("签约只支持借记卡，您当前选择的是信用卡，请重新选择银行卡");
                return;
            }
            this.setData({ issuer: result.issuer_code, accountType: result.account_type });

            // 调用通用短信
            if (cardType == "ABC") {
                this.ABCMsgNotify();
            } else if (cardType == "CCB") {
                this.CCBMsgNotify();
            } else if (cardType == "ICBC") {
                this.ICBCMsgNotify();
            }

        } catch (error) {
            hideLoading();
            showToast(error.message);
        }
    },
    // 解绑银行卡
    async unbindBankCard() {
        showLoading();
        if (!this.checkParams(true)) {
            hideLoading();
            return;
        }
        try {
            if (this.data.issuer != "ABC") await APIs.msgValidCommon({ mobile: this.data.mobile, code: this.data.captcha });
            // 解绑银行卡
            let params = this.getUnbindCardParams();
            let { msg, result } = await APIs.unbindCard(params);
            hideLoading();
            this.delInterVal();
            my.redirectTo({
                url: "/pages/my/my"
            });

        } catch (error) {
            hideLoading();
            showTitledAlert(error.message);
        }
    },
    async onLoad(options) {
        let { type } = options;
        this.setData({ cardTypeText: type == "CCB" ? "中国建设银行" : (type == "ABC" ? "中国农业银行" : "中国工商银行") });
        this.setData({ cardType: type })
        console.log(this.data.cardType, 'longting');
    },
    async onShow() {
        const { data: username } = my.getStorageSync({ key: "idName" }); //姓名
        const { data: certNo } = my.getStorageSync({ key: "idNumber" }); //身份证号
        this.setData({ userName: username });
        this.setData({ certNo: certNo });


        const channel = my.getStorageSync({ "key": "source" }) || "";
        if (channel) {
            if (channel.data == "68") {
                const staffId = app.globalData.invitecode; //工作人员编号
                const mechanismId = app.globalData.inviteorg; //机构编码
                this.setData({ staffId, mechanismId })
            }
        }
    }
});