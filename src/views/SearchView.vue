<template>
  <div class="search-container">
    <div class="search-header">
      <h1>搜索结果: "{{ searchKeyword }}"</h1>
      <p>找到 {{ total }} 条相关结果</p>
    </div>
    
    <div class="filter-bar">
      <el-select v-model="contentType" placeholder="内容类型" @change="handleFilterChange">
        <el-option label="全部内容" value="all"></el-option>
        <el-option label="文章" value="article"></el-option>
        <el-option label="评论" value="comment"></el-option>
      </el-select>
      
      <el-select v-model="categoryFilter" placeholder="文章分类" @change="handleFilterChange">
        <el-option label="全部分类" value=""></el-option>
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        ></el-option>
      </el-select>
      
      <el-select v-model="timeFilter" placeholder="时间范围" @change="handleFilterChange">
        <el-option label="全部时间" value="all"></el-option>
        <el-option label="最近一周" value="week"></el-option>
        <el-option label="最近一月" value="month"></el-option>
        <el-option label="最近一年" value="year"></el-option>
      </el-select>
      
      <el-select v-model="sortOption" placeholder="排序方式" @change="handleFilterChange">
        <el-option label="相关度" value="relevance"></el-option>
        <el-option label="最新发布" value="newest"></el-option>
        <el-option label="最多阅读" value="most-read"></el-option>
      </el-select>
    </div>
    
    <div class="search-results">
      <el-empty v-if="results.length === 0" description="未找到相关内容"></el-empty>
      
      <template v-else>
        <!-- 文章结果 -->
        <div v-if="contentType === 'all' || contentType === 'article'">
          <div v-for="result in articleResults" :key="result.id" class="result-item">
            <div class="result-type">文章</div>
            <h3 @click="$router.push(`/article/${result.id}`)">{{ result.title }}</h3>
            <p class="result-summary" v-html="highlightKeyword(result.summary)"></p>
            <div class="result-meta">
              <span><i class="el-icon-user"></i> {{ result.author }}</span>
              <span><i class="el-icon-date"></i> {{ result.publishDate }}</span>
              <span><i class="el-icon-collection-tag"></i> {{ result.category }}</span>
              <span><i class="el-icon-view"></i> {{ result.viewCount }} 阅读</span>
            </div>
          </div>
        </div>
        
        <!-- 评论结果 -->
        <div v-if="contentType === 'all' || contentType === 'comment'">
          <div v-for="result in commentResults" :key="result.id" class="result-item">
            <div class="result-type">评论</div>
            <div class="comment-result">
              <div class="comment-content" v-html="highlightKeyword(result.content)"></div>
              <div class="comment-article">
                来自文章: <a @click="$router.push(`/article/${result.articleId}`)">{{ result.articleTitle }}</a>
              </div>
            </div>
            <div class="result-meta">
              <span><i class="el-icon-user"></i> {{ result.username }}</span>
              <span><i class="el-icon-date"></i> {{ result.date }}</span>
            </div>
          </div>
        </div>
      </template>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'SearchView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const results = ref([])
    const loading = ref(false)
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const contentType = ref('all')
    const categoryFilter = ref('')
    const timeFilter = ref('all')
    const sortOption = ref('relevance')
    
    // 搜索关键词
    const searchKeyword = computed(() => route.query.keyword || '')
    
    // 分类数据
    const categories = [
      { id: '1', name: '技术' },
      { id: '2', name: '生活' },
      { id: '3', name: '随笔' },
      { id: '4', name: '教程' }
    ]
    
    // 文章结果
    const articleResults = computed(() => 
      results.value.filter(item => item.type === 'article')
    )
    
    // 评论结果
    const commentResults = computed(() => 
      results.value.filter(item => item.type === 'comment')
    )
    
    // 加载搜索结果
    const loadSearchResults = async () => {
      if (!searchKeyword.value) {
        results.value = []
        total.value = 0
        return
      }
      
      loading.value = true
      try {
        // 实际项目中应调用API，这里模拟数据
        const params = {
          keyword: searchKeyword.value,
          page: currentPage.value,
          pageSize: pageSize.value,
          type: contentType.value,
          category: categoryFilter.value,
          time: timeFilter.value,
          sort: sortOption.value
        }
        
        // 模拟API调用
        setTimeout(() => {
          // 生成模拟数据
          let mockResults = []
          
          // 文章结果
          if (contentType.value === 'all' || contentType.value === 'article') {
            const articleCount = contentType.value === 'all' ? 6 : 10
            const articleResults = Array.from({ length: articleCount }, (_, index) => ({
              id: `article-${currentPage.value}-${index}`,
              type: 'article',
              title: `包含"${searchKeyword.value}"的文章标题 ${currentPage.value}-${index}`,
              summary: `这是一篇关于${searchKeyword.value}的文章摘要，详细介绍了相关内容和应用场景...`,
              author: '作者名称',
              publishDate: new Date().toLocaleDateString(),
              category: categories[Math.floor(Math.random() * categories.length)].name,
              viewCount: Math.floor(Math.random() * 1000)
            }))
            
            mockResults = [...mockResults, ...articleResults]
          }
          
          // 评论结果
          if (contentType.value === 'all' || contentType.value === 'comment') {
            const commentCount = contentType.value === 'all' ? 4 : 10
            const commentResults = Array.from({ length: commentCount }, (_, index) => ({
              id: `comment-${currentPage.value}-${index}`,
              type: 'comment',
              content: `这是一条包含"${searchKeyword.value}"关键词的评论内容，表达了对文章的看法和建议...`,
              username: `用户${Math.floor(Math.random() * 1000)}`,
              date: new Date().toLocaleDateString(),
              articleId: `article-${index}`,
              articleTitle: `文章标题 ${index}`
            }))
            
            mockResults = [...mockResults, ...commentResults]
          }
          
          results.value = mockResults
          total.value = 100 // 模拟总数
          loading.value = false
        }, 500)
      } catch (error) {
        ElMessage.error('搜索失败')
        loading.value = false
      }
    }
    
    // 高亮关键词
    const highlightKeyword = (text) => {
      if (!searchKeyword.value) return text
      
      const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
      return text.replace(regex, '<span class="highlight">$1</span>')
    }
    
    // 筛选变更
    const handleFilterChange = () => {
      currentPage.value = 1
      loadSearchResults()
    }
    
    // 页码变更
    const handlePageChange = (page) => {
      currentPage.value = page
      loadSearchResults()
    }
    
    // 监听搜索关键词变化
    watch(() => route.query.keyword, () => {
      currentPage.value = 1
      contentType.value = 'all'
      categoryFilter.value = ''
      timeFilter.value = 'all'
      sortOption.value = 'relevance'
      loadSearchResults()
    })
    
    onMounted(() => {
      loadSearchResults()
    })
    
    return {
      results,
      articleResults,
      commentResults,
      loading,
      total,
      currentPage,
      pageSize,
      searchKeyword,
      contentType,
      categoryFilter,
      timeFilter,
      sortOption,
      categories,
      highlightKeyword,
      handleFilterChange,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.search-header {
  margin-bottom: 30px;
}

.search-header h1 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 24px;
}

.search-header p {
  color: #606266;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.search-results {
  margin-bottom: 30px;
}

.result-item {
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.result-type {
  display: inline-block;
  padding: 2px 8px;
  background-color: #E6F7FF;
  color: #1890FF;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
}

.result-item h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  cursor: pointer;
}

.result-item h3:hover {
  color: #409EFF;
}

.result-summary {
  margin-bottom: 10px;
  color: #606266;
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}

.comment-result {
  margin-bottom: 10px;
}

.comment-content {
  margin-bottom: 8px;
}

.comment-article {
  font-size: 14px;
}

.comment-article a {
  color: #409EFF;
  cursor: pointer;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

:deep(.highlight) {
  background-color: #FFFF00;
  font-weight: bold;
  padding: 0 2px;
}
</style>
