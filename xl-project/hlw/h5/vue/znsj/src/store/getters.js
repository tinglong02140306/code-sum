/* 全局getter */
export default {
  // 加载中状态
  isLoading: state => state.isLoading,
  // 登录状态
  isLogin: (state) => {
    if (!state.isLogin) {
      state.isLogin = sessionStorage.getItem('isLogin') // 从sessionStorage中读取状态
      state.userName = sessionStorage.getItem('userName')
    }
    return state.isLogin
  }
}
