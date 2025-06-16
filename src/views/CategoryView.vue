<!-- src/views/CategoryView.vue -->
<template>
  <div class="category-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <template v-else>
      <div class="category-header" :style="headerStyle">
        <div class="category-header-content">
          <div class="category-icon">
            <i :class="categoryIcon"></i>
          </div>
          <h1>{{ categoryName }}</h1>
          <p>{{ categoryDescription }}</p>
          <div class="category-stats">
            <span>{{ total }} 篇文章</span>
          </div>
        </div>
      </div>
      
      <div class="filter-bar">
        <el-select v-model="sortOption" placeholder="排序方式" @change="handleSortChange">
          <el-option label="最新发布" value="newest"></el-option>
          <el-option label="最多阅读" value="most-read"></el-option>
          <el-option label="最多评论" value="most-comments"></el-option>
        </el-select>
        
        <el-input
          v-model="searchKeyword"
          placeholder="在当前分类中搜索"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter="handleSearch"
        ></el-input>
      </div>
      
      <div class="article-list">
        <el-empty v-if="articles.length === 0" description="暂无文章"></el-empty>
        
        <div v-else class="article-grid">
          <div 
            v-for="article in articles" 
            :key="article.id" 
            class="article-card"
            @click="viewArticle(article.id)"
          >
            <div class="article-image">
              <img :src="article.coverImage" :alt="article.title">
            </div>
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-summary">{{ article.summary }}</p>
              <div class="article-meta">
                <span><i class="el-icon-user"></i> {{ article.author }}</span>
                <span><i class="el-icon-date"></i> {{ article.publishDate }}</span>
                <span><i class="el-icon-view"></i> {{ article.viewCount }}</span>
                <span><i class="el-icon-chat-dot-round"></i> {{ article.commentCount }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'CategoryView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const articles = ref([])
    const loading = ref(true)
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const searchKeyword = ref('')
    const sortOption = ref('newest')
    
    // 分类数据
    const categories = [
      { 
        id: '1', 
        name: '技术', 
        icon: 'el-icon-monitor',
        color: '#409EFF',
        description: '探索最新的技术趋势、编程语言、框架和工具，分享开发经验和最佳实践。' 
      },
      { 
        id: '2', 
        name: '生活', 
        icon: 'el-icon-coffee-cup',
        color: '#67C23A',
        description: '记录日常生活中的点滴，分享生活方式、旅行见闻和个人感悟。' 
      },
      { 
        id: '3', 
        name: '随笔', 
        icon: 'el-icon-notebook-2',
        color: '#E6A23C',
        description: '自由表达的空间，记录灵感、思考和创意，不拘泥于形式的文字集合。' 
      },
      { 
        id: '4', 
        name: '教程', 
        icon: 'el-icon-reading',
        color: '#F56C6C',
        description: '详细的步骤指南和实用教程，帮助读者学习新技能和解决实际问题。' 
      }
    ]
    
    // 当前分类ID
    const categoryId = computed(() => route.params.id)
    
    // 当前分类信息
    const currentCategory = computed(() => {
      return categories.find(c => c.id === categoryId.value) || {
        name: '未知分类',
        icon: 'el-icon-question',
        color: '#909399',
        description: '该分类不存在或已被删除'
      }
    })
    
    // 当前分类名称
    const categoryName = computed(() => currentCategory.value.name)
    
    // 当前分类图标
    const categoryIcon = computed(() => currentCategory.value.icon)
    
    // 当前分类描述
    const categoryDescription = computed(() => currentCategory.value.description)
    
    // 头部样式
    const headerStyle = computed(() => {
      return {
        backgroundColor: currentCategory.value.color,
        color: '#fff'
      }
    })
    
    // 加载文章列表
    const loadArticles = async () => {
      loading.value = true
      console.log('Loading articles for category:', categoryId.value)
      
      try {
        // 实际项目中应调用API，这里模拟数据
        // eslint-disable-next-line no-unused-vars
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          category: categoryId.value,
          keyword: searchKeyword.value,
          sort: sortOption.value
        }
        
        // 模拟API调用
        setTimeout(() => {
          // 生成模拟数据
          const mockArticles = Array.from({ length: 10 }, (_, index) => ({
            id: `${categoryId.value}-${currentPage.value}-${index}`,
            title: `${categoryName.value}分类文章 ${currentPage.value}-${index}`,
            summary: '这是文章摘要，简要介绍文章的主要内容和核心观点，吸引读者点击阅读全文...',
            author: '作者名称',
            publishDate: new Date().toLocaleDateString(),
            category: categoryName.value,
            viewCount: Math.floor(Math.random() * 1000),
            commentCount: Math.floor(Math.random() * 50),
            coverImage: `https://picsum.photos/id/${parseInt(categoryId.value) * 10 + index + 10}/600/400`
          }))
          
          articles.value = mockArticles
          total.value = 100 // 模拟总数
          loading.value = false
        }, 800)
      } catch (error) {
        console.error('Failed to load articles:', error)
        ElMessage.error('获取文章列表失败')
        loading.value = false
      }
    }
    
    // 查看文章详情
    const viewArticle = (id) => {
      router.push(`/article/${id}`)
    }
    
    // 搜索处理
    const handleSearch = () => {
      currentPage.value = 1
      loadArticles()
    }
    
    // 排序方式变更
    const handleSortChange = () => {
      currentPage.value = 1
      loadArticles()
    }
    
    // 页码变更
    const handlePageChange = (page) => {
      currentPage.value = page
      loadArticles()
    }
    
    // 监听分类ID变化
    watch(() => route.params.id, (newId) => {
      console.log('Category ID changed to:', newId)
      currentPage.value = 1
      searchKeyword.value = ''
      sortOption.value = 'newest'
      loadArticles()
    })
    
    onMounted(() => {
      console.log('CategoryView mounted, ID:', categoryId.value)
      loadArticles()
    })
    
    return {
      articles,
      loading,
      total,
      currentPage,
      pageSize,
      searchKeyword,
      sortOption,
      categoryName,
      categoryIcon,
      categoryDescription,
      headerStyle,
      viewArticle,
      handleSearch,
      handleSortChange,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.category-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.loading-container {
  padding: 40px 20px;
}

.category-header {
  padding: 60px 20px;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
}

.category-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.category-header-content {
  position: relative;
  z-index: 1;
}

.category-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.category-header h1 {
  font-size: 36px;
  margin-bottom: 15px;
}

.category-header p {
  max-width: 700px;
  margin: 0 auto 20px;
  font-size: 18px;
  opacity: 0.9;
}

.category-stats {
  font-size: 16px;
  opacity: 0.8;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin: 0 20px 30px;
}

.article-list {
  padding: 0 20px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.article-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-image {
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  padding: 20px;
}

.article-title {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  height: 54px;
}

.article-summary {
  color: #606266;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
  height: 72px;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
  
  .category-header {
    padding: 40px 20px;
  }
  
  .category-header h1 {
    font-size: 28px;
  }
  
  .category-header p {
    font-size: 16px;
  }
}
</style>
