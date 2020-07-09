import { ajax } from "../utils/request.js";

// 已出账单
export const accountStatement = data => {
	return ajax({
		url: "/bill/app/account/statement",
		method: "post",
		data
	});
};

// 通信费
export const billListQuery = data => {
	return ajax({
		url: "/bill/detail/app",
		method: "post",
		data
	});
};

// 历史账单列表
export const historyBill = data => {
	return ajax({
		url: "/bill/app/account/statement_gather",
		data
	});
};

// 是否可以还款惩治金（是否符合解黑条件查询）
export const punishCondition = () => {
	return ajax({
		url: "/product/black/repay/punish_condition",
		method: "post",
	});
};

// 立即还款
export const payNow = data => {
	return ajax({
		url: "/bill/account/statement/repayment/batch",
		method: "post",
		data
	});
};

// 未还款方式查询
export const repayChannel = data => {
	return ajax({
		url: "/bill/account/statement/repayment_channel",
		method: "post",
		data
	});
};





// 8.5授信额度是否充足查询
export const LineOfCredit = data => {
	return ajax({
		url: "/product/truckobu/mybank/server/adequate/credit/quota/query",
		method: "post",
		data
	});
};
// 10.4.获取用户车辆列表
export const listCar = data => {
	return ajax({
		url: "/product/mybank/user/vehicles",
		method: "post",
		data
	});
};
//2.9.调整支付顺序
export const sort = data => {
	return ajax({
		url: "/pay/channels/accounts/consume/sort",
		method: "post",
		data
	});
};