import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import MainLayout from '@/components/layout/MainLayout.vue'

// 路由配置
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('@/views/ArticleListView.vue'),
        meta: { title: '文章列表' }
      },
      {
        path: 'article/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/ArticleDetailView.vue'),
        meta: { title: '文章详情' }
      },
        {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/CategoriesView.vue'),
        meta: { title: '文章分类' }
        },
        {
        path: 'category/:id',
        name: 'Category',
        component: () => import('@/views/CategoryView.vue'),
        meta: { title: '分类文章' }
        },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/SearchView.vue'),
        meta: { title: '搜索结果' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/AboutView.vue'),
        meta: { title: '关于我们' }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/ContactView.vue'),
        meta: { title: '联系我们' }
      },
      {
        path: 'privacy',
        name: 'Privacy',
        component: () => import('@/views/PrivacyView.vue'),
        meta: { title: '隐私政策' }
      },
      // 需要登录的路由
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { title: '个人中心', requiresAuth: true }
      },
      {
        path: 'publish',
        name: 'Publish',
        component: () => import('@/views/ArticlePublishView.vue'),
        meta: { title: '发布文章', requiresAuth: true }
      },
      {
        path: 'edit/:id',
        name: 'EditArticle',
        component: () => import('@/views/ArticlePublishView.vue'),
        meta: { title: '编辑文章', requiresAuth: true }
      },
      {
        path: 'my-articles',
        name: 'MyArticles',
        component: () => import('@/views/MyArticlesView.vue'),
        meta: { title: '我的文章', requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { title: '账号设置', requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 个人博客系统` : '个人博客系统'
  
  // 检查是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['user/isLoggedIn']) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
