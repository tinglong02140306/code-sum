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
const baseUrl = '/xlshop';

export default [

	{
		url: `${baseUrl}/report/sale`,
		type: "post",
		response: config => {

			console.log(config.body);

			const { product, shop_id, start_time, end_time, page, per_num } = config.body;

			const total_sale_amount = Mock.Random.float(10000, 20000, 2, 2);

			const day_sale_amount = Mock.Random.float(1000, 2000, 2, 2);

			const List = [];
			const count = 100;
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					product_name: "@ctitle(6)",
					sku_desc: "@ctitle(3)",
					sale_volume: "@integer(10, 40)",
					refund_volume: "@integer(1, 4)",
					actual_volume: "@integer(10, 40)",
					sale_amount: "@float(1000, 4000,2,2)",
					refund_amount: "@float(100, 400,2,2)",
					actual_amount: "@float(1000, 3000,2,2)",
				}));
			}

			let mockList = List.filter(item => {
				// if(shop_id && (item.shop_id.indexOf(shop) === -1 || item.shop_name.indexOf(shop) === -1)) return false;
				if(product && (item.product_name.indexOf(product) === -1 || item.product_name.indexOf(product) === -1)) return false;
				return true;
			});

			let sum_product = mockList.length, sum_sale_volume = 0, sum_refund_volume = 0, sum_actual_volume = 0,
				sum_sale_amount = 0, sum_refund_amount = 0, sum_actual_amount = 0;

			mockList.forEach(item => {
				sum_sale_volume += item.sale_volume;
				sum_refund_volume += item.refund_volume;
				sum_actual_volume += item.actual_volume;
				sum_sale_amount += item.sale_amount;
				sum_refund_amount += item.refund_amount;
				sum_actual_amount += item.actual_amount;
			});

			const pageList = mockList.filter((item, index) => index < per_num * page && index >= per_num * (page - 1));

			return {
				code: 20000,
				data: {
					pages: 1,
					total: mockList.length,
					total_sale_amount,
					day_sale_amount,
					sale_list: pageList,
					sum_info: {
						sum_product,
						sum_sale_volume,
						sum_refund_volume,
						sum_actual_volume,
						sum_sale_amount: sum_sale_amount.toFixed(2),
						sum_refund_amount: sum_refund_amount.toFixed(2),
						sum_actual_amount: sum_actual_amount.toFixed(2)
					}
				}
			};
		}
	},

];

