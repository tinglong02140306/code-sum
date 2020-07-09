import { ajax } from "../utils/request.js";

// 消息列表
export const msgList = data => {
	return ajax({
		url: "/wx/95011mp/msg/list",
		method: "post",
		data
	});
};

// 消息内容
export const msgInfo = data => {
	return ajax({
		url: "/wx/95011mp/msg/content",
		method: "post",
		data
	});
};

// 投诉建议提交接口
export const infoSubmit = data => {
	return ajax({
		url: "/wx/95011mp/complaint/submit",
		method: "post",
		data
	});
};

// 手机号变更发送短信验证码接口
export const sendMsg = data => {
	return ajax({
		url: "/wx/95011mp/mobile/update/sms",
		method: "post",
		data
	});
};

// 投诉建议提交接口
export const msgValid = data => {
	return ajax({
		url: "/wx/95011mp/mobile/update",
		method: "post",
		data
	});
};

// 标记全部消息已读接口
export const readAll = () => {
	return ajax({
		url: "/wx/95011mp/msg/read/all",
		method: "post"
	});
};