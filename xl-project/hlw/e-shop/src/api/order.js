import ajax from "../utils/request.js";
// 订单相关接口
// 订单金额计算接口
export const orderConfirmInfo = data => {
    return ajax({
        url: "/xlk-shop/order/confirm/info",
        method: "post",
        data
    });
};

//订单提交
export const orderSubmit = data => {
    return ajax({
        url: "/xlk-shop/order/submit",
        method: "post",
        data
    });
};

// 售后列表
export const refundList = data => {
    return ajax({
        url: "/xlk-shop/order/refund/list",
        method: "post",
        data
    });
};

// 申请退款
export const applyRefund = data => {
    return ajax({
        url: "/xlk-shop/order/refund/apply",
        method: "post",
        data
    });
};

// 获取地址列表接口  第一是默认地址
export const addressList = data => {
    return ajax({
        url: "/xlk-shop/my/address/list",
        method: "post",
        data
    });
};

// 信联卡绑定
export const xlkBind = data => {
    return ajax({
        url: "/xlk-shop/my/xlk/bind",
        method: "post",
        data
    });
}

// 订单支付
export const orderPay = data => {
    return ajax({
        url: "/xlk-shop/order/pay",
        method: "post",
        data
    });
};

// 信联卡列表
export const cardList = data => {
    return ajax({
        url: "/xlk-shop/my/xlk/list",
        method: "post",
        data
    });
};
// 信联卡解绑
export const unBindCard = data => {
    return ajax({
        url: "/xlk-shop/my/xlk/unbind",
        method: "post",
        data
    });
};
// 订单列表
export const orderList = data => {
    return ajax({
        url: "/xlk-shop/order/list",
        method: "post",
        data
    });
};
// 取消订单
export const cancelOrder = data => {
    return ajax({
        url: "/xlk-shop/order/cancel",
        method: "post",
        data
    });
};
// 确认收货
export const orderReceived = data => {
    return ajax({
        url: "/xlk-shop/order/received",
        method: "post",
        data
    });
};
// 添加评论
export const addComment = data => {
    return ajax({
        url: "/xlk-shop/my/comment/add",
        method: "post",
        data
    });
};

// 订单详情
export const orderDetail = data => {
    return ajax({
        url: "/xlk-shop/order/detail",
        method: "post",
        data
    });
};