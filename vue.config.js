const { defineConfig } = require('@vue/cli-service')

module.exports = {
  lintOnSave: false
}

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    open: true,
    // 如果需要代理API请求
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // 如果部署到非根路径
  publicPath: process.env.NODE_ENV === 'production' ? '/blog-system/' : '/'
})
