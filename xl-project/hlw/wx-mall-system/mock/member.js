import Mock from "mockjs";
const baseUrl = '/xlshop';

export default [

	//  会员信联卡查询接口
	{
		url: `${baseUrl}/user/queryXlk`,
		type: "post",
		response: config => {

			console.log(config.body);

			const List = [];
			const count = Mock.Random.integer(1, 5);
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					card_no: "@id",
					balance: "@float(10,200,2,2)",
					bind_time: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let total = 0;
			List.forEach(item => {
				total += item.balance;
			});

			console.log(total);
			console.log(List);

			return {
				code: 20000,
				data: {
					total_balance: total,
					card_info: List
				}
			};
		}
	},

	//  会员列表查询接口
	{
		url: `${baseUrl}/user/query`,
		type: "post",
		response: config => {

			const { user_info, page, per_num } = config.body;
			console.log(user_info);

			const List = [];
			const count = 100;
			for(let i = 0; i < count; i++) {
				List.push(Mock.mock({
					user_id: "@increment",
					user_name: "@cname(6)",
					status: "@integer(1, 3)",
					telephone: /^1(9|3|4|5|7|8)[0-9]{9}$/,
					total_amount: "@integer(10, 2000)",
					bind_time: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let mockList = List.filter(item => {
				if(user_info && (item.user_id.toString().indexOf(user_info) === -1 || item.user_name.indexOf(user_info) === -1)) return false;
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

	//  会员禁用解禁接口
	{
		url: `${baseUrl}/user/manage`,
		type: "post",
		response: config => {

			console.log(config.body);

			return {
				code: 20000,
				data: "success"
			};
		}
	},

];

