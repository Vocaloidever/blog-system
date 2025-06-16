export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
  },
  getters: {
    isLoggedIn: state => !!state.token
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    CLEAR_USER_DATA(state) {
      state.token = ''
      state.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },
  actions: {
    // 登录
    async login({ commit }, credentials) {
      try {
        // 实际项目中应调用API，这里模拟登录
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟登录成功
            const token = 'mock_token_' + Date.now()
            const userInfo = {
              id: '1',
              username: '测试用户',
              email: credentials.email,
              avatar: 'https://picsum.photos/id/1005/100/100',
              bio: '这是一个测试账号'
            }
            
            commit('SET_TOKEN', token)
            commit('SET_USER_INFO', userInfo)
            resolve()
          }, 1000)
        })
      } catch (error) {
        throw new Error('登录失败')
      }
    },
    
    // 注册
    async register({ commit }, userData) {
      try {
        // 实际项目中应调用API，这里模拟注册
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 1000)
        })
      } catch (error) {
        throw new Error('注册失败')
      }
    },
    
    // 退出登录
    logout({ commit }) {
      commit('CLEAR_USER_DATA')
    },
    
    // 更新用户信息
    async updateUserInfo({ commit }, userData) {
      try {
        // 实际项目中应调用API，这里模拟更新
        return new Promise((resolve) => {
          setTimeout(() => {
            commit('SET_USER_INFO', { ...userData })
            resolve()
          }, 1000)
        })
      } catch (error) {
        throw new Error('更新用户信息失败')
      }
    }
  }
}
