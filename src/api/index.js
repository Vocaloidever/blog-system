import axios from 'axios'
import store from '@/store'
import router from '@/router';
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token到请求头
    if (store.state.user.token) {
      config.headers['Authorization'] = `Bearer ${store.state.user.token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据实际API返回格式调整
    if (res.code && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      
      // 处理特定错误码，如401未授权
      if (res.code === 401) {
        store.dispatch('user/logout')
        router.push('/login')
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误:', error)
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default service
