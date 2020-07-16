import request from "@/utils/request";

// 商户列表查询接口
export function fetchData(data){
	return request({
		url: "/xlshop/index/analysis",
		method: "post",
		data
	});
}



