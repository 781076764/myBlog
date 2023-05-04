import { createStore } from 'vuex'

export default createStore({
  state: {
    userInfo: {},
    isLogin: false,
    darkMode: false
  },
  mutations: {
    login(state, userInfo) {
      state.isLogin = true
      state.userInfo = userInfo
    },
    loginout(state) {
      state.isLogin = false
      state.userInfo = {}
    },
    changeDarkMode(state, bool) {
      state.darkMode = bool
    }
  },
  actions: {
    getDarkMode(context) {
      return context.state.darkMode
    }
  },
  modules: {
  }
})
