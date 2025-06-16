<template>
  <div class="article-list-container">
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索文章标题或内容"
        prefix-icon="el-icon-search"
        clearable
        @input="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      
      <div class="filter-options">
        <el-select v-model="selectedCategory" placeholder="选择分类" @change="handleCategoryChange">
          <el-option label="全部分类" value=""></el-option>
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
        
        <el-select v-model="sortOption" placeholder="排序方式" @change="handleSortChange">
          <el-option label="最新发布" value="newest"></el-option>
          <el-option label="最多阅读" value="most-read"></el-option>
          <el-option label="最多评论" value="most-comments"></el-option>
        </el-select>
      </div>
    </div>
    
    <div class="article-list">
      <el-empty v-if="articles.length === 0" description="暂无文章"></el-empty>
      
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @click="viewArticle(article.id)"
      />
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

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ArticleCard from '@/components/blog/ArticleCard.vue'
import { fetchArticles } from '@/api/article'

export default {
  name: 'ArticleListView',
  components: {
    ArticleCard
  },
  setup() {
    const router = useRouter()
    const articles = ref([])
    const loading = ref(false)
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const sortOption = ref('newest')
    
    // 模拟分类数据
    const categories = [
      { id: '1', name: '技术' },
      { id: '2', name: '生活' },
      { id: '3', name: '随笔' },
      { id: '4', name: '教程' }
    ]
    
    // 加载文章列表
    const loadArticles = async () => {
      loading.value = true
      try {
        // 实际项目中应调用API，这里模拟数据
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchQuery.value,
          category: selectedCategory.value,
          sort: sortOption.value
        }
        
        // 模拟API调用
        setTimeout(() => {
          // 生成模拟数据
          const mockArticles = Array.from({ length: 10 }, (_, index) => ({
            id: `${currentPage.value}-${index}`,
            title: `文章标题 ${currentPage.value}-${index}`,
            summary: '这是文章摘要，简要介绍文章的主要内容...',
            author: '作者名称',
            publishDate: new Date().toLocaleDateString(),
            category: categories[Math.floor(Math.random() * categories.length)].name,
            viewCount: Math.floor(Math.random() * 1000),
            commentCount: Math.floor(Math.random() * 50),
            coverImage: `https://picsum.photos/id/${index + 10}/300/200`
          }))
          
          articles.value = mockArticles
          total.value = 100 // 模拟总数
          loading.value = false
        }, 500)
      } catch (error) {
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
    
    // 分类筛选
    const handleCategoryChange = () => {
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
    
    onMounted(() => {
      loadArticles()
    })
    
    return {
      articles,
      loading,
      total,
      currentPage,
      pageSize,
      searchQuery,
      selectedCategory,
      sortOption,
      categories,
      viewArticle,
      handleSearch,
      handleCategoryChange,
      handleSortChange,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.article-list-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.filter-options {
  display: flex;
  margin-top: 15px;
  gap: 15px;
}

.article-list {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
