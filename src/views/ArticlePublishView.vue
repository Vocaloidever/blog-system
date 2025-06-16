<template>
  <div class="article-publish-container">
    <h1 class="page-title">{{ isEdit ? '编辑文章' : '发布新文章' }}</h1>
    
    <el-form :model="articleForm" :rules="rules" ref="articleFormRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="articleForm.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      
      <el-form-item label="文章分类" prop="category">
        <el-select v-model="articleForm.category" placeholder="请选择文章分类">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="文章标签">
        <el-tag
          v-for="tag in articleForm.tags"
          :key="tag"
          closable
          @close="removeTag(tag)"
          class="article-tag"
        >
          {{ tag }}
        </el-tag>
        
        <el-input
          v-if="tagInputVisible"
          ref="tagInputRef"
          v-model="tagInputValue"
          class="tag-input"
          size="small"
          @keyup.enter="addTag"
          @blur="addTag"
        ></el-input>
        
        <el-button v-else size="small" @click="showTagInput">+ 添加标签</el-button>
      </el-form-item>
      
      <el-form-item label="封面图片" prop="coverImage">
        <el-upload
          class="cover-uploader"
          action="#"
          :http-request="uploadCover"
          :show-file-list="false"
          :before-upload="beforeCoverUpload"
        >
          <img v-if="articleForm.coverImage" :src="articleForm.coverImage" class="cover-image" />
          <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="upload-tip">建议尺寸: 900x500px，支持jpg、png格式</div>
      </el-form-item>
      
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="articleForm.summary"
          type="textarea"
          :rows="3"
          placeholder="请输入文章摘要，不超过200字"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
      
      <el-form-item label="文章内容" prop="content">
        <div class="editor-container">
          <!-- 实际项目中可以集成富文本编辑器，如TinyMCE、CKEditor等 -->
          <el-input
            v-model="articleForm.content"
            type="textarea"
            :rows="15"
            placeholder="请输入文章内容..."
          ></el-input>
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-button @click="saveAsDraft" :loading="savingDraft">保存草稿</el-button>
        <el-button type="primary" @click="publishArticle" :loading="publishing">
          {{ isEdit ? '更新文章' : '发布文章' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'ArticlePublishView',
  components: {
    Plus
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const articleFormRef = ref(null)
    const tagInputRef = ref(null)
    const tagInputVisible = ref(false)
    const tagInputValue = ref('')
    const savingDraft = ref(false)
    const publishing = ref(false)
    
    // 判断是新建还是编辑
    const isEdit = computed(() => !!route.params.id)
    
    // 文章表单数据
    const articleForm = reactive({
      title: '',
      category: '',
      tags: [],
      coverImage: '',
      summary: '',
      content: ''
    })
    
    // 表单验证规则
    const rules = {
      title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 5, max: 100, message: '标题长度在5到100个字符之间', trigger: 'blur' }
      ],
      category: [
        { required: true, message: '请选择文章分类', trigger: 'change' }
      ],
      coverImage: [
        { required: true, message: '请上传文章封面图片', trigger: 'change' }
      ],
      summary: [
        { required: true, message: '请输入文章摘要', trigger: 'blur' },
        { max: 200, message: '摘要不能超过200个字符', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
        { min: 100, message: '文章内容不能少于100个字符', trigger: 'blur' }
      ]
    }
    
    // 分类数据
    const categories = [
      { id: '1', name: '技术' },
      { id: '2', name: '生活' },
      { id: '3', name: '随笔' },
      { id: '4', name: '教程' }
    ]
    
    // 如果是编辑模式，加载文章数据
    const loadArticleData = async () => {
      if (!isEdit.value) return
      
      const articleId = route.params.id
      
      try {
        // 实际项目中应调用API，这里模拟数据
        setTimeout(() => {
          // 模拟文章数据
          const articleData = {
            title: '如何使用Vue 3构建高性能Web应用',
            category: '1',
            tags: ['Vue', 'JavaScript', '前端开发'],
            coverImage: 'https://picsum.photos/id/1/900/500',
            summary: 'Vue 3带来了许多令人兴奋的新特性，本文将详细介绍如何利用这些特性构建高性能的Web应用。',
            content: '这是文章的详细内容...'
          }
          
          // 更新表单数据
          Object.assign(articleForm, articleData)
        }, 500)
      } catch (error) {
        ElMessage.error('获取文章数据失败')
      }
    }
    
    // 显示标签输入框
    const showTagInput = () => {
      tagInputVisible.value = true
      nextTick(() => {
        tagInputRef.value.focus()
      })
    }
    
    // 添加标签
    const addTag = () => {
      const value = tagInputValue.value.trim()
      if (value) {
        if (articleForm.tags.includes(value)) {
          ElMessage.warning('标签已存在')
        } else if (articleForm.tags.length >= 5) {
          ElMessage.warning('最多添加5个标签')
        } else {
          articleForm.tags.push(value)
        }
      }
      tagInputVisible.value = false
      tagInputValue.value = ''
    }
    
    // 移除标签
    const removeTag = (tag) => {
      articleForm.tags = articleForm.tags.filter(t => t !== tag)
    }
    
    // 上传前验证
    const beforeCoverUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG && !isPNG) {
        ElMessage.error('封面图片只能是JPG或PNG格式!')
        return false
      }
      
      if (!isLt2M) {
        ElMessage.error('封面图片大小不能超过2MB!')
        return false
      }
      
      return true
    }
    
    // 上传封面图片
    const uploadCover = (options) => {
      const file = options.file
      
      // 实际项目中应上传到服务器，这里使用本地FileReader模拟
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        articleForm.coverImage = reader.result
      }
    }
    
    // 保存为草稿
    const saveAsDraft = async () => {
      savingDraft.value = true
      
      try {
        // 实际项目中应调用API，这里模拟保存
        setTimeout(() => {
          ElMessage.success('草稿保存成功')
          savingDraft.value = false
        }, 1000)
      } catch (error) {
        ElMessage.error('保存草稿失败')
        savingDraft.value = false
      }
    }
    
    // 发布文章
    const publishArticle = async () => {
      articleFormRef.value.validate(async (valid) => {
        if (!valid) {
          ElMessage.warning('请完善文章信息')
          return
        }
        
        publishing.value = true
        
        try {
          // 实际项目中应调用API，这里模拟发布
          setTimeout(() => {
            ElMessage.success(isEdit.value ? '文章更新成功' : '文章发布成功')
            publishing.value = false
            router.push('/my-articles')
          }, 1500)
        } catch (error) {
          ElMessage.error(isEdit.value ? '更新文章失败' : '发布文章失败')
          publishing.value = false
        }
      })
    }
    
    onMounted(() => {
      loadArticleData()
    })
    
    return {
      articleFormRef,
      articleForm,
      rules,
      categories,
      isEdit,
      tagInputRef,
      tagInputVisible,
      tagInputValue,
      savingDraft,
      publishing,
      showTagInput,
      addTag,
      removeTag,
      beforeCoverUpload,
      uploadCover,
      saveAsDraft,
      publishArticle
    }
  }
}
</script>

<style scoped>
.article-publish-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-title {
  margin-bottom: 30px;
  font-size: 24px;
  color: #303133;
}

.article-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.tag-input {
  width: 100px;
  margin-right: 10px;
  vertical-align: bottom;
}

.cover-uploader {
  width: 300px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-uploader:hover {
  border-color: #409EFF;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 30px;
  height: 30px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.editor-container {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}
</style>
