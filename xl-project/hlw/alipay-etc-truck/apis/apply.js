import { ajax } from "../utils/request.js";

// 登录
export const login = data => {
    return ajax({
        url: "/login",
        method: "post",
        data
    });
};

// 个人信息查询
export const customerQuery = data => {
    return ajax({
        url: "/product/mybank/apply/customer/query",
        method: "post",
        data
    });
};

// 产品意向选择
export const productIntention = data => {
    return ajax({
        url: "/product/mybank/apply/product/intention",
        method: "post",
        data
    });
};

// 证件OCR
export const ocr = data => {
    return ajax({
        url: "/img/ocr",
        method: "post",
        data
    });
};

// 申请人资料提交
export const customerDataApply = data => {
    return ajax({
        url: "/product/mybank/apply/customer/data",
        method: "post",
        data
    });
};

// 查询车辆信息
export const vehicleQuery = data => {
    return ajax({
        url: "/product/common/vehicle",
        method: "post",
        data
    });
};

// 车辆证件上传
export const vehicleInfoUpload = data => {
    return ajax({
        url: "/product/common/driving/data",
        method: "post",
        data
    });
};

// 车辆信息提交
export const vehicleDataApply = data => {
    return ajax({
        url: "/product/mybank/apply/vehicle/data",
        method: "post",
        data
    });
};

// 车辆信息提交-追加车辆
export const vehicleDataApplyAppend = data => {
    return ajax({
        url: "/product/week/mybank/vehicle/data",
        method: "post",
        data
    });
};

// 车辆信息删除
export const vehicleDelete = data => {
    return ajax({
        url: "/product/mybank/apply/vehicle",
        method: "post",
        data
    });
};


// 车辆列表
export const vehicleList = data => {
    return ajax({
        url: "/product/mybank/apply/information",
        method: "post",
        data
    });
};


// 车辆追加
export const appendCar = data => {
    return ajax({
        url: "/product/week/19/vehicle/data",
        method: "post",
        data
    });
};

// 追加车辆申请
export const appendCarApply = data => {
    return ajax({
        url: "/product/week/mybank/vechile/add",
        method: "post",
        data
    });
};

// 获取用户车辆列表
export const userVehicles = data => {
    return ajax({
        url: "/product/mybank/user/vehicles",
        method: "post",
        data
    });
};

// 确认信息
export const informationConfirm = data => {
    return ajax({
        url: "/product/mybank/apply/information",
        method: "post",
        data
    });
};

// 确认信息提交
export const applySubmit = data => {
    return ajax({
        url: "/product/mybank/apply/submit",
        method: "post",
        data
    });
};

// 邮寄信息列表查询
export const addressQuery = data => {
    return ajax({
        url: "/product/common/address/query",
        method: "post",


        data
    });
};

// 邮寄信息添加
export const addressAdd = data => {
    return ajax({
        url: "/product/common/address/add",
        method: "post",
        data
    });
};

// 邮寄信息更新
export const addressUpdate = data => {
    return ajax({
        url: "/product/common/address/update",
        method: "post",
        data
    });
};

// 邮寄信息删除
export const addressRemove = data => {
    return ajax({
        url: "/product/common/address/del",
        method: "post",
        data
    });
};

// 客户授信结果查询(加上信联额度判断)
export const creditQuery = data => {
    return ajax({
        url: "/product/mybank/credit/result/query",
        method: "post",
        data
    });
};

// 支付宝免密代扣签约
export const alipaySignApply = data => {
    return ajax({
        url: "/pay/channels/apxl_trade/0/MINI/accounts",
        method: "post",
        data
    });
};


// 支付宝免密签约状态查询
export const alipaySignQuery = data => {
    return ajax({
        url: "/pay/accounts/state",
        method: "post",
        data
    });
};

// 支付宝免密签约成功结果通知
export const alipaySignNotice = data => {
    return ajax({
        url: "/product/mybank/alisign/result/notice",
        method: "post",
        data
    });
};

// 2019-10-24  新增

// 车辆品牌型号查询
export const carQuery = data => {
    return ajax({
        url: "/ds/trade/vehicle/query",
        method: "post",
        data
    });
};
// 品牌型号数据查询
export const brandQuery = data => {
    return ajax({
        url: "/product/common/egs/model/data/query",
        method: "post",
        data
    });
};
// 品牌型号数据提交
export const brandSubmit = data => {
    return ajax({
        url: "/product/common/model/data/submit",
        method: "post",
        data
    });
};
// 行驶证正本OCR数据上传
export const ocrSubmit = data => {
    return ajax({
        url: "/product/common/driving/front/data",
        method: "post",
        data
    });
};
// 行驶证副本OCR数据上传
export const ocrCopySubmit = data => {
    return ajax({
        url: "/product/common/driving/back/data",
        method: "post",
        data
    });
};
// 车辆轴数试算(根据总质量)
export const trialShaft = data => {
    return ajax({
        url: "/product/common/driving/back/data/trial/shaft",
        method: "post",
        data
    });
};
// 车辆轴数提交
export const axleShaft = data => {
    return ajax({
        url: "/product/common/driving/back/data/shaft",
        method: "post",
        data
    });
};

// 补填支付宝id
export const userNumber = data => {
    return ajax({
        url: "/product/mybank/supplementary/alipay/user/number",
        method: "post",
        data
    });
};

//建行保证金划拨结果查询

export const ccBquery = data => {
    return ajax({
        url: "/product/truckobu/mybank/deposit/offline/transfer/result/query",
        method: "GET",
        data
    });
};
//璐哥来时的校验
export const check = data => {
    return ajax({
        url: "/three/party/channel/user/info/check",
        method: "post",
        data
    });
};


//获取推广人信息
export const info = data => {
    return ajax({
        url: "/get/extension/info",
        method: "post",
        data
    });
};