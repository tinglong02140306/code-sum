import request from "@/utils/request";

// 会员列表查询接口
export function getUsers(data){
	return request({
		url: "/xlshop/user/query",
		method: "post",
		data
	});
}

// 会员禁用解禁接口
export function userManage(data){
	return request({
		url: "/xlshop/user/manage",
		method: "post",
		data
	});
}

// 会员信联卡查询接口
export function getXlCards(data){
	return request({
		url: "/xlshop/user/queryXlk",
		method: "post",
		data
	});
}


