import { ajax } from "../utils/request.js";

// etc挂失
export const etcFreeze = data => {
	return ajax({
		url: "/product/truckobu/server/etc/freeze",
		method: "post",
		data
	});
};

// etc解挂
export const etcRelease = data => {
	return ajax({
		url: "/product/truckobu/server/etc/release",
		method: "post",
		data
	});
};

// 是否可申请换卡申请
export const etcChangeCheck = data => {
	return ajax({
		url: "/product/truckobu/server/card/change/check",
		method: "post",
		data
	});
};

// 换卡申请
export const etcChangeApply = data => {
	return ajax({
		url: "/product/truckobu/server/card/change/apply",
		method: "post",
		data
	});
};


