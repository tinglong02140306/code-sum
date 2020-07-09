/*
 * @Author: sunmingmao
 * @Date: 2020-04-13 08:05:12
 * @LastEditors: sunmingmao
 * @LastEditTime: 2020-04-24 11:23:45
 * @Description: 
 */
//登录接口
export const loginApi = {
    //登录获取code
    login:"/wxapplet/anon/wx-login",
    //获取手机号
    mobile:"/wxapplet/anon/get-wx-mobile",
    //用户授权(老接口)
    auth:"/wxapplet/anon/user-authc",
    //微信登录
    wxLogin:"/wxapplet/anon/user-code",
    //用户授权
    userLogin:"/wxapplet/anon/user-authc-login"
}

//用户接口
export const userApi = {
    //用户访问记录
    userLog:"/wxapplet/user/access-log",
    //用户信息
    userInfo:"/wxapplet/user/get-info",
    //广告
    anon:'/wxapplet/anon/query-ad',
}

//推荐
export const homeApi = {
    //轮播图
    banner:"/wxapplet/anon/banner-query",
    //最近油站
    near:"/wxapplet/gasstation/query-station",
    //权益 银行优惠
    rights:"/wxapplet/equity/get-wxapplet-equity-list",
    //优惠券领取状态查询（中航易通）
    rightsStatus:"/wxapplet/equity/query-coupon-get-status",
    //优惠券领取（中航易通）
    rightsGet:"/wxapplet/equity/get-coupon",
    //获取国标价格
    gboilprice:"/wxapplet/anon/gboilprice-query",
    //天气状况
    weather:"/wxapplet/anon/get-weather-forecast"
}

//二维码
export const qrcodeApi = {
    //检查代扣信息 是否已开通二维码
    check:"/wxapplet/qrcode/find-sign-info",
    //获取二维码
    qrcode:"/wxapplet/qrcode/get-wxapplet-qr-code",
    //获取支付状态
    status:"/wxapplet/qrcode/get-wxapplet-qr-code-status",
    //获取支付结果
    result:"/wxapplet/qrcode/get-wxapplet-qr-code-result",
    //二维码删除
    remove:"/wxapplet/qrcode/remove-wxapplet-qr-code"
}

//油站查询接口
export const stationsApi = {
    //加油列表
    list:"/wxapplet/gasstation/query-station",
    //获取加油站品牌列表
    brands:"/wxapplet/gasstation/get-gasolinebrand-list",
    //一键加油 计算折扣
    discount:"/wxapplet/online/calculate-discount",
    //一键加油 创建订单
    order:"/wxapplet/online/create-order",
    //优惠券查询
    couponQuery:"/wxapplet/online/query-coupon",
    //优惠券计算
    couponCalculate:"/wxapplet/online/calculate-coupon",
    //支付统一下单
    unifiedorder:"/wxapplet/online/unifiedorder"
}
//洗车查询接口
export const cleanApi = {
    //洗车列表
    list:"/wxapplet/wash/query-washer",
    //洗车详情
    details:"/wxapplet/wash/query-washer-detail",
    //检查洗车机距离
    distance:"/wxapplet/wash/check-washer-distance",
    //检查洗车机状态
    check:"/wxapplet/wash/check-washer",
    //检查用户在该洗车点的订单信息
    getOrder:"/wxapplet/wash/get-order-by-station",
    //删除用户在该洗车点的订单缓存
    removeCache:"/wxapplet/wash/remove-order-cache",
    //创建订单
    createOrder:"/wxapplet/wash/create-order",
    //查询优惠券
    couponQuery:"/wxapplet/wash/query-coupon",
    //计算优惠券
    calculateCoupon:"/wxapplet/wash/calculate-coupon",
    //提交订单
    submitOrder:"/wxapplet/wash/submit-order",
    //启动洗车机
    start:"/wxapplet/wash/start-washer",
    //停止洗车机
    stop:"/wxapplet/wash/stop-washer",
    //查询消费成功后返还优惠券
    couponListByOrder:"/wxapplet/wash/get-coupon-list-by-order",

}
//查询券包列表
export const couponPackageApi = {
    //查询券包列表
    list:"/wxapplet/coupon-package/query",
    //提交订单（券包）
    order:"/wxapplet/coupon-package/submit-order",
};
//优惠券
export const couponApi = {
    //查询优惠券
    query:"/wxapplet/account/coupon-query"
}

