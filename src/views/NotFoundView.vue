<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
}

.not-found-content h1 {
  font-size: 120px;
  margin: 0;
  color: #409EFF;
  line-height: 1;
}

.not-found-content h2 {
  font-size: 30px;
  margin: 20px 0;
  color: #303133;
}

.not-found-content p {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
}
</style>
