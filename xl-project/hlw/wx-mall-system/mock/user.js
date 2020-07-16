import Mock from "mockjs";
const baseUrl = '/xlshop';

export default [
	// user login
	{
		url:`${baseUrl}/auth/jwt/ntoken`,
		type: "post",
		response: config => {
			console.log(config.body);

			const token = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJzenBlciIsInVzZXJJZCI6ImQ5MDZjYzE1YmU1YzQyZTBhYTNiMWVhNmMxNGJlOGE5IiwibmFtZSI6InN6cGVyIiwiZXhwIjoxNTg3Mzk5NjE4fQ.LQt47lcj2njITtnYyMjcvKBbNUeRbCs-o_pfkDhlmQlM5_LMdbxKEoeA6u9HMkFu6F2vlKIhnK-IZCNTTcsjiSzUrGnF8lvK9TlGXBekqgrtWDBjwfA3a5WxBF8F3j6bSEadu-Wzg7_G8zA1WZ7SKxyEXJ5ebNKz3sxVCXAyWt4";

			return {
				code: 20000,
				data: token
			};
		}
	},

	// get user info  /xlshop/sys/user/info
	{
		url:`${baseUrl}/sys/user/info\.*`,
		type: "get",
		response: config => {
			console.log(config.body);

			const mockInfo = {
				"id": "264a7fc8728e4627a9d7d1cf3c415ea8",
				"username": "lemon",
				"password": null,
				"name": "lemon",
				"description": null,
				"avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
				"email": null,
				"roles": ["shop_admin"],
				"menus": [{
					"name": "修改商品",
					"code": "EditProduct",
					"url": "/edit/:id",
					"icon": null,
					"children": null
				}, {
					"name": "销量明细",
					"code": "Operation",
					"url": "/operation/index",
					"icon": "documentation",
					"children": null
				}, {
					"name": "首页",
					"code": "dashboard",
					"url": "/dashboard",
					"icon": "dashboard",
					"children": null
				}, { "name": "商品审核", "code": "check", "url": "/check", "icon": "password", "children": null }, {
					"name": "商品管理",
					"code": "products",
					"url": "/products",
					"icon": "example",
					"children": null
				}, {
					"name": "评价审核",
					"code": "Evaluate",
					"url": "/evaluate",
					"icon": "star",
					"children": null
				}, { "name": "图片配置", "code": "PicSetting", "url": "/pic", "icon": "zip", "children": null }, {
					"name": "商户管理",
					"code": "merchant",
					"url": "/merchant",
					"icon": "example",
					"children": null
				}, {
					"name": "运费管理",
					"code": "templates",
					"url": "/templates",
					"icon": "documentation",
					"children": null
				}, {
					"name": "售后管理",
					"code": "SalesManage",
					"url": "/sales",
					"icon": "zip",
					"children": null
				}, {
					"name": "会员列表",
					"code": "Members",
					"url": "/members",
					"icon": "peoples",
					"children": null
				}, { "name": "用户管理", "code": "Users", "url": "/user", "icon": "edit", "children": null }, {
					"name": "商品管理",
					"code": "ProductManage",
					"url": "/list",
					"icon": "password",
					"children": null
				}, { "name": "订单管理", "code": "OrderList", "url": "/list", "icon": "list", "children": null }, {
					"name": "商户管理",
					"code": "index",
					"url": "/index",
					"icon": "documentation",
					"children": null
				}, { "name": "订单管理", "code": "Orders", "url": "/orders", "icon": "excel", "children": null }, {
					"name": "商户管理",
					"code": "merchantmanage",
					"url": "manage/:id",
					"icon": "documentation",
					"children": null
				}, {
					"name": "基础配置",
					"code": "BaseSetting",
					"url": "/base",
					"icon": "list",
					"children": null
				}, {
					"name": "系统管理",
					"code": "System",
					"url": "/system",
					"icon": "example",
					"children": null
				}, {
					"name": "基础配置",
					"code": "Settings",
					"url": "/settings",
					"icon": "example",
					"children": null
				}, {
					"name": "新建商品",
					"code": "AddProduct",
					"url": "/create",
					"icon": "edit",
					"children": null
				}, { "name": "会员列表", "code": "MembersIndex", "url": "/index", "icon": "peoples", "children": null }],
				"updTime": null
			};

			console.log(mockInfo);

			return {
				code: 20000,
				data: mockInfo
			};
		}
	},

	// getMenusByUserId
	{
		url: `${baseUrl}/user/menu/getMenusByUserId`,
		type: "post",
		response: _ => {
			return {
				code: 20000,
				data: {
					"ucRouteMenuDTOList": [{
						"id": "75ae1de418144e5faf87dfd1ec63f84f",
						"name": "首页",
						"code": "dashboard",
						"url": "/dashboard",
						"icon": "dashboard",
						"isLeaf": null,
						"children": []
					}, {
						"id": "b2cd2a159f494bacbdc3fc0dba0c6d7b",
						"name": "商户管理",
						"code": "merchant",
						"url": "/merchant",
						"icon": "example",
						"isLeaf": null,
						"children": [{
							"id": "1ca1151770554b1295e694f03a9e025f",
							"name": "运费管理",
							"code": "templates",
							"url": "/templates",
							"icon": "documentation",
							"isLeaf": 1,
							"children": null
						}, {
							"id": "495770cd965648e5b8ad11439ef07660",
							"name": "商户管理",
							"code": "index",
							"url": "/index",
							"icon": "documentation",
							"isLeaf": 1,
							"children": null
						}]
					}]
				}
			};
		}
	},

	// user logout
	{
		url: `${baseUrl}/user/logout`,
		type: "post",
		response: _ => {
			return {
				code: 20000,
				data: "success"
			};
		}
	},

	// 获取用户列表
	{
		url: `${baseUrl}/sys/user/list`,
		type: "post",
		response: config => {

			const { shop, shop_status, page, per_num } = config.body;

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
					shop_status: "@integer(1, 2)",
					apply_time: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
				}));
			}

			let mockList = List.filter(item => {
				if(shop && (String(item.shop).indexOf(shop_id) === -1)) return false;
				if(shop_status && item.shop_status != shop_status) return false;
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
];
