import Mock from "mockjs";
const baseUrl = '/xlshop';

export default [

	//  商品管理（列表）
	{
		url: `${baseUrl}/product/list`,
		type: "post",
		response: config => {

			const { shop, product, product_status, page, per_num } = config.body;

			console.log(config.body);

			const List = [];
			const count = 100;
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					product_id: "@increment",
					product_name: "@ctitle(6)",
					shop_id: "@integer(1, 3)",
					shop_name: "@ctitle(6)",
					price: "@integer(100, 300)",
					audit_status: "@integer(1, 2)",
					status: "@integer(1, 2)",
					"is_recommend": "@integer(1, 2)",
					priority: "@integer(1, 20)",
					sale_num: "@integer(100, 300)",
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let mockList = List.filter(item => {
				if(shop && (item.shop_id.indexOf(shop) === -1 || item.shop_name.indexOf(shop) === -1)) return false;
				if(product && (item.product_name.indexOf(product) === -1 || item.product_name.indexOf(product) === -1)) return false;
				if(product_status && item.status != product_status) return false;
				return true;
			});

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					pages: 1,
					total: mockList.length,
					product_list: pageList
				}
			};
		}
	},

	//  商品信息查询
	{
		url: `${baseUrl}/product/info`,
		type: "post",
		response: config => {

			const { product_id } = config.body;

			const shopInfo = Mock.mock({
				product_id: product_id,
				product_name: "@ctitle(6)",
				shop_id: "@integer(100, 200)",
				template_id: "@integer(100, 200)",
				priority: "@integer(1, 200)",
				detail: "@ctitle(60)",
				image_list: [],
				specs_list: [],
			});

			let list = [];

			let count = Mock.Random.integer(0, 5);
			console.log(count);

			for(let i = 0; i < count; i++) {
				list.push(Mock.mock({
					specs_name: "@ctitle(6)",
					price: "@integer(10, 20)",
					weight: "@integer(10, 20)",
				}));
			}


			return {
				code: 20000,
				data: {
					...shopInfo,
					specs_list: list,
				}
			};
		}
	},

	//  商品添加接口
	{
		url: `${baseUrl}/product/add`,
		type: "post",
		response: () => {
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  商品修改接口
	{
		url: `${baseUrl}/product/update`,
		type: "post",
		response: () => {
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  商品下架
	{
		url: `${baseUrl}/product/undercarriage`,
		type: "post",
		response: () => {
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  商品删除
	{
		url: `${baseUrl}/product/del`,
		type: "post",
		response: () => {
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  商品推荐
	{
		url: `${baseUrl}/product/recommend`,
		type: "post",
		response: config => {

			console.log(config.body);
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	// 商品审核列表（进列表页）
	{
		url: `${baseUrl}/product/flow/list`,
		type: "post",
		response: config => {

			const { shop_id, product, audit_status, page, per_num, start_time, end_time } = config.body;

			const List = [];
			const count = 50;
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					serial_no: "@increment",
					product_id: "@integer(100, 200)",
					product_name: "@ctitle(6)",
					shop_id: "@integer(100, 200)",
					shop_name: "@ctitle(6)",
					price: "@integer(100, 200)",
					applicant: "@cname(6)",
					auditor: "@cname(6)",
					audit_status: "@integer(1, 2)",
					apply_time: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let mockList = List.filter(item => {
				if(shop_id && (String(item.shop_id).indexOf(shop_id) === -1)) return false;
				if(product && (String(item.product_name).indexOf(product) === -1)) return false;
				if(audit_status && item.audit_status != audit_status) return false;
				return true;
			});

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					pages: 1,
					total: mockList.length,
					audit_list: pageList
				}
			};
		}
	},

	//  商品申请审核（批量）
	{
		url: `${baseUrl}/product/flow/audit/batch`,
		type: "post",
		response: (config) => {
			console.log("商品申请审核参数:");
			console.log(config.body);
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  商品申请详情
	{
		url: `${baseUrl}/product/flow/info`,
		type: "post",
		response: config => {

			const { serial_no } = config.body;

			const productInfo = Mock.mock({
				serial_no: serial_no,
				applicant: "@cname()",
				apply_time: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				product_id: "@integer(100, 200)",
				product_name: "@ctitle(6)",
				shop_id: "@integer(100, 200)",
				template_id: "@integer(100, 200)",
				priority: "@integer(1, 200)",
				detail: "@ctitle(60)",
				image_list: ["@image('200x100')","@image('200x100')"],
				specs_list: [],
			});

			let list = [];

			let count = Mock.Random.integer(1, 5);
			console.log(count);

			for(let i = 0; i < count; i++) {
				list.push(Mock.mock({
					specs_name: "@ctitle(6)",
					price: "@integer(10, 20)",
					weight: "@integer(10, 20)",
				}));
			}

			return {
				code: 20000,
				data: {
					...productInfo,
					specs_list: list,
				}
			};
		}
	},

	//  运费模板列表下拉
	{
		url: `${baseUrl}/ship/template/templates`,
		type: "post",
		response: (config) => {

			const { shop_id } = config.body;
			const List = [];
			const count = Mock.Random.integer(1, 5);
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					template_id: "@id",
					template_name: "@ctitle(6)",
					shop_id
				}));
			}
			return {
				code: 20000,
				data: {
					template_list: List
				}
			};
		}
	},

];

