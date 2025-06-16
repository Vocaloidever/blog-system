<!-- src/views/CategoriesView.vue -->
<template>
  <div class="categories-container">
    <div class="categories-header">
      <h1>文章分类</h1>
      <p>探索不同主题的精彩内容</p>
    </div>
    
    <div class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.id" 
        class="category-card"
        @click="goToCategory(category.id)"
      >
        <div class="category-icon">
          <i :class="category.icon"></i>
        </div>
        <h2>{{ category.name }}</h2>
        <p class="category-count">{{ category.count }} 篇文章</p>
        <div class="category-description">
          {{ category.description }}
        </div>
        <el-button type="primary" class="view-button">查看文章</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CategoriesView',
  setup() {
    const router = useRouter()
    const categories = ref([
      { 
        id: '1', 
        name: '技术', 
        icon: 'el-icon-monitor',
        count: 42,
        description: '探索最新的技术趋势、编程语言、框架和工具，分享开发经验和最佳实践。' 
      },
      { 
        id: '2', 
        name: '生活', 
        icon: 'el-icon-coffee-cup',
        count: 18,
        description: '记录日常生活中的点滴，分享生活方式、旅行见闻和个人感悟。' 
      },
      { 
        id: '3', 
        name: '随笔', 
        icon: 'el-icon-notebook-2',
        count: 24,
        description: '自由表达的空间，记录灵感、思考和创意，不拘泥于形式的文字集合。' 
      },
      { 
        id: '4', 
        name: '教程', 
        icon: 'el-icon-reading',
        count: 36,
        description: '详细的步骤指南和实用教程，帮助读者学习新技能和解决实际问题。' 
      }
    ])
    
    const goToCategory = (id) => {
      router.push(`/category/${id}`)
    }
    
    return {
      categories,
      goToCategory
    }
  }
}
</script>

<style scoped>
.categories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.categories-header {
  text-align: center;
  margin-bottom: 40px;
}

.categories-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #303133;
}

.categories-header p {
  font-size: 16px;
  color: #606266;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.category-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.category-icon {
  font-size: 50px;
  color: #409EFF;
  margin-bottom: 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-card h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #303133;
}

.category-count {
  font-size: 16px;
  color: #409EFF;
  font-weight: bold;
  margin-bottom: 15px;
}

.category-description {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.view-button {
  width: 100%;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
