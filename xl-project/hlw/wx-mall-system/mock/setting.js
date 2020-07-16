import Mock from "mockjs";
const baseUrl = '/xlshop';

export default [

	{
		url: `${baseUrl}/home/image/queryDetail`,
		type: "post",
		response: config => {

			const { id } = config.body;

			return {
				code: 20000,
				data: Mock.mock({
					id: id,
					type: "@integer(1,2)",
					image: "@image('200x100')",
					product_id: "YA04860012302",
					priority: "@integer(1,10)",
					status: "@integer(0,1)"
				})
			};
		}
	},

	{
		url: `${baseUrl}/home/image/query`,
		type: "post",
		response: () => {

			const List = [];
			for(let i = 0; i < 20; i++) {
				List.push(Mock.mock({
					id: "@id",
					image: "@image('200x100')",
					type: "@integer(1,2)",
					product_name: "@ctitle(6)",
					shop_name: "@ctitle(6)",
					priority: "@integer(1,20)",
					hits: "@integer(1,99)",
					status: "@integer(1,2)",
					creater: "@cname()",
					gmt_create: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			return {
				code: 20000,
				data: List
			};
		}
	},

	{
		url: `${baseUrl}/shopProductTree/query`,
		type: "post",
		response: () => {

			const result = {
				"id": "DG0000123",
				"label": "爱的礼物总店",
				"children": [
					{
						"id": "DG0000123001", "label": "爱的礼物分店一",
						"children": [{ "id": "LA99287799975", "label": "卡布奇诺" },
						{ "id": "YA04860012302", "label": "芝士蛋糕" }]
					},
					{ "id": "LA99287577575", "label": "牛奶布丁" },
					{ "id": "YL998000012302", "label": "火腿三明治" },
					{ "id": "DE000012303673", "label": "鲜榨果汁" },
				]
			};

			return {
				code: 20000,
				data: [result]
			};
		}
	},

	{
		url: `${baseUrl}/home/image/add`,
		type: "post",
		response: () => {

			return {
				code: 20000,
				data: "success"
			};
		}
	},

	{
		url: `${baseUrl}/home/image/edit`,
		type: "post",
		response: () => {

			return {
				code: 20000,
				data: "success"
			};
		}
	},

	{
		url: `${baseUrl}/home/image/manage`,
		type: "post",
		response: () => {

			return {
				code: 20000,
				data: "success"
			};
		}
	},

	{
		url: `${baseUrl}/home/image/delete`,
		type: "post",
		response: () => {

			return {
				code: 20000,
				data: "success"
			};
		}
	},


];

