import { ajax } from "../utils/request.js";

// 卡列表
export const getCards = () => {
	return ajax({
		url: "/wx/bill-common/card/list",
		method: "post"
	});
};

// ETC卡绑定
export const bindCard = data => {
	return ajax({
		url: "/wx/bill-common/card/bind",
		method: "post",
		data
	});
};

// 通行明细查询
export const getConsumeList = data => {
	return ajax({
		url: "/wx/bill-common/consume/list",
		method: "post",
		data
	});
};

// 月账单汇总查询
export const getMonthBill = data => {
	return ajax({
		url: "/wx/bill-common/month-bill",
		method: "post",
		data
	});
};


// 月账单明细查询
export const getMonthBillDetail = data => {
	return ajax({
		url: "/wx/bill-common/bill/list",
		method: "post",
		data
	});
};


