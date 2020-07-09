import { ajax } from "../utils/request.js";

// 设备认证
export const deviceAuthenticate = data => {
	return ajax({
		url: "/bcard/device/auth",
		method: "post",
		data
	});
};

// 后台激活接口
export const cardIssue = data => {
	return ajax({
		url: "/card/valid/change",
		method: "post",
		data
	});
};