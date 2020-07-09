import { ajax } from "../utils/request.js";

// 获取通知公告
export const getNotices = () => {
	return ajax({
		url: "/wx/95011mp/notice/list",
		method: "post"
	});
};

// 问题列表
export const getProblemList = data => {
	return ajax({
		url: "/wx/95011mp/kbms/list",
		method: "post",
		data
	});
};

// 消息列表
export const getMsgList = data => {
	return ajax({
		url: "/wx/95011mp/msg/list",
		method: "post",
		data
	});
};

// 搜索热词
export const getHotList = () => {
	return ajax({
		url: "/wx/95011mp/hotword/query",
		method: "post"
	});
};

// 卡类型查询接口
export const getCardType = () => {
	return ajax({
		url: "/wx/95011mp/cardtype/query",
		method: "post"
	});
};