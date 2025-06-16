<template>
  <div class="main-layout">
    <header class="main-header">
      <div class="header-container">
        <div class="logo" @click="$router.push('/')">
          <img src="@/assets/logo.png" alt="Blog Logo">
          <span>个人博客系统</span>
        </div>
        
        <nav class="main-nav">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/articles" class="nav-item">文章</router-link>
          <router-link to="/categories" class="nav-item">分类</router-link>
          <router-link to="/about" class="nav-item">关于</router-link>
        </nav>
        
        <div class="header-actions">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter="handleSearch"
            class="search-input"
          ></el-input>
          
          <template v-if="isLoggedIn">
            <el-dropdown @command="handleCommand">
              <div class="user-avatar">
                <img :src="userInfo.avatar" :alt="userInfo.username">
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="publish">发布文章</el-dropdown-item>
                  <el-dropdown-item command="my-articles">我的文章</el-dropdown-item>
                  <el-dropdown-item command="settings">账号设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          
          <template v-else>
            <el-button type="text" @click="$router.push('/login')">登录</el-button>
            <el-button type="primary" @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-links">
          <div class="footer-section">
            <h3>关于我们</h3>
            <ul>
              <li><router-link to="/about">关于博客</router-link></li>
              <li><router-link to="/contact">联系我们</router-link></li>
              <li><router-link to="/privacy">隐私政策</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>内容分类</h3>
            <ul>
              <li v-for="category in categories" :key="category.id">
                <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
              </li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>关注我们</h3>
            <div class="social-links">
              <a href="#" target="_blank"><i class="el-icon-s-platform"></i></a>
              <a href="#" target="_blank"><i class="el-icon-s-custom"></i></a>
              <a href="#" target="_blank"><i class="el-icon-s-promotion"></i></a>
              <a href="#" target="_blank"><i class="el-icon-s-management"></i></a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} 个人博客系统. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'MainLayout',
  setup() {
    const router = useRouter()
    const store = useStore()
    const searchKeyword = ref('')
    
    // 用户信息
    const userInfo = computed(() => store.state.user.userInfo || {})
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    
    // 分类数据
    const categories = [
      { id: '1', name: '技术' },
      { id: '2', name: '生活' },
      { id: '3', name: '随笔' },
      { id: '4', name: '教程' }
    ]
    
    // 搜索处理
    const handleSearch = () => {
      if (!searchKeyword.value.trim()) return
      
      router.push({
        path: '/search',
        query: { keyword: searchKeyword.value }
      })
    }
    
    // 下拉菜单命令处理
    const handleCommand = (command) => {
      switch (command) {
        case 'profile':
          router.push('/profile')
          break
        case 'publish':
          router.push('/publish')
          break
        case 'my-articles':
          router.push('/my-articles')
          break
        case 'settings':
          router.push('/settings')
          break
        case 'logout':
          ElMessageBox.confirm('确定要退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/logout')
            ElMessage.success('已退出登录')
            router.push('/')
          }).catch(() => {})
          break
      }
    }
    
    return {
      searchKeyword,
      userInfo,
      isLoggedIn,
      categories,
      handleSearch,
      handleCommand
    }
  }
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.logo span {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.main-nav {
  display: flex;
  gap: 25px;
}

.nav-item {
  text-decoration: none;
  color: #606266;
  font-size: 16px;
  transition: color 0.3s;
  padding: 5px 0;
  position: relative;
}

.nav-item:hover, .nav-item.router-link-active {
  color: #409EFF;
}

.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409EFF;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-input {
  width: 200px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-content {
  flex: 1;
  background-color: #f5f7fa;
}

.main-footer {
  background-color: #303133;
  color: #fff;
  padding: 40px 0 20px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30px;
}

.footer-section {
  flex: 0 0 30%;
  margin-bottom: 20px;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #E6A23C;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a {
  color: #C0C4CC;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #fff;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s;
}

.social-links a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.social-links i {
  font-size: 20px;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #909399;
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
