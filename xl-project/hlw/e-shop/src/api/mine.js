import  ajax  from "../utils/request.js";
// 我的主页面相关接口

// 地址列表
export const addressList = data => {
	return ajax({
		url: "/xlk-shop/my/address/list",
		method: "post",
		data
	});
};

// 添加地址
export const addAddress = data => {
	return ajax({
		url: "/xlk-shop/my/address/add",
		method: "post",
		data
	});
};

// 修改地址
export const updateAddress = data => {
	return ajax({
		url: "/xlk-shop/my/address/update",
		method: "post",
		data
	});
};

// 删除地址
export const deleteAddress = data => {
	return ajax({
		url: "/xlk-shop/my/address/delete",
		method: "post",
		data
	});
};