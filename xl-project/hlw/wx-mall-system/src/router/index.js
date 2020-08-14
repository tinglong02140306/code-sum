import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
	{
		path: "/redirect",
		component: Layout,
		hidden: true,
		children: [
			{
				path: "/redirect/:path(.*)",
				component: () => import("@/views/redirect/index")
			}
		]
	},
	{
		path: "/login",
		name:"login",
		component: () => import("@/views/login/index"),
		hidden: true
	},
	{
		path: "/auth-redirect",
		component: () => import("@/views/login/auth-redirect"),
		hidden: true
	},
	{
		path: "/404",
		component: () => import("@/views/error-page/404"),
		hidden: true
	},
	{
		path: "/401",
		component: () => import("@/views/error-page/401"),
		hidden: true
	},
	{
		path: "/",
		component: Layout,
		redirect: "/dashboard",
		children: [
			{
				path: "dashboard",
				component: () => import("@/views/dashboard/index"),
				name: "Dashboard",
				meta: { title: "首页", icon: "dashboard", affix: true }
			}
		]
	},
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
	{
		path: "/merchant",
		component: Layout,
		redirect: "/merchant/index",
		name: "Merchants",
		authority: 'merchant',
		alwaysShow: true,
		meta: {
			title: "商户管理",
			icon: "example"
		},
		children: [
			{
				path: "index",
				component: () => import("@/views/merchant/index"),
				name: "Merchant",
				meta: { title: "商户管理", icon: "documentation", affix: true },
				authority: 'index',
			},
			{
				path: "manage/:id",
				component: () => import("@/views/merchant/manage"),
				name: "MerchantManage",
				meta: { title: "商户管理", icon: "documentation", affix: true,activeMenu: "/merchant/index" },
				authority: 'merchantmanage',
				hidden: true
			},
			{
				path: "templates",
				component: () => import("@/views/merchant/ship-list"),
				name: "DeliveryTemplate",
				meta: { title: "运费管理", icon: "documentation", affix: true },
				authority: 'templates',
			},
		]
	},
	{
		path: "/products",
		component: Layout,
		redirect: "/products/list",
		name: "Products",
		alwaysShow: true,
		authority: 'products',
		meta: {
			title: "商品管理",
			icon: "example"
		},
		children: [
			{
				path: "list",
				component: () => import("@/views/product/list"),
				name: "ProductManage",
				authority: 'ProductManage',
				meta: { title: "商品管理", icon: "list" }
			},
			{
				path: "category",
				component: () => import("@/views/product/category"),
				name: "Category",
				authority: 'Category',
				meta: { title: "类别管理", icon: "list" }
			},
			{
				path: "check",
				component: () => import("@/views/product/check"),
				name: "ProductCheck",
				authority: 'check',
				meta: { title: "商品审核", icon: "password" }
			},
			{
				path: "create",
				component: () => import("@/views/product/create"),
				name: "AddProduct",
				authority: "AddProduct",
				meta: { title: "新建商品", icon: "edit",activeMenu: "/products/list" },
				hidden: true
			},
			{
				path: "edit/:id",
				component: () => import("@/views/product/edit"),
				name: "EditProduct",
				authority: "EditProduct",
				meta: { title: "修改商品", noCache: true, activeMenu: "/products/list" },
				hidden: true
			}
		]
	},
	{
		path: "/orders",
		component: Layout,
		redirect: "/orders/list",
		name: "Orders",
		authority: "Orders",
		meta: {
			title: "订单管理",
			icon: "excel"
		},
		children: [
			{
				path: "list",
				component: () => import("@/views/order/list"),
				name: "OrderList",
				authority: "OrderList",
				meta: { title: "订单管理", icon: "list" }
			},
			{
				path: "sales",
				component: () => import("@/views/order/after-sale"),
				name: "SalesManage",
				authority: "SalesManage",
				meta: { title: "售后管理", noCache: true, icon: "zip" },
			},
			{
				path: "evaluate",
				component: () => import("@/views/order/evaluate"),
				name: "Evaluate",
				authority: "Evaluate",
				meta: { title: "评价审核", icon: "star" }
			},
		]
	},
	{
		path: "/members",
		name: "Members",
		authority: "Members",
		component: Layout,
		children: [
			{
				path: "index",
				component: () => import("@/views/members/index"),
				name: "MembersIndex",
				authority: "MembersIndex",
				meta: { title: "会员列表", icon: "peoples", affix: true }
			}
		]
	},
	{
		path: "/operation",
		component: Layout,
		authority: "Operation",
		children: [
			{
				path: "index",
				component: () => import("@/views/operation/index"),
				name: "Operation",
				authority: "Operation",
				meta: { title: "销量明细", icon: "documentation", affix: true }
			}
		]
	},
	{
		path: "/settings",
		component: Layout,
		redirect: "/example/list",
		alwaysShow: true,
		name: "Settings",
		authority: "Settings",
		meta: {
			title: "基础配置",
			icon: "example"
		},
		children: [
			{
				path: "pic",
				component: () => import("@/views/setting/pic-setting"),
				name: "PicSetting",
				authority: "PicSetting",
				meta: { title: "图片配置", noCache: true, icon: "zip" },
			}
		]
	},
	{
		path: "/system",
		component: Layout,
		redirect: "/system/user",
		name: "System",
		authority: "System",
		meta: {
			title: "系统管理",
			icon: "example"
		},
		children: [
			{
				path: "user",
				component: () => import("@/views/system/user"),
				name: "Users",
				authority: "Users",
				meta: { title: "用户管理", icon: "edit" }
			}
		]
	},

	// 404 page must be placed at the end !!!
	{ path: "*", redirect: "/404", hidden: true }
];

const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({ y: 0 }),
    // routes: constantRoutes,
    routes: [...constantRoutes,...asyncRoutes]
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter(){
	const newRouter = createRouter();
	router.matcher = newRouter.matcher; // reset router
}

export default router;
