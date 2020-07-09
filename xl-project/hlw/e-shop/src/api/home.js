import  ajax  from "../utils/request.js";
// 首页相关接口

// 登录
export const login = data => {
	return ajax({
		url: "/xlk-shop/login",
		method: "post",
		data
	});
};

// 获取广告位
export const addList = data => {
	return ajax({
		url: "/xlk-shop/product/ad/list",
		method: "post",
		data
	});
};