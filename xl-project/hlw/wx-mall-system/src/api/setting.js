import request from "@/utils/request";

// 图片配置查询列表接口
export function getImageList(data){
	return request({
		url: "/xlshop/home/image/query",
		method: "post",
		data
	});
}

// 单条图片查询接口
export function getImageDetail(data){
	return request({
		url: "/xlshop/home/image/queryDetail",
		method: "post",
		data
	});
}

// 图片增加接口
export function addImage(data){
	return request({
		url: "/xlshop/home/image/add",
		method: "post",
		data
	});
}

// 首页图片禁用解禁接口
export function manageImage(data){
	return request({
		url: "/xlshop/home/image/manage",
		method: "post",
		data
	});
}

// 图片编辑接口
export function editImage(data){
	return request({
		url: "/xlshop/home/image/edit",
		method: "post",
		data
	});
}

// 图片配置删除接口
export function delImage(data){
	return request({
		url: "/xlshop/home/image/delete",
		method: "post",
		data
	});
}

// 店铺商品树查询
export function queryProduct(data){
	return request({
		url: "/xlshop/home/image/shopProductTree",
		method: "post",
		data
	});
}

