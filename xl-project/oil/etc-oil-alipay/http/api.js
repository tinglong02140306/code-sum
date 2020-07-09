/*
 * @Author: sunmingmao
 * @Date: 2020-04-13 08:05:12
 * @LastEditors: longting
 * @LastEditTime: 2020-04-24 11:23:45
 * @Description: 
 */
//登录接口
export const loginApi = {
    // 用户授权
    userLogin: "/aliapplet/user/authc"
}

//用户接口
export const userApi = {
    //用户访问记录 从外部进入小程序时触发 半小时内重复进入只请求一次
    userLog: "/aliapplet/user/access-log",
    //用户信息
    userInfo: "/aliapplet/user/get-info",
}

//推荐
export const homeApi = {
    // 查询轮播图
    banner: "/aliapplet/anon/query-banner",
    // 查询油站
    near: "/aliapplet/station/query-gas",
    // 查询国标油价
    gboilprice: "/aliapplet/station/query-gb-price",
    // 获取天气预报
    weather: "/aliapplet/anon/get-weather-forecast",
    // 查询权益列表
    rights: "/aliapplet/anon/query-equity",
    //优惠券领取状态查询（中航易通） 获取中航易通激活状态 
    rightsStatus: "/aliapplet/user/get-zhyt-actived",
    //优惠券领取（中航易通）  激活中航易通
    rightsGet: "/aliapplet/user/active-zhyt",
}
//ETC  -- 已初步联调完
export const etcApi = {
    //名下ETC查询
    owned: "/aliapplet/etc/query-owned",
    //绑定ETC
    bind: "/aliapplet/etc/bind",
    //解绑ETC
    unbind: "/aliapplet/etc/unbind",
    //ETC启停用
    changeStatus: "/aliapplet/etc/change-enabled",
    //ETC列表
    query: "/aliapplet/etc/query"
}

//订单接口 -- 已初步联调完
export const billApi = {
    // 查询加油订单列表
    gasList:"/aliapplet/order/query-gas",
    // 查询订单列表
    list: "/aliapplet/order/query",
    // 获取订单详情
    details: "/aliapplet/order/get-detail",
}

//发票接口
export const invoiceApi = {
    // 查询开票记录
    historyList: "/aliapplet/invoice/query",
    // 申请发票
    invoiceOpen: "/aliapplet/invoice/apply",
    // 冲红发票
    invoiceOff: "/aliapplet/invoice/red",
    // 重发邮件
    invoiceSend: "/aliapplet/invoice/send-email",
    // 查询抬头
    queryTitle: "/aliapplet/invoice/query-title",
    // 企业发票抬头查询 
    invoiceTitle: "/servlet/invoice/company-invoice-title-query",
}
//优惠券和加油金接口 已初步联调完
export const accountApi = {
    // 加油金列表 查询加油金
    balanceList: "/aliapplet/user/query-account",
    // 查询加油金状态
    balanceState: "/aliapplet/user/get-account-status",
    // 设置加油金  获取加油金状态
    balanceSet: "/aliapplet/user/change-account-status",
    // 查询优惠券
    couponList: "/aliapplet/coupon/query",
    //设置默认优惠券 暂时不用
    couponSet: "/aliapplet/account/coupon-set-default",
    // 获取提货券二维码
    qrcode: "/aliapplet/coupon/get-goods-qr",
    // 获取提货券支付结果
    qrcode_result: "/aliapplet/coupon/get-goods-qr-result",
    // 兑换优惠券
    redeemCoupon: "/aliapplet/coupon/redeem",
    // 查询已使用的优惠券
    alreadyCouponList: "/aliapplet/account/already-used-coupon-query",
}

//查询券包列表
export const couponPackageApi = {
    //查询券包列表
    list: "/aliapplet/coupon/query-package",
    //提交订单（券包）
    order: "/aliapplet/coupon/submit-package-order",
};

//二维码
export const qrcodeApi = {
    // 检查代扣信息 是否已开通二维码
    // check: "/aliapplet/qrcode/check-payment",
    //获取二维码
    qrcode: "/aliapplet/qrcode/get",
    //获取支付状态
    status: "/aliapplet/qrcode/get-pay-status",
    //获取支付结果
    result: "/aliapplet/qrcode/get-result",
    //二维码删除
    removeQrcode: "/aliapplet/qrcode/remove"
}

//油站查询接口
export const stationsApi = {
    // 加油列表
    list: "/aliapplet/station/query-gas",
    // 获取加油站品牌列表 查询油站品牌
    brands: "/aliapplet/station/query-gas-brand",
    // 一键加油 计算折扣
    discount: "/aliapplet/online/calculate-discount",
    // 一键加油 创建订单
    order: "/aliapplet/online/create-order",
    // 优惠券查询
    couponQuery: "/aliapplet/online/query-coupon",
    // 优惠券计算
    couponCalculate: "/aliapplet/online/calculate-coupon",
    //支付统一下单
    unifiedorder: "/aliapplet/online/unifiedorder"
}
//洗车查询接口
export const cleanApi = {
    //洗车列表
    list: "/aliapplet/station/query-washer",
    //洗车详情
    details: "/aliapplet/wash/query-washer-detail",
    //检查洗车机距离
    distance: "/aliapplet/wash/check-washer-distance",
    //检查洗车机状态
    check: "/aliapplet/wash/check-washer-status",
    //检查用户在该洗车点的订单信息  获取缓存订单
    getOrder: "/aliapplet/wash/get-cache-order",
    //删除用户在该洗车点的订单缓存   删除用户订单
    removeCache: "/aliapplet/wash/remove-cache-order",
    //创建订单
    createOrder: "/aliapplet/wash/create-order",
    //查询优惠券
    couponQuery: "/aliapplet/wash/query-coupon",
    //计算优惠券
    calculateCoupon: "/aliapplet/wash/calculate-coupon",
    //提交订单
    submitOrder: "/aliapplet/wash/submit-order",
    //查询消费成功后返还优惠券  获取赠送优惠券
    couponListByOrder: "/aliapplet/wash/get-give-coupon",
    //启动洗车机
    start: "/aliapplet/wash/start-washer",
    //停止洗车机
    stop: "/aliapplet/wash/stop-washer",
}


//支付管理接口
export const paymentApi = {
    // 代扣查询
    paymentList: "/aliapplet/payment/list-sign",
    // 签约免密代扣
    sign: "/aliapplet/payment/sign-direct-pay",
    // 解约免密代扣
    unsign: "/aliapplet/payment/unsign-direct-pay",
    // 修改扣款顺序
    updatePayment: "/aliapplet/payment/change-sequence"
}