//支付
export const payApi = {
     //微信车主服务 签约
     sign_vehicle:"/wxapplet/payment/sign-vehicle-pay",
     //微信车主服务 签约结果查询
     query_vehicle:"/wxapplet/payment/query-vehicle-pay",
     //支付方式列表
     list:"/wxapplet/payment/list-sign",
     //设置默认代扣
     set_default:"/wxapplet/payment/default-sign",

    //获取验证码
    verifyCode:"/wxapplet/payment/get-verify-code",
    //校验验证码
    checkCode:"/wxapplet/payment/check-verfiy-code",
    //签约银联
    signUnion:"/wxapplet/payment/sign-union-pay",
    //解约银联
    UnSignUnion:"/wxapplet/payment/unsign-union-pay",
    //查询是否存在签约支付方式
    exitPayment:"/wxapplet/payment/exit-payment",
}

//ETC
export const etcApi = {
    //名下ETC查询
    owned:"/wxapplet/etc/owned-etc-query",
    //绑定ETC
    bind:"/wxapplet/etc/etc-bind",
    //解绑ETC
    unbind:"/wxapplet/etc/etc-unbind",
    //ETC启停用
    changeStatus:"/wxapplet/etc/change-etc-status",
    //ETC列表
    query:"/wxapplet/etc/etc-query"
}

//账单接口
export const billApi = {
    gasList:"/wxapplet/order/query-gas",
    list:"/wxapplet/order/query-order",
    details:"/wxapplet/order/query-order-detail",
}

//优惠券和加油金接口
export const accountApi = {
    //加油金列表
    balanceList:"/wxapplet/account/balance-query",
    //设置加油金
    balanceSet:"/wxapplet/account/balance-set-use",
    //查询优惠券
    couponList:"/wxapplet/account/coupon-query",
    //查询非油提货券
    oilCouponList:"/wxapplet/account/non-oil-pick-up-coupon-query",
    //查询已使用的优惠券
    alreadyCouponList:"/wxapplet/account/already-used-coupon-query",
    //设置默认优惠券
    couponSet:"/wxapplet/account/coupon-set-default",
    //非油提货券二维码信息获取
    // qrcode:"/wxapplet/account/get-wxapplet-coupon-qr-code",
    qrcode:"/wxapplet/account/get-coupon-qr",
    //获取小程序非油提货券二维码支付结果
    // qrcode_result:"/wxapplet/account/get-wxapplet-coupon-qr-code-result",
    qrcode_result:"/wxapplet/account/get-coupon-qr-result",
    //兑换优惠券
    redeemCoupon:"/wxapplet/account/redeem-coupon"
}

//支付管理接口
export const paymentApi = {
    //代扣查询
    paymentList:"/wxapplet/payment/list-sign",
    //默认代扣
    paymentDefault:"/wxapplet/payment/default-sign",
    //签约银行账户
    signBank:"/wxapplet/payment/sign-bank-account",
    //代扣解约
    unsign:"/wxapplet/payment/unsign",
    //修改默认代扣方式
    updateDefault:"/wxapplet/payment/update-default-withhold",
    //修改扣款顺序
    updatePayment:"/wxapplet/payment/change-sequence" ,
}

//发票接口
export const invoiceApi = {
    //开票记录
    historyList:"/wxapplet/invoice/invoice-history",
    //申请发票
    invoiceOpen:"//wxapplet/invoice/invoice-of-application",
    //冲红
    invoiceOff:"/wxapplet/invoice/invoice-of-write-off",
    //重新发送电子邮件
    invoiceSend:"/wxapplet/invoice/send-invoice",
    //企业发票抬头查询
    invoiceTitle:"/servlet/invoice/company-invoice-title-query",
}
