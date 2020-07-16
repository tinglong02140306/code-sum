import request from "@/utils/request";

// 订单查询接口
export function fetchList(data){
	return request({
		url: "/xlshop/order/query",
		method: "post",
		data
	});
}

// 订单管理操作发货接口
export function shipOrder(data){
	return request({
		url: "/xlshop/order/ship",
		method: "post",
		data
	});
}

// 售后查询接口
export function afterSaleQuery(data){
	return request({
		url: "/xlshop/aftersale/query",
		method: "post",
		data
	});
}

// 售后管理-退款操作接口
export function refund(data){
	return request({
		url: "/xlshop/aftersale/refund",
		method: "post",
		data
	});
}

// 售后管理-拒绝操作接口
export function refuse(data){
	return request({
		url: "/xlshop/aftersale/refuse",
		method: "post",
		data
	});
}

// 售后管理-查看物流接口
export function checkExpress(data){
	return request({
		url: "/xlshop/aftersale/checkExpress",
		method: "post",
		data
	});
}

// 售后管理-查看处理详情
export function checkExpressDetail(data){
	return request({
		url: "/xlshop/aftersale/checkHandleDetails",
		method: "post",
		data
	});
}

// 评价审核查询接口
export function evaluationQuery(data){
	return request({
		url: "/xlshop/evaluation/query",
		method: "post",
		data
	});
}

// 评价审核-审核接口
export function evaluationAudit(data){
	return request({
		url: "/xlshop/evaluation/audit",
		method: "post",
		data
	});
}
