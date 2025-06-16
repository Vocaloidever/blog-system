<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.description }}</p>
              <el-button type="primary" @click="$router.push(banner.link)">阅读更多</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 特色文章 -->
    <div class="featured-section container py-30">
      <h2 class="section-title">精选文章</h2>
      <div class="featured-articles">
        <div v-for="article in featuredArticles" :key="article.id" class="featured-article-card">
          <div class="article-image">
            <img :src="article.coverImage" :alt="article.title">
          </div>
          <div class="article-info">
            <h3 @click="$router.push(`/article/${article.id}`)">{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <div class="article-meta">
              <span><i class="el-icon-user"></i> {{ article.author }}</span>
              <span><i class="el-icon-date"></i> {{ article.publishDate }}</span>
              <span><i class="el-icon-view"></i> {{ article.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分类展示 -->
    <div class="categories-section py-30" style="background-color: #f0f2f5;">
      <div class="container">
        <h2 class="section-title">文章分类</h2>
        <div class="categories-grid">
          <div v-for="category in categories" :key="category.id" class="category-card" @click="$router.push(`/category/${category.id}`)">
            <div class="category-icon">
              <i :class="category.icon"></i>
            </div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.count }}篇文章</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 最新文章 -->
    <div class="latest-section container py-30">
      <h2 class="section-title">最新发布</h2>
      <div class="latest-articles">
        <ArticleCard
          v-for="article in latestArticles"
          :key="article.id"
          :article="article"
          @click="$router.push(`/article/${article.id}`)"
        />
      </div>
      <div class="text-center mt-20">
        <el-button type="primary" @click="$router.push('/articles')">查看更多文章</el-button>
      </div>
    </div>
    
    <!-- 订阅区域 -->
    <div class="subscribe-section py-30" style="background-color: #409EFF; color: white;">
      <div class="container">
        <div class="subscribe-content">
          <h2>订阅我们的博客</h2>
          <p>获取最新的文章和更新，直接发送到您的邮箱</p>
          <div class="subscribe-form">
            <el-input v-model="subscribeEmail" placeholder="请输入您的邮箱地址" class="subscribe-input">
              <template #append>
                <el-button @click="handleSubscribe">订阅</el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ArticleCard from '@/components/blog/ArticleCard.vue'

export default {
  name: 'HomeView',
  components: {
    ArticleCard
  },
  setup() {
    const subscribeEmail = ref('')
    
    // 轮播图数据
    const banners = [
      {
        title: '探索Vue 3的新特性',
        description: '深入了解Composition API和其他Vue 3带来的革命性变化',
        image: 'https://picsum.photos/id/1/1200/400',
        link: '/article/1'
      },
      {
        title: '前端开发最佳实践',
        description: '提高代码质量和开发效率的实用技巧',
        image: 'https://picsum.photos/id/2/1200/400',
        link: '/article/2'
      },
      {
        title: '响应式设计的艺术',
        description: '创建在各种设备上都能完美展示的网站',
        image: 'https://picsum.photos/id/3/1200/400',
        link: '/article/3'
      }
    ]
    
    // 精选文章
    const featuredArticles = ref([])
    
    // 分类数据
    const categories = [
      { id: '1', name: '技术', icon: 'el-icon-monitor', count: 42 },
      { id: '2', name: '生活', icon: 'el-icon-coffee-cup', count: 18 },
      { id: '3', name: '随笔', icon: 'el-icon-notebook-2', count: 24 },
      { id: '4', name: '教程', icon: 'el-icon-reading', count: 36 }
    ]
    
    // 最新文章
    const latestArticles = ref([])
    
    // 加载精选文章
    const loadFeaturedArticles = () => {
      // 模拟数据
      featuredArticles.value = Array.from({ length: 3 }, (_, index) => ({
        id: `featured-${index + 1}`,
        title: `精选文章标题 ${index + 1}`,
        summary: '这是一篇精选文章的摘要，简要介绍文章的主要内容...',
        author: '张三',
        publishDate: '2023-05-15',
        viewCount: 1250 + index * 100,
        coverImage: `https://picsum.photos/id/${10 + index}/600/400`
      }))
    }
    
    // 加载最新文章
    const loadLatestArticles = () => {
      // 模拟数据
      latestArticles.value = Array.from({ length: 6 }, (_, index) => ({
        id: `latest-${index + 1}`,
        title: `最新文章标题 ${index + 1}`,
        summary: '这是一篇最新发布的文章摘要，简要介绍文章的主要内容...',
        author: '李四',
        publishDate: '2023-05-20',
        category: categories[index % 4].name,
        viewCount: 350 + index * 50,
        commentCount: 15 + index * 3,
        coverImage: `https://picsum.photos/id/${20 + index}/300/200`
      }))
    }
    
    // 处理订阅
    const handleSubscribe = () => {
      if (!subscribeEmail.value) {
        ElMessage.warning('请输入邮箱地址')
        return
      }
      
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(subscribeEmail.value)) {
        ElMessage.error('请输入有效的邮箱地址')
        return
      }
      
      // 模拟订阅请求
      ElMessage.success('订阅成功！感谢您的关注')
      subscribeEmail.value = ''
    }
    
    onMounted(() => {
      loadFeaturedArticles()
      loadLatestArticles()
    })
    
    return {
      subscribeEmail,
      banners,
      featuredArticles,
      categories,
      latestArticles,
      handleSubscribe
    }
  }
}
</script>

<style scoped>
.banner-section {
  margin-bottom: 30px;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  position: relative;
}

.banner-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.banner-content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 0 50px;
  max-width: 600px;
}

.banner-content h2 {
  font-size: 32px;
  margin-bottom: 15px;
}

.banner-content p {
  font-size: 18px;
  margin-bottom: 20px;
}

.featured-articles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.featured-article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.featured-article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-info {
  padding: 15px;
}

.article-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  cursor: pointer;
}

.article-info h3:hover {
  color: #409EFF;
}

.article-info p {
  color: #606266;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 15px;
}

.category-card h3 {
  margin: 0 0 10px;
  font-size: 18px;
}

.category-card p {
  margin: 0;
  color: #909399;
}

.latest-articles {
  margin-bottom: 20px;
}

.subscribe-section {
  text-align: center;
}

.subscribe-content {
  max-width: 600px;
  margin: 0 auto;
}

.subscribe-content h2 {
  margin-bottom: 15px;
}

.subscribe-content p {
  margin-bottom: 20px;
}

.subscribe-form {
  max-width: 500px;
  margin: 0 auto;
}

.subscribe-input {
  width: 100%;
}

@media (max-width: 768px) {
  .featured-articles {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .banner-content {
    padding: 0 20px;
  }
  
  .banner-content h2 {
    font-size: 24px;
  }
  
  .banner-content p {
    font-size: 16px;
  }
}
</style>
