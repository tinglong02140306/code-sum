import Mock from "mockjs";

const baseUrl = '/xlshop';
export default [

	//  订单查询接口
	{
		url: `${baseUrl}/order/query`,
		type: "post",
		response: config => {

			console.log(config.body);

			const { product, order_status, start_time, end_time, page, per_num } = config.body;

			const List = [];

			const generateProductList = () => {
				const count = Mock.Random.integer(1, 5);
				let temp = [];
				for(let i = 0; i < count; i++) {
					temp.push(Mock.mock({
						product_name: "@ctitle(6)",
						sku_desc: "@ctitle(3)",
						price: "@integer(50,150)",
						quantity: "@integer(1,10)",
					}));
				}
				return temp;
			};

			for(let i = 0; i < 100; i++) {
				List.push(Mock.mock({
					order_id: "@id",
					shop_name: "@ctitle(6)",
					product_list: generateProductList(),
					freight: "@integer(10,20)",
					pay_amount: "@float(100,200,2,2)",
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
					receiver: "@cname()",
					telphone: /^1(9|3|4|5|7|8)[0-9]{9}$/,
					address: "@county(true)",
					order_status: "@integer(1,2)",
					confirmor: "@cname()",
					user_name: "@cname()",
					link_phone: /^1(9|3|4|5|7|8)[0-9]{9}$/,
					expect_time: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let sum_quantity = 0, sum_freight = 0, sum_amount = 0;
			List.forEach(item => {
				item.product_list.forEach(product => {
					sum_quantity += product.quantity;
				});
				sum_freight += item.freight;
				sum_amount += item.pay_amount;
			});


			let mockList = List.filter(item => {
				// if(user_info && (item.user_id.toString().indexOf(user_info) === -1 || item.user_name.indexOf(user_info) === -1)) return false;
				return true;
			});

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					pages: 1,
					total: mockList.length,
					sum_info: {
						sum_quantity,
						sum_freight,
						sum_amount: sum_amount.toFixed(2)
					},
					order_list: pageList
				}
			};
		}
	},

	// 订单发货
	{
		url: `${baseUrl}/order/ship`,
		type: "post",
		response: config => {

			console.log(config.body);

			return {
				code: 20000,
				data: "success"
			};
		}
	},

	//  售后查询接口
	{
		url: `${baseUrl}/aftersale/query`,
		type: "post",
		response: config => {

			console.log(config.body);

			const { serial_no, order_id, applicant_info, status, shop_id, start_time, end_time, page, per_num } = config.body;

			const List = [];

			for(let i = 0; i < 100; i++) {
				List.push(Mock.mock({
					serial_no: "@id",
					order_id: "@id",
					shop_name: "@ctitle(6)",
					refund_reason: "@ctitle(6)",
					product_name: "@ctitle(6)",
					sku_desc: "@ctitle(3)",
					quantity: "@integer(1,10)",
					freight: "@integer(10,20)",
					pay_amount: "@float(100,200,2,2)",
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
					receiver: "@cname()",
					telphone: /^1(9|3|4|5|7|8)[0-9]{9}$/,
					address: "@county(true)",
					order_status: "@integer(1,2)",
					expect_time: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
					order_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let mockList = List.filter(item => {
				if(serial_no && (item.serial_no.toString().indexOf(serial_no) === -1)) return false;
				if(order_id && (item.order_id.toString().indexOf(order_id) === -1)) return false;
				return true;
			});

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					pages: 1,
					total: mockList.length,
					result_list: pageList
				}
			};
		}
	},

	// 退款
	{
		url: `${baseUrl}/aftersale/refund`,
		type: "post",
		response: config => {

			console.log(config.body);

			return {
				code: 20000,
				data: "success"
			};
		}
	},

	// 退款拒绝
	{
		url: `${baseUrl}/aftersale/refuse`,
		type: "post",
		response: config => {

			console.log(config.body);

			return {
				code: 20000,
				data: "success"
			};
		}
	},

	// 查看物流接口
	{
		url: `${baseUrl}/aftersale/checkExpress`,
		type: "post",
		response: config => {

			console.log(config.body);

			return {
				code: 20000,
				data: {
					"total_time": "4小时35分钟",
					"express_info": [
						{ "express_process": "发货", "time": "2020-04-08 12:00:00" },
						{ "express_process": "天气不好，预计延迟10分钟", "time": "2020-04-08 15:00:00" },
						{ "express_process": "送达", "time": "2020-04-08 15:10:00" }
					]
				}
			};
		}
	},

	// 查看处理详情
	{
		url: `${baseUrl}/aftersale/checkHandleDetails`,
		type: "post",
		response: config => {

			console.log(config.body);

			let data = Mock.mock({
				operator: "@cname()",
				status: "@integer(1,4)",
				amount: "@float(10,90,2,2)",
				reject_reason: null,
				gmt_modified: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss")
			});

			return {
				code: 20000,
				data
			};
		}
	},

	// 评价审核查询接口
	{
		url: `${baseUrl}/evaluation/query`,
		type: "post",
		response: config => {

			console.log(config.body);

			const { product, audit_status, page, per_num } = config.body;

			const generateImgs = () => {
				const count = Mock.Random.integer(1, 5);
				let temp = [];
				for(let i = 0; i < count; i++) {
					temp.push("http://www.tupian1.cn/uploads/allimg/150420/1-150420010941-51.jpg");
				}
				return temp;
			};

			const List = [];

			for(let i = 0; i < 100; i++) {
				List.push(Mock.mock({
					product_id: "@id",
					user_id: "@id",
					product_name: "@ctitle(6)",
					shop_name: "@ctitle(6)",
					grade: "@integer(1,5)",
					content: "@ctitle(60)",
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
					user_name: "@cname()",
					telephone: /^1(9|3|4|5|7|8)[0-9]{9}$/,
					auditor: "@cname()",
					audit_time: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
					audit_status: "@integer(1,2)",
					images_url: generateImgs()
				}));
			}

			let mockList = List.filter(item => {
				if(product && (item.product_id.toString().indexOf(product) === -1 || item.product_name.toString().indexOf(product) === -1)) return false;
				if(audit_status && (item.audit_status !== audit_status)) return false;
				return true;
			});

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					pages: 1,
					total: mockList.length,
					result_list: pageList
				}
			};
		}
	},

	// 评价审核-审核接口
	{
		url: `${baseUrl}/evaluation/audit`,
		type: "post",
		response: config => {

			console.log(config.body);

			let data = Mock.mock({
				operator: "@cname()",
				status: "@integer(1,4)",
				amount: "@float(10,90,2,2)",
				reject_reason: null,
				gmt_modified: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss")
			});

			return {
				code: 20000,
				data
			};
		}
	},

];

