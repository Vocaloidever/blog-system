import { createStore } from 'vuex'
import user from './modules/user'

export default createStore({
  state: {
    // 全局状态
  },
  getters: {
    // 全局计算属性
  },
  mutations: {
    // 全局状态修改
  },
  actions: {
    // 全局异步操作
  },
  modules: {
    user
  }
})
