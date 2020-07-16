import Mock from "mockjs";

const data = Mock.mock({
	total_users: "@integer(300, 5000)",
	total_orders: "@integer(300, 5000)",
	total_records: "@integer(300, 5000)",
	product_num: "@integer(300, 5000)",
	product_sale: "@integer(300, 5000)",
	product_not_sale: "@integer(300, 5000)",
	product_comments: "@integer(300, 5000)",
	order_handle: "@integer(300, 5000)",
	order_send: "@integer(300, 5000)",
	order_service: "@integer(300, 5000)",
	order_complete: "@integer(300, 5000)",
	amount_total: "@float(0, 10000, 2, 2)",
	amount_refund: "@float(0, 10000, 2, 2)",
	amount_revenue: "@float(0, 10000, 2, 2)",

});
const baseUrl = '/xlshop'


export default [

	{
		url: `${baseUrl}/common/index`,
		type: "post",
		response: _ => {
			return {
				code: 20000,
				data: data
			};
		}
    },
    {
		url: `${baseUrl}/index/analysis`,
		type: "post",
		response: _ => {
			return {
				code: 20000,
				data: data
			};
		}
    },
    {
		url: `${baseUrl}/order/query`,
		type: "post",
		response: _ => {
			return {
				code: 20000,
				data: data
			};
		}
    },
    {
		url: `${baseUrl}/home/image/shopProductTree`,
		type: "post",
		response: _ => {
			return {
				code: 20000,
				data: data
			};
		}
    },
    
];

