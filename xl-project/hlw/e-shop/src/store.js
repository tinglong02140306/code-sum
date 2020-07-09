import Vue from "vue";
import Vuex from "vuex";
import state from "./store/state";
import getters from "./store/getters";
import mutations from "./store/mutations";
import actions from "./store/actions";
import createLogger from "vuex/dist/logger";
import createPersistedState from "vuex-persistedstate";

const debug = process.env.NODE_ENV !== "production";

Vue.use(Vuex);

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
	plugins: debug ? [createLogger(), createPersistedState({
		reducer: (persistedState) => {
			const stateFilter = Object.assign({}, persistedState);
			// const blackList = ["imgIdFace", "imgIdBack", "imgVehicle1", "imgVehicle2", "imgCar", "idCardInfo"];
			// blackList.forEach((item) => {
			// 	delete stateFilter[item];
			// });
			return stateFilter;
		}
	})] : [createPersistedState({
		reducer: (persistedState) => {
			const stateFilter = Object.assign({}, persistedState);
			// const blackList = ["imgIdFace", "imgIdBack", "imgVehicle1", "imgVehicle2", "imgCar", "idCardInfo"];
			// blackList.forEach((item) => {
			// 	delete stateFilter[item];
			// });
			return stateFilter;
		}
	})]
});
