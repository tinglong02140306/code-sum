import { asyncRoutes, constantRoutes } from "@/router";


function hasPermission(menus, route){
	if(route.authority) {
		if(menus[route.authority] !== undefined) {
			return !!menus[route.authority];
		} else {
			return false;
		}
	} else {
		// return true;
		return false;
	}
}


function filterAsyncRoutes(asyncRouterMap, menus){
	const accessedRouters = asyncRouterMap.filter(route => {
		if(hasPermission(menus, route)) {
			if(route.children && route.children.length) {
				route.children = filterAsyncRoutes(route.children, menus);
			}
			return true;
		}
		return false;
	});
	return accessedRouters;
}

const state = {
	routes: constantRoutes,
	addRoutes: []
};

const mutations = {
	SET_ROUTES: (state, routes) => {
		state.addRoutes = routes;
		state.routes = constantRoutes.concat(routes);
	}
};

const actions = {
	generateRoutes({ commit }, menus){
		return new Promise(resolve => {
			let accessedRoutes = filterAsyncRoutes(asyncRoutes, menus);
			let notFound = { path: "*", redirect: "/404", hidden: true };
			accessedRoutes.push(notFound);
			commit("SET_ROUTES", accessedRoutes);
			resolve(accessedRoutes);
		});
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
