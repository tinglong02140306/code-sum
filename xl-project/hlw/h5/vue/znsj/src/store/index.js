// 引入依赖
import Vue from 'vue'
import Vuex from 'vuex'
// 引入state 模块
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state from './states'

// 使用 vuex
Vue.use(Vuex)
/**
 * Store 对象
 * @type {Vuex}
 */
export default new Vuex.Store({
  // 全部的应用层级状态
  state,
  // 有时候我们需要从 store 中的 state 中派生出一些状态
  getters,
  // 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  mutations,
  // Action 提交的是 mutation，而不是直接变更状态
  actions
})
