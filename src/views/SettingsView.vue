<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h2>账号设置</h2>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="通知设置" name="notifications">
          <div class="settings-section">
            <h3>邮件通知</h3>
            <div class="settings-options">
              <el-switch
                v-model="notificationSettings.commentEmail"
                active-text="收到评论时发送邮件"
              ></el-switch>
            </div>
            <div class="settings-options">
              <el-switch
                v-model="notificationSettings.replyEmail"
                active-text="收到回复时发送邮件"
              ></el-switch>
            </div>
            <div class="settings-options">
              <el-switch
                v-model="notificationSettings.likeEmail"
                active-text="文章被点赞时发送邮件"
              ></el-switch>
            </div>
            <div class="settings-options">
              <el-switch
                v-model="notificationSettings.newsletterEmail"
                active-text="接收每周精选文章推送"
              ></el-switch>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>站内通知</h3>
            <div class="settings-options">
              <el-switch
                v-model="notificationSettings.commentSite"
                active-text="收到评论时通知"
              ></el-switch>
            </div>
            <div class="settings-options">
              <el-switch
                v-model="notificationSettings.replySite"
                active-text="收到回复时通知"
              ></el-switch>
            </div>
            <div class="settings-options">
              <el-switch
                v-model="notificationSettings.likeSite"
                active-text="文章被点赞时通知"
              ></el-switch>
            </div>
            <div class="settings-options">
              <el-switch
                v-model="notificationSettings.followSite"
                active-text="有新粉丝时通知"
              ></el-switch>
            </div>
          </div>
          
          <div class="settings-actions">
            <el-button type="primary" @click="saveNotificationSettings" :loading="saving">
              保存设置
            </el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="隐私设置" name="privacy">
          <div class="settings-section">
            <h3>个人资料可见性</h3>
            <div class="settings-options">
              <el-radio-group v-model="privacySettings.profileVisibility">
                <el-radio label="public">公开 - 所有人可见</el-radio>
                <el-radio label="registered">仅注册用户可见</el-radio>
                <el-radio label="private">私密 - 仅自己可见</el-radio>
              </el-radio-group>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>评论设置</h3>
            <div class="settings-options">
              <el-switch
                v-model="privacySettings.allowComments"
                active-text="允许他人在我的文章下评论"
              ></el-switch>
            </div>
            <div class="settings-options">
              <el-switch
                v-model="privacySettings.commentApproval"
                active-text="评论需要我的审核后才能显示"
              ></el-switch>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>数据使用</h3>
            <div class="settings-options">
              <el-switch
                v-model="privacySettings.allowAnalytics"
                active-text="允许收集使用数据以改善服务"
              ></el-switch>
            </div>
            <div class="settings-options">
              <el-switch
                v-model="privacySettings.allowRecommendations"
                active-text="根据我的兴趣推荐内容"
              ></el-switch>
            </div>
          </div>
          
          <div class="settings-actions">
            <el-button type="primary" @click="savePrivacySettings" :loading="saving">
              保存设置
            </el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="账号安全" name="security">
          <div class="settings-section">
            <h3>登录安全</h3>
            <div class="settings-options">
              <el-switch
                v-model="securitySettings.twoFactorAuth"
                active-text="启用两步验证"
              ></el-switch>
              <div class="setting-description" v-if="securitySettings.twoFactorAuth">
                两步验证可以提高账号安全性，登录时需要输入手机验证码
              </div>
            </div>
            
            <div class="settings-options">
              <el-switch
                v-model="securitySettings.loginNotification"
                active-text="新设备登录时通知我"
              ></el-switch>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>会话管理</h3>
            <div class="active-sessions">
              <div v-for="(session, index) in activeSessions" :key="index" class="session-item">
                <div class="session-info">
                  <div class="session-device">
                    <i class="el-icon-monitor" v-if="session.deviceType === 'desktop'"></i>
                    <i class="el-icon-mobile" v-else></i>
                    {{ session.deviceName }}
                  </div>
                  <div class="session-details">
                    <div>{{ session.location }}</div>
                    <div class="session-time">{{ session.lastActive }}</div>
                  </div>
                </div>
                <div class="session-actions">
                  <el-button 
                    size="small" 
                    type="danger" 
                    plain
                    @click="terminateSession(index)"
                    :disabled="session.current"
                  >
                    {{ session.current ? '当前会话' : '退出' }}
                  </el-button>
                </div>
              </div>
            </div>
            
            <div class="settings-actions">
              <el-button type="warning" @click="terminateAllSessions">退出所有其他设备</el-button>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>账号操作</h3>
            <div class="danger-zone">
              <el-button type="danger" @click="showDeactivateDialog">停用账号</el-button>
              <el-button type="danger" @click="showDeleteDialog">删除账号</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- 停用账号对话框 -->
    <el-dialog
      title="停用账号"
      v-model="deactivateDialogVisible"
      width="500px"
    >
      <div class="dialog-content">
        <p>停用账号后，您的个人资料将不再对其他用户可见，但您的数据将被保留。您可以随时重新激活账号。</p>
        <p>请输入密码确认操作：</p>
        <el-input 
          v-model="confirmPassword" 
          type="password" 
          placeholder="请输入密码"
          show-password
        ></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deactivateDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deactivateAccount" :loading="processing">
            确认停用
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 删除账号对话框 -->
    <el-dialog
      title="删除账号"
      v-model="deleteDialogVisible"
      width="500px"
    >
      <div class="dialog-content">
        <p class="warning-text">警告：此操作不可逆！</p>
        <p>删除账号将永久移除您的所有数据，包括文章、评论和个人资料。此操作无法撤销。</p>
        <p>请输入"DELETE"确认操作：</p>
        <el-input v-model="deleteConfirmText" placeholder="请输入DELETE"></el-input>
        <p>请输入密码确认操作：</p>
        <el-input 
          v-model="confirmPassword" 
          type="password" 
          placeholder="请输入密码"
          show-password
        ></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button 
            type="danger" 
            @click="deleteAccount" 
            :loading="processing"
            :disabled="deleteConfirmText !== 'DELETE'"
          >
            永久删除账号
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'SettingsView',
  setup() {
    const router = useRouter()
    const store = useStore()
    const activeTab = ref('notifications')
    const saving = ref(false)
    const processing = ref(false)
    const deactivateDialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const confirmPassword = ref('')
    const deleteConfirmText = ref('')
    
    // 通知设置
    const notificationSettings = reactive({
      commentEmail: true,
      replyEmail: true,
      likeEmail: false,
      newsletterEmail: true,
      commentSite: true,
      replySite: true,
      likeSite: true,
      followSite: true
    })
    
    // 隐私设置
    const privacySettings = reactive({
      profileVisibility: 'public',
      allowComments: true,
      commentApproval: false,
      allowAnalytics: true,
      allowRecommendations: true
    })
    
    // 安全设置
    const securitySettings = reactive({
      twoFactorAuth: false,
      loginNotification: true
    })
    
    // 活跃会话
    const activeSessions = ref([
      {
        deviceType: 'desktop',
        deviceName: 'Windows 10 - Chrome',
        location: '北京, 中国',
        lastActive: '当前活跃',
        current: true
      },
      {
        deviceType: 'mobile',
        deviceName: 'iPhone 13 - Safari',
        location: '上海, 中国',
        lastActive: '2023-05-18 14:30',
        current: false
      },
      {
        deviceType: 'desktop',
        deviceName: 'macOS - Firefox',
        location: '广州, 中国',
        lastActive: '2023-05-15 09:45',
        current: false
      }
    ])
    
    // 保存通知设置
    const saveNotificationSettings = () => {
      saving.value = true
      
      // 模拟保存
      setTimeout(() => {
        ElMessage.success('通知设置已保存')
        saving.value = false
      }, 800)
    }
    
    // 保存隐私设置
    const savePrivacySettings = () => {
      saving.value = true
      
      // 模拟保存
      setTimeout(() => {
        ElMessage.success('隐私设置已保存')
        saving.value = false
      }, 800)
    }
    
    // 终止会话
    const terminateSession = (index) => {
      ElMessageBox.confirm('确定要退出该设备的登录状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activeSessions.value.splice(index, 1)
        ElMessage.success('已成功退出该设备')
      }).catch(() => {})
    }
    
    // 终止所有会话
    const terminateAllSessions = () => {
      ElMessageBox.confirm('确定要退出所有其他设备的登录状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 保留当前会话
        activeSessions.value = activeSessions.value.filter(session => session.current)
        ElMessage.success('已成功退出所有其他设备')
      }).catch(() => {})
    }
    
    // 显示停用账号对话框
    const showDeactivateDialog = () => {
      confirmPassword.value = ''
      deactivateDialogVisible.value = true
    }
    
    // 显示删除账号对话框
    const showDeleteDialog = () => {
      confirmPassword.value = ''
      deleteConfirmText.value = ''
      deleteDialogVisible.value = true
    }
    
    // 停用账号
    const deactivateAccount = () => {
      if (!confirmPassword.value) {
        ElMessage.warning('请输入密码')
        return
      }
      
      processing.value = true
      
      // 模拟API调用
      setTimeout(() => {
        processing.value = false
        deactivateDialogVisible.value = false
        ElMessage.success('账号已停用')
        
        // 退出登录
        store.dispatch('user/logout')
        router.push('/login')
      }, 1500)
    }
    
    // 删除账号
    const deleteAccount = () => {
      if (!confirmPassword.value) {
        ElMessage.warning('请输入密码')
        return
      }
      
      if (deleteConfirmText.value !== 'DELETE') {
        ElMessage.warning('请输入正确的确认文本')
        return
      }
      
      processing.value = true
      
      // 模拟API调用
      setTimeout(() => {
        processing.value = false
        deleteDialogVisible.value = false
        ElMessage.success('账号已永久删除')
        
        // 退出登录
        store.dispatch('user/logout')
        router.push('/')
      }, 1500)
    }
    
    onMounted(() => {
      // 实际项目中应从API获取设置
    })
    
    return {
      activeTab,
      notificationSettings,
      privacySettings,
      securitySettings,
      activeSessions,
      saving,
      processing,
      deactivateDialogVisible,
      deleteDialogVisible,
      confirmPassword,
      deleteConfirmText,
      saveNotificationSettings,
      savePrivacySettings,
      terminateSession,
      terminateAllSessions,
      showDeactivateDialog,
      showDeleteDialog,
      deactivateAccount,
      deleteAccount
    }
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.settings-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
}

.settings-section {
  margin-bottom: 30px;
}

.settings-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #303133;
}

.settings-options {
  margin-bottom: 15px;
}

.setting-description {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
  padding-left: 40px;
}

.settings-actions {
  margin-top: 20px;
}

.active-sessions {
  margin-top: 15px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  margin-bottom: 10px;
}

.session-info {
  display: flex;
  align-items: center;
}

.session-device {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-right: 20px;
  min-width: 180px;
}

.session-device i {
  margin-right: 8px;
  font-size: 18px;
}

.session-details {
  color: #606266;
  font-size: 14px;
}

.session-time {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.danger-zone {
  display: flex;
  gap: 15px;
  padding: 20px;
  background-color: #FEF0F0;
  border-radius: 4px;
}

.dialog-content {
  margin-bottom: 20px;
}

.warning-text {
  color: #F56C6C;
  font-weight: bold;
}
</style>
