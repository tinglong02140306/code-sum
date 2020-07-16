import { login, logout, getInfo, resetPwd } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";
import { updateUcUser, updateUser } from "../../api/user";

const state = {
	token: getToken(),
	name: "",
	avatar: "",
	roles: [],
	id: "",
	menus: undefined,
	permissionMenus: undefined,
	username: "",
	apps: "",
	shopId: "",
	shopName: "",
	level: ""
};

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_NAME: (state, name) => {
		state.name = name;
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar;
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles;
	},
	SET_ID: (state, id) => {
		state.id = id;
	},
	SET_MENUS: (state, menus) => {
		state.menus = menus;
	},
	SET_PERMISSION_MENUS: (state, permissionMenus) => {
		state.permissionMenus = permissionMenus;
	},
	SET_USERNAME: (state, username) => {
		state.username = username;
	},
	SET_APPS: (state, apps) => {
		state.apps = apps;
	},
	SET_SHOP_ID: (state, shopId) => {
		state.shopId = shopId;
	},
	SET_SHOP_NAME: (state, shopName) => {
		state.shopName = shopName;
	},
	SET_LEVEL: (state, level) => {
		state.level = level;
	},
};

const actions = {
	// user login
	login({ commit }, userInfo){
		console.log(userInfo);
		const { username, password } = userInfo;
		return new Promise((resolve, reject) => {
			login({ username: username.trim(), password: password }).then(response => {
				console.log(response);
				const { data: token } = response;
				commit("SET_TOKEN", token);
				setToken(token);
				resolve();
			}).catch(error => {
				reject(error);
			});
		});
	},

	resetPass({ commit, state, dispatch }, info){
		return new Promise((resolve, reject) => {
			updateUser(info).then(() => {
				resolve();
			}).catch(error => {
				reject(error);
			});
		});
	},

	// get user info
	getInfo({ commit, state }){
		return new Promise((resolve, reject) => {
			getInfo(state.token).then(response => {
				const { data } = response;

				const { roles, name, avatar, id, menus, username, apps, shop_id: shopId, shop_name: shopName, level } = data;

				// roles must be a non-empty array
				if(!roles || roles.length <= 0) {
					reject("用户角色查询失败!");
				} else {
					commit("SET_ROLES", roles);
				}

				const menu = {};
				for(let i = 0; i < menus.length; i++) {
					menu[menus[i].code] = true;
				}

				commit("SET_ROLES", roles);
				commit("SET_MENUS", menu);
				commit("SET_NAME", name);
				commit("SET_AVATAR", avatar);
				commit("SET_ID", id);
				commit("SET_USERNAME", username);
				commit("SET_APPS", apps);
				commit("SET_SHOP_ID", shopId);
				commit("SET_SHOP_NAME", shopName);
				commit("SET_LEVEL", level);

				resolve(response);
			}).catch(error => {
				reject(error);
			});
		});
	},

	// user logout
	logout({ commit, state, dispatch }){
		return new Promise((resolve, reject) => {
			// logout(state.token).then(() => {
			try {
				commit("SET_TOKEN", "");
				commit("SET_ROLES", []);
				removeToken();
				resetRouter();
				dispatch("tagsView/delAllViews", null, { root: true });
				resolve();
			} catch (error) {
				reject(error);
			}
			// 	commit("SET_TOKEN", "");
			// 	commit("SET_ROLES", []);
			// 	removeToken();
			// 	resetRouter();
			//
			// 	// reset visited views and cached views
			// 	// to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
			// 	dispatch("tagsView/delAllViews", null, { root: true });
			//
			// 	resolve();
			// }).catch(error => {
			// 	reject(error);
			// });
		});
	},

	// remove token
	resetToken({ commit }){
		return new Promise(resolve => {
			commit("SET_TOKEN", "");
			commit("SET_ROLES", []);
			removeToken();
			resolve();
		});
	},

	// dynamically modify permissions
	changeRoles({ commit, dispatch }, role){
		return new Promise(async resolve => {
			const token = role + "-token";

			commit("SET_TOKEN", token);
			setToken(token);

			const { roles } = await dispatch("getInfo");

			resetRouter();

			// generate accessible routes map based on roles
			const accessRoutes = await dispatch("permission/generateRoutes", roles, { root: true });

			// dynamically add accessible routes
			router.addRoutes(accessRoutes);

			// reset visited views and cached views
			dispatch("tagsView/delAllViews", null, { root: true });

			resolve();
		});
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
