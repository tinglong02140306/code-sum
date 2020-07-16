import request from "@/utils/request";

// 销售明细查询
export function getReport(data){
	return request({
		url: "/xlshop/report/sale",
		method: "post",
		data
	});
}



