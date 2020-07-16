import request from "@/utils/request";

// 商户列表查询接口
export function fetchList(data){
	return request({
		url: "/xlshop/merchant/list",
		method: "post",
		data
	});
}

// 商户添加
export function addMerchant(data){
	return request({
		url: "/xlshop/merchant/add",
		method: "post",
		data
	});
}

// 商户修改
export function updateMerchant(data){
	return request({
		url: "/xlshop/merchant/update",
		method: "post",
		data
	});
}

// 商户信息查询
export function merchantInfo(data){
	return request({
		url: "/xlshop/merchant/info",
		method: "post",
		data
	});
}

// 店铺订单统计查询接口
export function merchantAnalysis(data){
	return request({
		url: "/xlshop/order/analysis",
		method: "post",
		data
	});
}

// 商户列表查询
export function merchantChildren(data){
	return request({
		url: "/xlshop/merchant/merchants",
		method: "post",
		data
	});
}

// 店铺订单统计查询接口
export function merchantBill(data){
	return request({
		url: "/xlshop/order/queryBill",
		method: "post",
		data
	});
}

/*********************************运费相关************************************************/
// 运费模板列表
export function getTemplates(data){
	return request({
		url: "/xlshop/ship/template/list",
		method: "post",
		data
	});
}

// 运费模板添加
export function addTemplate(data){
	return request({
		url: "/xlshop/ship/template/add",
		method: "post",
		data
	});
}

// 运费模板更新
export function updateTemplate(data){
	return request({
		url: "/xlshop/ship/template/update",
		method: "post",
		data
	});
}

// 运费模板信息查询
export function getTemplateInfo(data){
	return request({
		url: "/xlshop/ship/template/info",
		method: "post",
		data
	});
}

// 运费模板删除
export function deleteTemplate(data){
	return request({
		url: "/xlshop/ship/template/del",
		method: "post",
		data
	});
}

// 运费模板列表下拉
export function templatesList(data){
	return request({
		url: "/xlshop/ship/template/templates",
		method: "post",
		data
	});
}
