<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">
          <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
          <div class="avatar-upload">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="uploadAvatar"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary">更换头像</el-button>
            </el-upload>
          </div>
        </div>
        
        <div class="profile-info">
          <h1>{{ userInfo.username }}</h1>
          <p class="user-bio">{{ userInfo.bio || '这个人很懒，还没有填写个人简介' }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ stats.articles }}</div>
              <div class="stat-label">文章</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.comments }}</div>
              <div class="stat-label">评论</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.likes }}</div>
              <div class="stat-label">获赞</div>
            </div>
          </div>
        </div>
      </div>
      
      <el-tabs v-model="activeTab" class="profile-tabs">
        <el-tab-pane label="个人资料" name="info">
          <el-form 
            :model="profileForm" 
            :rules="rules" 
            ref="profileFormRef" 
            label-width="100px"
            class="profile-form"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username"></el-input>
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" disabled></el-input>
              <div class="form-tip">邮箱地址不可修改</div>
            </el-form-item>
            
            <el-form-item label="个人简介" prop="bio">
              <el-input 
                v-model="profileForm.bio" 
                type="textarea" 
                :rows="4"
                placeholder="介绍一下自己吧"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
            
            <el-form-item label="个人网站" prop="website">
              <el-input v-model="profileForm.website" placeholder="http://"></el-input>
            </el-form-item>
            
            <el-form-item label="所在地" prop="location">
              <el-input v-model="profileForm.location"></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="updateProfile" :loading="updating">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="修改密码" name="password">
          <el-form 
            :model="passwordForm" 
            :rules="passwordRules" 
            ref="passwordFormRef" 
            label-width="100px"
            class="password-form"
          >
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input 
                v-model="passwordForm.currentPassword" 
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input 
                v-model="passwordForm.newPassword" 
                type="password"
                show-password
              ></el-input>
              <div class="form-tip">密码长度至少为8位，包含大小写字母和数字</div>
            </el-form-item>
            
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input 
                v-model="passwordForm.confirmPassword" 
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="updatePassword" :loading="updatingPassword">更新密码</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="我的收藏" name="favorites">
          <div v-if="favorites.length === 0" class="empty-state">
            <el-empty description="暂无收藏文章"></el-empty>
          </div>
          
          <div v-else class="favorites-list">
            <div v-for="article in favorites" :key="article.id" class="favorite-item">
              <div class="favorite-info">
                <h3 @click="$router.push(`/article/${article.id}`)">{{ article.title }}</h3>
                <div class="favorite-meta">
                  <span><i class="el-icon-user"></i> {{ article.author }}</span>
                  <span><i class="el-icon-date"></i> {{ article.publishDate }}</span>
                  <span><i class="el-icon-collection-tag"></i> {{ article.category }}</span>
                </div>
              </div>
              <div class="favorite-actions">
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="removeFavorite(article.id)"
                  icon="el-icon-delete"
                  circle
                  plain
                ></el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { validateEmail, validatePassword } from '@/utils/validate'

