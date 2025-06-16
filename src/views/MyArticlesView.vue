<template>
  <div class="my-articles-container">
    <div class="page-header">
      <h1>我的文章</h1>
      <el-button type="primary" @click="$router.push('/publish')">
        <i class="el-icon-plus"></i> 发布新文章
      </el-button>
    </div>
    
    <div class="filter-bar">
      <el-select v-model="statusFilter" placeholder="文章状态" @change="handleFilterChange">
        <el-option label="全部" value=""></el-option>
        <el-option label="已发布" value="published"></el-option>
        <el-option label="草稿" value="draft"></el-option>
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
      
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章标题"
        prefix-icon="el-icon-search"
        clearable
        @input="handleSearch"
      ></el-input>
    </div>
    
    <el-table
      v-loading="loading"
      :data="articles"
      style="width: 100%"
      border
    >
      <el-table-column prop="title" label="文章标题" min-width="200">
        <template #default="{ row }">
          <router-link :to="`/article/${row.id}`" class="article-title-link">
            {{ row.title }}
          </router-link>
          <el-tag v-if="row.status === 'draft'" size="small" type="info">草稿</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="category" label="分类" width="100"></el-table-column>
      
      <el-table-column prop="publishDate" label="发布日期" width="120"></el-table-column>
      
      <el-table-column prop="viewCount" label="阅读量" width="100" sortable></el-table-column>
      
      <el-table-column prop="commentCount" label="评论数" width="100" sortable></el-table-column>
      
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            size="small" 
            type="primary" 
            @click="editArticle(row.id)"
            plain
          >
            编辑
          </el-button>
          
          <el-button 
            size="small" 
            type="danger" 
            @click="deleteArticle(row.id)"
            plain
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'MyArticlesView',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const articles = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const statusFilter = ref('')
    const categoryFilter = ref('')
    const searchKeyword = ref('')
    
    // 分类数据
    const categories = [
      { id: '1', name: '技术' },
      { id: '2', name: '生活' },
      { id: '3', name: '随笔' },
      { id: '4', name: '教程' }
    ]
    
    // 加载文章列表
    const loadArticles = () => {
      loading.value = true
      
      // 构建查询参数
      const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        status: statusFilter.value,
        category: categoryFilter.value,
        keyword: searchKeyword.value
      }
      
      // 模拟API调用
      setTimeout(() => {
        // 生成模拟数据
        const mockArticles = Array.from({ length: pageSize.value }, (_, index) => ({
          id: `${currentPage.value}-${index}`,
          title: `我的文章标题 ${currentPage.value}-${index}`,
          category: categories[Math.floor(Math.random() * categories.length)].name,
          publishDate: new Date().toLocaleDateString(),
          viewCount: Math.floor(Math.random() * 1000),
          commentCount: Math.floor(Math.random() * 50),
          status: index % 5 === 0 ? 'draft' : 'published'
        }))
        
        articles.value = mockArticles
        total.value = 85 // 模拟总数
        loading.value = false
      }, 500)
    }
    
    // 编辑文章
    const editArticle = (id) => {
      router.push(`/edit/${id}`)
    }
    
    // 删除文章
    const deleteArticle = (id) => {
      ElMessageBox.confirm('确定要删除这篇文章吗？此操作不可恢复', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟删除请求
        setTimeout(() => {
          articles.value = articles.value.filter(article => article.id !== id)
          ElMessage.success('文章已删除')
        }, 500)
      }).catch(() => {})
    }
    
    // 筛选变更
    const handleFilterChange = () => {
      currentPage.value = 1
      loadArticles()
    }
    
    // 搜索处理
    const handleSearch = () => {
      currentPage.value = 1
      loadArticles()
    }
    
    // 页码变更
    const handlePageChange = (page) => {
      currentPage.value = page
      loadArticles()
    }
    
    // 每页条数变更
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      loadArticles()
    }
    
    onMounted(() => {
      loadArticles()
    })
    
    return {
      loading,
      articles,
      total,
      currentPage,
      pageSize,
      statusFilter,
      categoryFilter,
      searchKeyword,
      categories,
      editArticle,
      deleteArticle,
      handleFilterChange,
      handleSearch,
      handlePageChange,
      handleSizeChange
    }
  }
}
</script>

<style scoped>
.my-articles-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.article-title-link {
  margin-right: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.article-title-link {
  color: #303133;
  text-decoration: none;
}

.article-title-link:hover {
  color: #409EFF;
}
</style>
