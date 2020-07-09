import { ajax } from "../utils/request.js";

// 卡Bin查询
export const checkCardBin = data => {
    return ajax({
        url: "/pay/channels/ap_xl_spd/account_issuers/accounts",
        method: "post",
        data
    });
};

// 签约短信
export const sendMsgICBC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_icbc_wallet/accounts",
        method: "post",
        data
    });
};

// 签约短信2
export const sendMsgCommon = data => {
    return ajax({
        url: "/ds/sms/mobile",
        method: "post",
        data
    });
};

// 签约短信验证
export const msgValidICBC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_icbc_wallet/accounts/valid",
        method: "post",
        data
    });
};

// 签约短信验证2
export const msgValidCommon = data => {
    return ajax({
        url: "/ds/sms/valid/mobile/code",
        method: "post",
        data
    });
};

// 银行卡签约
export const signApply = data => {
    return ajax({
        url: "/pay/channels/channelCode/subChannel/platform/accounts",
        method: "post",
        data
    });
};

// 二类户签约
export const signSecondApplyICBC = data => {
    return ajax({
        url: "/sign/second_account",

        method: "post",
        data
    });
};

// 获取银行列表
export const getBankList = () => {
    return ajax({
        url: "/product/truckobu/bank/list",
        method: "post",
    });
};

// 工行二类户查询
export const signSecondQueryICBC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_icbc_wallet/truck_obu_etc/accounts/query",
        method: "post",
        data
    });
};

// 工行二类户充值
export const secondChargeICBC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_icbc_wallet/truck_obu_etc/accounts/dependMerchantsCode/recharge",
        method: "post",
        data
    });
};

// 成功开户结果通知
export const signedNotice = data => {
    return ajax({
        url: "/product/mybank/common/open_account/result/notice",
        method: "post",
        data
    });
};

// 签约账户查询
export const signQuery = data => {
    return ajax({
        url: "/pay/accounts",
        method: "post",
        data
    });
};
// 根据编号查询签约账户
export const signQueryById = data => {
    return ajax({
        url: "/pay/accounts",
        method: "post",
        data
    });
};

//2.4.获取签约账户（根据签约编号）
export const queryById = data => {
    return ajax({
        url: "/pay/accounts/signedId",
        method: "post",
        data
    });
};
// 启用签约账户
export const enableAccount = data => {
    return ajax({
        url: "/pay/accounts/enable",
        method: "post",
        data
    });
};

// 禁用签约账户
export const disableAccount = data => {
    return ajax({
        url: "/pay/accounts/disabled",
        method: "post",
        data
    });
};

// 农行二类户短信验证码发送(合并查询)
export const sendMsgABC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_abc_wallet/accounts",
        method: "post",
        data
    });
};

// 农行二类户短信验证码发送(合并查询)
export const signSecondQueryABC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_abc_wallet/accounts",
        method: "post",
        data
    });
};

// 农行二类户图片上传
export const uploadABC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_abc_wallet/Photo",
        method: "post",
        data
    });
};

// 农行二类户短信验证码验证
export const msgValidABC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_abc_wallet/accounts/valid",
        method: "post",
        data
    });
};

// 农行二类户充值
export const secondChargeABC = data => {
    return ajax({
        url: "/pay/channels/ap_xl_abc_wallet/truck_obu_etc/accounts/dependMerchantsCode/recharge",
        method: "post",
        data
    });
};

// 农行一类户签约四要素验证
export const signCheckABC = data => {
    return ajax({
        url: "/channels/apxl_trade/ap_xl_abc_wallet/ABC_TRUCK/MINI/accounts",
        method: "post",
        data
    });
};

// 二类户签约
export const signSecondApplyABC = data => {
    return ajax({
        url: "/pay/channels/channelCode/subChannel/platform/accounts",
        method: "post",
        data
    });
};


//建行二类户签约接口  2019-11-28

//2.10.1.建设银行账号开户发送短信验证码
export const accountsCCB = data => {
    return ajax({
        url: "/pay/channels/ap_xl_ccb_second_account/accounts",
        method: "post",
        data
    });
};

//2.10.2建设银行账号开户-鉴权结果查询
export const signedCCB = data => {
    return ajax({
        url: "/pay/channels/ap_xl_ccb_second_account/accounts/signed/result/signed",
        method: "post",
        data
    });
};

//2.10.3.建设银行账号开户

export const openCCB = data => {
    return ajax({
        url: "/pay/channels/ap_xl_ccb_second_account/accounts/open/signed",
        method: "post",
        data
    });
};

// 2.10.4.建设银行账号开户查询
export const resultOpenCCB = data => {
    return ajax({
        url: "/pay/channels/ap_xl_ccb_second_account/accounts/result/signed",
        method: "post",
        data
    });
};

// 解绑银行卡
export const unbindCard = data => {
    return ajax({
        url: "/pay/channels/mybank/channelCode/subChannel/platform/accounts/replace",
        method: "post",
        data
    });
};