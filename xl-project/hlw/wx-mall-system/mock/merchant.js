import Mock from "mockjs";

const baseUrl = '/xlshop';
export default [

	//  商户列表接口
	{
		url: `${baseUrl}/merchant/list`,
		type: "post",
		response: config => {

			const { shop, shop_status, page, per_num } = config.body;
			console.log(shop_status);

			const List = [];
			const count = 100;
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					shop_id: "@increment",
					shop_name: "@ctitle(6)",
					num: "@integer(1, 3)",
					address: "@county(true)",
					mobile: /^1(9|3|4|5|7|8)[0-9]{9}$/,
					"status": "@integer(1, 2)",
					"level": "@integer(1, 2)",
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let mockList = List.filter(item => {
				if(shop && (item.shop_id.indexOf(shop) === -1 || item.shop_name.indexOf(shop) === -1)) return false;
				if(shop_status && item.status != shop_status) return false;
				return true;
			});

			let sumBranchNum = mockList.reduce((prev, curr) => {
				const value = Number(curr.num);
				if(!isNaN(value)) {
					return prev + value;
				} else {
					return prev;
				}
			}, 0);

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					pages: 1,
					total_num: sumBranchNum,
					total: mockList.length,
					shop_list: pageList
				}
			};
		}
	},

	//  商户信息查询
	{
		url: `${baseUrl}/merchant/info`,
		type: "post",
		response: config => {

			const { shop_id, is_query_sub_shop } = config.body;

			const shopInfo = Mock.mock({
				shop_id: shop_id,
				shop_name: "@ctitle(6)",
				mobile: /^1(9|3|4|5|7|8)[0-9]{9}$/,
				address: "@county(true)",
				"ship_area|2": ["历下区", "历城区", "天桥区", "市中区", "高新区", "章丘区"],
				image: "@image('200x100')",
				free_delivery: "@integer(10, 20)",
				open_time_start: "08:30:00",
				open_time_end: "18:30:00",
				"shop_status": "@integer(1, 2)",
				"level": "@integer(1, 2)",
			});

			let list = [];

			let count = Mock.Random.integer(0, 5);
			console.log(count);

			for(let i = 0; i < count; i++) {
				list.push(Mock.mock({
					sub_shop_id: "@increment",
					sub_shop_name: "@ctitle(6)",
					sub_free_delivery: "@integer(10, 20)",
					sub_address: "@county(true)",
					sub_mobile: /^1(9|3|4|5|7|8)[0-9]{9}$/,
					sub_open_time_start: "08:30:00",
					sub_open_time_end: "18:30:00",
					sub_shop_status: "@integer(1, 2)",
				}));
			}

			shopInfo.ship_area = shopInfo.ship_area.join("|");

			console.log(shopInfo);

			return {
				code: 20000,
				data: {
					...shopInfo,
					sub_shop_list: []
					// sub_shop_list: is_query_sub_shop === "1" ? list : []
				}
			};
		}
	},

	//  店铺订单统计查询接口
	{
		url: `${baseUrl}/order/analysis`,
		type: "post",
		response: config => {

			const { shop_id } = config.body;
			const shopInfo = Mock.mock({
				total_num: "@float(0, 10000, 2, 2)",
				total_amount: "@float(0, 10000, 2, 2)",
				total_refund_amount: "@float(0, 10000, 2, 2)",
				total_profit: "@float(0, 10000, 2, 2)",
			});

			shopInfo.shop_id = shop_id;

			return {
				code: 20000,
				data: shopInfo
			};
		}
	},

	//  商户添加接口
	{
		url: `${baseUrl}/merchant/add`,
		type: "post",
		response: () => {
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  商户修改接口
	{
		url: `${baseUrl}/merchant/update`,
		type: "post",
		response: () => {
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  商户修改接口
	{
		url: `${baseUrl}/merchant/merchants`,
		type: "post",
		response: config => {

			const { shop_id, shop_status } = config.body;

			let level = Mock.Random.integer(1, 2);

			const list = [];
			for(let i = 1; i <= level; i++) {
				let temp = Mock.mock({
					shop_id: "@increment",
					shop_name: "@ctitle(6)",
					level: level,
					shop_status: "@integer(1, 2)",
				});
				temp.shop_id = String(temp.shop_id);
				list.push(temp);
			}

			console.log(list);

			return {
				code: 20000,
				data: {
					shop_list: list
				}
			};
		}
	},

	// 运费管理（进列表页）
	{
		url: `${baseUrl}/ship/template/list`,
		type: "post",
		response: config => {

			const { shop_id, page, per_num } = config.body;

			const List = [];
			const count = 50;
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					template_id: "@increment",
					template_name: "@ctitle(6)",
					shop_id: "@integer(100, 200)",
					is_pinkage: "@integer(1, 2)",
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
					gmt_modified: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let mockList = List.filter(item => {
				if(shop_id && (String(item.shop_id).indexOf(shop_id) === -1)) return false;
				return true;
			});

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					pages: 1,
					total: mockList.length,
					template_list: pageList
				}
			};
		}
	},

	//  店铺账单查询
	{
		url: `${baseUrl}/order/queryBill`,
		type: "post",
		response: config => {
			console.log(config.body);
			const { shop, start_time, page, per_num, end_time } = config.body;

			const List = [];
			const count = 100;
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					product_name: "@ctitle(6)",
					receiver: "@ctitle(6)",
					amount: "@integer(100, 300)",
					address: "@county(true)",
					telphone: /^1(9|3|4|5|7|8)[0-9]{9}$/,
					"order_status": "@integer(1, 2)",
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}


			let mockList = List.filter(item => {
				if(shop && (item.shop_id.indexOf(shop) === -1 || item.shop_name.indexOf(shop) === -1)) return false;
				return true;
			});

			let sumBranchNum = {
				sum_quantity: Mock.Random.float(100, 300, 2, 2),
				sum_pay_amount: Mock.Random.float(100, 300, 2, 2),
				sum_refund_amount: Mock.Random.float(100, 300, 2, 2),
				sum_amount: Mock.Random.float(100, 300, 2, 2),
			};

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					total: mockList.length,
					sum_info: sumBranchNum,
					order_list: pageList
				}
			};
		}
	},

	//  运费模板添加接口
	{
		url: `${baseUrl}/ship/template/add`,
		type: "post",
		response: (config) => {
			console.log("运费模板添加参数:");
			console.log(config.body);
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  运费模板更新接口
	{
		url: `${baseUrl}/ship/template/update`,
		type: "post",
		response: (config) => {
			console.log("运费模板更新参数:");
			console.log(config.body);
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  运费模板删除接口
	{
		url: `${baseUrl}/ship/template/del`,
		type: "post",
		response: (config) => {
			console.log("运费模板更新参数:");
			console.log(config.body);
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	// 运费模板信息查询接口
	{
		url: `${baseUrl}/ship/template/info`,
		type: "post",
		response: config => {

			console.log("运费模板信息查询接口参数");
			console.log(config.body);

			const { template_id } = config.body;

			const List = [];
			const count = Mock.Random.integer(1,8);
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					"ship_area|2": ["历下区", "历城区", "天桥区", "市中区", "高新区", "章丘区"],
					first_weight: "@integer(100, 200)",
					first_freight: "@integer(100, 200)",
					continued_weight: "@integer(100, 200)",
					continued_freight: "@integer(100, 200)",
				}));
			}

			List.forEach(item => {
				item.ship_area = item.ship_area.join("|");
			});

			return {
				code: 20000,
				data: {
					template_id: template_id,
					template_name: Mock.Random.ctitle(6),
					shop_id: Mock.Random.integer(100,300),
					is_pinkage: Mock.Random.integer(1,2),
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
					gmt_modified: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
					sub_template_list: List
				}
			};
		}
	},

];

