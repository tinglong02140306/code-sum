import request from "@/utils/request";

// 商品管理（列表）
export function fetchList(data){
	return request({
		url: "/xlshop/product/list",
		method: "post",
		data
	});
}

// 商品添加
export function addProduct(data){
	return request({
		url: "/xlshop/product/add",
		method: "post",
		data
	});
}

// 商品修改
export function updateProduct(data){
	return request({
		url: "/xlshop/product/update",
		method: "post",
		data
	});
}

// 商品详情
export function productInfo(data){
	return request({
		url: "/xlshop/product/info",
		method: "post",
		data
	});
}

// 商品推荐
export function productRecommend(data){
	return request({
		url: "/xlshop/product/recommend/batch",
		method: "post",
		data
	});
}

// 商品审核列表（进列表页）
export function productAuditList(data){
	return request({
		url: "/xlshop/product/flow/list",
		method: "post",
		data
	});
}

// 商品申请详情
export function productAuditInfo(data){
	return request({
		url: "/xlshop/product/flow/info",
		method: "post",
		data
	});
}

// 商品申请审核批量
export function productAudit(data){
	return request({
		url: "/xlshop/product/flow/audit",
		method: "post",
		data
	});
}

// 商品申请审核批量
export function productAuditBatch(data){
	return request({
		url: "/xlshop/product/flow/audit/batch",
		method: "post",
		data
	});
}

// 商品上架下架
export function toggleProduct(data){
	return request({
		url: "/xlshop/product/onOffshelves",
		method: "post",
		data
	});
}

// 商品删除
export function delProduct(data){
	return request({
		url: "/xlshop/product/del",
		method: "post",
		data
	});
}

// 运费模板列表下拉
export function getTemplates(data){
	return request({
		url: "/xlshop/ship/template/templates",
		method: "post",
		data
	});
}

// 商品分类查询（分页）
export function getCategories(data){
	return request({
		url: "/xlshop/product/category/page",
		method: "post",
		data
	});
}

// 商品分类添加
export function addCategory(data){
	return request({
		url: "xlshop/product/category/add",
		method: "post",
		data
	});
}

// 商品分类查询（分页）
export function modCategory(data){
	return request({
		url: "/xlshop/product/category/update",
		method: "post",
		data
	});
}

// 商品分类查询（分页）
export function getCateList(data){
	return request({
		url: "/xlshop/product/category/list",
		method: "post",
		data
	});
}

