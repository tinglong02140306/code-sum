import { ajax } from "../utils/request.js";

// 保证金列表查询
export const getDepositList = () => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/list",
		method: "post",
	});
};

// 保证金冻结
export const depositFreeze = data => {
	return ajax({
		url: "/product/truckobu/otherbank/deposit/transfer",
		method: "post",
		data
	});
};

// 保证金解冻
export const depositRelease = data => {
	return ajax({
		url: "/product/truckobu/icbc/deposit/release",
		method: "post",
		data
	});
};

// 获取保证金补缴金额
export const depositReplenish = data => {
	return ajax({
		url: "/product/truckobu/mybank/server/deposit/replenish",
		method: "post",
		data
	});
};

// 保证金查询
export const depositQuery = data => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/query",
		method: "post",
		data
	});
};

// 保证金退款
export const depositRefund = data => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/return",
		method: "post",
		data
	});
};

// 保证金冻结成功通知
export const depositFreezeSuccess = data => {
	return ajax({
		url: "/product/19/icbc/standard/day/freeze/success",
		method: "post",
		data
	});
};

// 保证金冻结成功通知（车辆追加)
export const depositFreezeSuccessAppend = data => {
	return ajax({
		url: "/product/19/icbc/vehicle/add/freeze/success",
		method: "post",
		data
	});
};

// 网商银行保证金划拨
export const depositTransfer = data => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/transfer",
		method: "post",
		data
	});
};

// 保证金划拨结果查询
export const depositTransferQuery = data => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/transfer/result/query",
		method: "post",
		data
	});
};


//4.3.支付宝免密签约成功结果通知
export const DensityFree = data => {
	return ajax({
		url: "/product/mybank/alisign/result/notice",
		method: "post",
		data
	});
};

// 按车退保证金
export const depositRefundByCar = data => {
	return ajax({
		url: "/product/truckobu/mybank/deposit/refund/by/vehicle",
		method: "post",
		data
	});
};