export default {
  name: 'ProfileView',
  setup() {
    const store = useStore()
    const profileFormRef = ref(null)
    const passwordFormRef = ref(null)
    const activeTab = ref('info')
    const updating = ref(false)
    const updatingPassword = ref(false)
    
    // 用户信息
    const userInfo = computed(() => store.state.user.userInfo || {})
    
    // 用户统计数据
    const stats = reactive({
      articles: 12,
      comments: 48,
      likes: 156
    })
    
    // 个人资料表单
    const profileForm = reactive({
      username: userInfo.value?.username || '',
      email: userInfo.value?.email || '',
      bio: userInfo.value?.bio || '',
      website: userInfo.value?.website || '',
      location: userInfo.value?.location || ''
    })
    
    // 修改密码表单
    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // 收藏文章
    const favorites = ref([])
    
    // 表单验证规则
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' }
      ],
      bio: [
        { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
      ],
      website: [
        { pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/, message: '请输入有效的网址', trigger: 'blur' }
      ]
    }
    
    // 密码表单验证规则
    const passwordRules = {
      currentPassword: [
        { required: true, message: '请输入当前密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
          if (!validatePassword(value)) {
            callback(new Error('密码长度至少为8位，包含大小写字母和数字'))
          } else {
            callback()
          }
        }, trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
          if (value !== passwordForm.newPassword) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        }, trigger: 'blur' }
      ]
    }
    
    // 更新个人资料
    const updateProfile = () => {
      profileFormRef.value.validate(async (valid) => {
        if (!valid) return
        
        updating.value = true
        try {
          // 实际项目中应调用API，这里模拟更新
          await store.dispatch('user/updateUserInfo', {
            ...userInfo.value,
            ...profileForm
          })
          
          ElMessage.success('个人资料更新成功')
        } catch (error) {
          ElMessage.error('更新个人资料失败')
        } finally {
          updating.value = false
        }
      })
    }
    
    // 更新密码
    const updatePassword = () => {
      passwordFormRef.value.validate(async (valid) => {
        if (!valid) return
        
        updatingPassword.value = true
        try {
          // 实际项目中应调用API，这里模拟更新
          setTimeout(() => {
            ElMessage.success('密码更新成功')
            passwordForm.currentPassword = ''
            passwordForm.newPassword = ''
            passwordForm.confirmPassword = ''
            updatingPassword.value = false
          }, 1000)
        } catch (error) {
          ElMessage.error('更新密码失败')
          updatingPassword.value = false
        }
      })
    }
    
    // 上传头像前验证
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG && !isPNG) {
        ElMessage.error('头像只能是JPG或PNG格式!')
        return false
      }
      
      if (!isLt2M) {
        ElMessage.error('头像大小不能超过2MB!')
        return false
      }
      
      return true
    }
    
    // 上传头像
    const uploadAvatar = (options) => {
      const file = options.file
      
      // 实际项目中应上传到服务器，这里使用本地FileReader模拟
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // 更新用户头像
        store.dispatch('user/updateUserInfo', {
          ...userInfo.value,
          avatar: reader.result
        })
        
        ElMessage.success('头像更新成功')
      }
    }
    
    // 移除收藏
    const removeFavorite = (id) => {
      favorites.value = favorites.value.filter(item => item.id !== id)
      ElMessage.success('已从收藏中移除')
    }
    
    // 加载收藏文章
    const loadFavorites = () => {
      // 模拟数据
      favorites.value = Array.from({ length: 5 }, (_, index) => ({
        id: `fav-${index + 1}`,
        title: `收藏的文章标题 ${index + 1}`,
        author: '王五',
        publishDate: '2023-05-10',
        category: '技术'
      }))
    }
    
    onMounted(() => {
      // 初始化表单数据
      Object.assign(profileForm, {
        username: userInfo.value.username || '',
        email: userInfo.value.email || '',
        bio: userInfo.value.bio || '',
        website: userInfo.value.website || '',
        location: userInfo.value.location || ''
      })
      
      loadFavorites()
    })
    
    return {
      profileFormRef,
      passwordFormRef,
      activeTab,
      userInfo,
      stats,
      profileForm,
      passwordForm,
      favorites,
      rules,
      passwordRules,
      updating,
      updatingPassword,
      updateProfile,
      updatePassword,
      beforeAvatarUpload,
      uploadAvatar,
      removeFavorite
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.profile-card {
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  margin-bottom: 30px;
}

.profile-avatar {
  margin-right: 30px;
  text-align: center;
}

.avatar-upload {
  margin-top: 15px;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 24px;
}

.user-bio {
  color: #606266;
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.profile-tabs {
  margin-top: 20px;
}

.profile-form, .password-form {
  max-width: 500px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.empty-state {
  padding: 30px 0;
}

.favorites-list {
  margin-top: 20px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #EBEEF5;
}

.favorite-item:last-child {
  border-bottom: none;
}

.favorite-info h3 {
  margin: 0 0 10px;
  font-size: 16px;
  cursor: pointer;
}

.favorite-info h3:hover {
  color: #409EFF;
}

.favorite-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}
</style>
