<template>
  <div class="article-detail-container">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="skeleton-header">
          <el-skeleton-item variant="h1" style="width: 50%"></el-skeleton-item>
          <div class="skeleton-meta">
            <el-skeleton-item variant="text" style="width: 20%"></el-skeleton-item>
            <el-skeleton-item variant="text" style="width: 15%"></el-skeleton-item>
            <el-skeleton-item variant="text" style="width: 15%"></el-skeleton-item>
          </div>
        </div>
        <el-skeleton-item variant="p" style="width: 100%"></el-skeleton-item>
        <el-skeleton-item variant="p" style="width: 100%"></el-skeleton-item>
        <el-skeleton-item variant="p" style="width: 100%"></el-skeleton-item>
        <el-skeleton-item variant="p" style="width: 90%"></el-skeleton-item>
        <el-skeleton-item variant="p" style="width: 95%"></el-skeleton-item>
      </template>
      
      <template #default>
        <div v-if="article">
          <div class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
              <span class="author">
                <i class="el-icon-user"></i> {{ article.author }}
              </span>
              <span class="date">
                <i class="el-icon-date"></i> {{ article.publishDate }}
              </span>
              <span class="category">
                <i class="el-icon-collection-tag"></i> {{ article.category }}
              </span>
              <span class="views">
                <i class="el-icon-view"></i> {{ article.viewCount }} 阅读
              </span>
              <span class="comments">
                <i class="el-icon-chat-dot-round"></i> {{ article.commentCount }} 评论
              </span>
            </div>
          </div>
          
          <div class="article-content" v-html="article.content"></div>
          
          <div class="article-actions">
            <el-button type="primary" @click="likeArticle" :disabled="hasLiked">
              <i class="el-icon-star-off"></i> 
              {{ hasLiked ? '已点赞' : '点赞' }} ({{ article.likeCount }})
            </el-button>
            <el-button @click="shareArticle">
              <i class="el-icon-share"></i> 分享
            </el-button>
          </div>
          
          <div class="article-tags">
            <el-tag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</el-tag>
          </div>
          
          <div class="article-author-info">
            <div class="author-avatar">
              <img :src="article.authorAvatar" :alt="article.author">
            </div>
            <div class="author-details">
              <h3>{{ article.author }}</h3>
              <p>{{ article.authorBio }}</p>
            </div>
          </div>
          
          <!-- 评论区 -->
          <div class="comments-section">
            <h2>评论 ({{ article.commentCount }})</h2>
            
            <div class="comment-form">
              <el-input
                v-model="commentContent"
                type="textarea"
                :rows="4"
                placeholder="写下你的评论..."
              ></el-input>
              <el-button 
                type="primary" 
                @click="submitComment" 
                :disabled="!commentContent.trim()" 
                class="submit-comment"
              >
                发表评论
              </el-button>
            </div>
            
            <div class="comments-list">
              <div v-if="comments.length === 0" class="no-comments">
                暂无评论，快来发表第一条评论吧！
              </div>
              
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="comment-avatar">
                  <img :src="comment.avatar" :alt="comment.username">
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.username }}</span>
                    <span class="comment-date">{{ comment.date }}</span>
                  </div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-actions">
                    <span @click="replyToComment(comment)">回复</span>
                    <span @click="likeComment(comment)">
                      {{ comment.hasLiked ? '已点赞' : '点赞' }} ({{ comment.likeCount }})
                    </span>
                  </div>
                  
                  <!-- 回复列表 -->
                  <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                    <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                      <div class="reply-avatar">
                        <img :src="reply.avatar" :alt="reply.username">
                      </div>
                      <div class="reply-content">
                        <div class="reply-header">
                          <span class="reply-author">{{ reply.username }}</span>
                          <span class="reply-to">回复</span>
                          <span class="reply-target">{{ reply.replyTo }}</span>
                          <span class="reply-date">{{ reply.date }}</span>
                        </div>
                        <div class="reply-text">{{ reply.content }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 回复表单 -->
                  <div v-if="replyingTo === comment.id" class="reply-form">
                    <el-input
                      v-model="replyContent"
                      type="textarea"
                      :rows="2"
                      :placeholder="`回复 ${comment.username}...`"
                    ></el-input>
                    <div class="reply-actions">
                      <el-button size="small" @click="cancelReply">取消</el-button>
                      <el-button 
                        type="primary" 
                        size="small" 
                        @click="submitReply(comment)" 
                        :disabled="!replyContent.trim()"
                      >
                        回复
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载更多评论 -->
            <div v-if="hasMoreComments" class="load-more">
              <el-button @click="loadMoreComments" :loading="loadingComments">
                加载更多评论
              </el-button>
            </div>
          </div>
        </div>
        
        <el-empty v-else description="文章不存在或已被删除"></el-empty>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'ArticleDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const article = ref(null)
    const comments = ref([])
    const commentContent = ref('')
    const replyContent = ref('')
    const replyingTo = ref(null)
    const hasLiked = ref(false)
    const loadingComments = ref(false)
    const hasMoreComments = ref(true)
    const commentPage = ref(1)
    
    // 获取文章详情
    const fetchArticleDetail = async () => {
      const articleId = route.params.id
      loading.value = true
      
      try {
        // 实际项目中应调用API，这里模拟数据
        setTimeout(() => {
          article.value = {
            id: articleId,
            title: `详细文章标题 ${articleId}`,
            author: '张三',
            authorAvatar: 'https://picsum.photos/id/1005/100/100',
            authorBio: '资深前端工程师，热爱技术分享和开源项目贡献。',
            publishDate: '2023-05-15',
            category: '技术',
            viewCount: 1250,
            commentCount: 28,
            likeCount: 156,
            tags: ['JavaScript', 'Vue', '前端开发', '博客系统'],
            content: `
              <p>这是一篇关于Vue开发的详细教程。</p>
              <h2>Vue 3的新特性</h2>
              <p>Vue 3带来了许多令人兴奋的新特性，包括Composition API、更好的TypeScript支持、更小的包体积等。</p>
              <p>在本文中，我们将深入探讨如何利用这些新特性构建高性能的Web应用。</p>
              <h3>Composition API</h3>
              <p>Composition API是Vue 3中最重要的新特性之一，它提供了一种更灵活的方式来组织组件逻辑。</p>
              <pre><code>
              import { ref, onMounted } from 'vue'

              export default {
                setup() {
                  const count = ref(0)
                  
                  function increment() {
                    count.value++
                  }
                  
                  onMounted(() => {
                    console.log('Component mounted!')
                  })
                  
                  return {
                    count,
                    increment
                  }
                }
              }
              </code></pre>
              <p>通过Composition API，我们可以更好地重用逻辑，提高代码的可维护性。</p>
              <h2>结论</h2>
              <p>Vue 3为前端开发带来了许多改进，使得构建复杂应用变得更加简单和高效。希望本文对你有所帮助！</p>
            `
          }
          
          loading.value = false
          fetchComments()
        }, 800)
      } catch (error) {
        ElMessage.error('获取文章详情失败')
        loading.value = false
      }
    }
    
    // 获取评论列表
    const fetchComments = async () => {
      loadingComments.value = true
      
      try {
        // 实际项目中应调用API，这里模拟数据
        setTimeout(() => {
          // 模拟评论数据
          const newComments = Array.from({ length: 5 }, (_, index) => {
            const commentId = `comment-${commentPage.value}-${index}`
            return {
              id: commentId,
              username: `用户${Math.floor(Math.random() * 1000)}`,
              avatar: `https://picsum.photos/id/${20 + index}/50/50`,
              content: `这是第${commentPage.value}页的第${index + 1}条评论。Vue确实是一个很棒的框架，这篇文章写得非常详细，感谢分享！`,
              date: '2023-05-16',
              likeCount: Math.floor(Math.random() * 20),
              hasLiked: false,
              replies: index % 2 === 0 ? [
                {
                  id: `reply-${commentId}-1`,
                  username: '作者',
                  avatar: article.value.authorAvatar,
                  content: '谢谢你的评论，很高兴你喜欢这篇文章！',
                  date: '2023-05-16',
                  replyTo: `用户${Math.floor(Math.random() * 1000)}`
                }
              ] : []
            }
          })
          
          if (commentPage.value === 1) {
            comments.value = newComments
          } else {
            comments.value = [...comments.value, ...newComments]
          }
          
          // 模拟是否还有更多评论
          hasMoreComments.value = commentPage.value < 3
          loadingComments.value = false
        }, 500)
      } catch (error) {
        ElMessage.error('获取评论失败')
        loadingComments.value = false
      }
    }
    
    // 加载更多评论
    const loadMoreComments = () => {
      commentPage.value++
      fetchComments()
    }
    
    // 提交评论
    const submitComment = () => {
      if (!commentContent.value.trim()) return
      
      // 实际项目中应调用API，这里模拟提交
      const newComment = {
        id: `comment-new-${Date.now()}`,
        username: '当前用户',
        avatar: 'https://picsum.photos/id/1010/50/50',
        content: commentContent.value,
        date: new Date().toLocaleDateString(),
        likeCount: 0,
        hasLiked: false,
        replies: []
      }
      
      comments.value.unshift(newComment)
      article.value.commentCount++
      commentContent.value = ''
      
      ElMessage.success('评论发表成功')
    }
    
    // 回复评论
    const replyToComment = (comment) => {
      replyingTo.value = comment.id
      replyContent.value = ''
    }
    
    // 取消回复
    const cancelReply = () => {
      replyingTo.value = null
      replyContent.value = ''
    }
    
    // 提交回复
    const submitReply = (comment) => {
      if (!replyContent.value.trim()) return
      
      // 实际项目中应调用API，这里模拟提交
      const newReply = {
        id: `reply-new-${Date.now()}`,
        username: '当前用户',
        avatar: 'https://picsum.photos/id/1010/50/50',
        content: replyContent.value,
        date: new Date().toLocaleDateString(),
        replyTo: comment.username
      }
      
      if (!comment.replies) {
        comment.replies = []
      }
      
      comment.replies.push(newReply)
      article.value.commentCount++
      replyContent.value = ''
      replyingTo.value = null
      
      ElMessage.success('回复发表成功')
    }
    
    // 点赞文章
    const likeArticle = () => {
      if (hasLiked.value) return
      
      // 实际项目中应调用API，这里模拟点赞
      article.value.likeCount++
      hasLiked.value = true
      
      ElMessage.success('点赞成功')
    }
    
    // 点赞评论
    const likeComment = (comment) => {
      if (comment.hasLiked) return
      
      // 实际项目中应调用API，这里模拟点赞
      comment.likeCount++
      comment.hasLiked = true
      
      ElMessage.success('点赞成功')
    }
    
    // 分享文章
    const shareArticle = () => {
      // 实际项目中可以实现分享功能，这里只做提示
      ElMessage.info('分享功能开发中...')
    }
    
    onMounted(() => {
      fetchArticleDetail()
    })
    
    return {
      loading,
      article,
      comments,
      commentContent,
      replyContent,
      replyingTo,
      hasLiked,
      loadingComments,
      hasMoreComments,
      submitComment,
      replyToComment,
      cancelReply,
      submitReply,
      likeArticle,
      likeComment,
      shareArticle,
      loadMoreComments
    }
  }
}
</script>

<style scoped>
.article-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.skeleton-header {
  margin-bottom: 20px;
}

.skeleton-meta {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.article-header {
  margin-bottom: 30px;
}

.article-title {
  font-size: 28px;
  margin-bottom: 15px;
  color: #303133;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 14px;
  color: #909399;
}

.article-meta span {
  display: flex;
  align-items: center;
}

.article-meta i {
  margin-right: 4px;
}

.article-content {
  line-height: 1.8;
  color: #303133;
  margin-bottom: 30px;
}

.article-content h2 {
  margin-top: 30px;
  margin-bottom: 15px;
  font-size: 22px;
}

.article-content h3 {
  margin-top: 25px;
  margin-bottom: 12px;
  font-size: 18px;
}

.article-content p {
  margin-bottom: 15px;
}

.article-content pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 15px;
}

.article-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.article-tags {
  margin-bottom: 30px;
}

.article-tags .el-tag {
  margin-right: 8px;
}

.article-author-info {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 30px;
}

.author-avatar {
  flex: 0 0 80px;
  margin-right: 20px;
}

.author-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
}

.author-details p {
  margin: 0;
  color: #606266;
}

.comments-section {
  margin-top: 40px;
}

.comments-section h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

.comment-form {
  margin-bottom: 30px;
}

.submit-comment {
  margin-top: 15px;
  float: right;
}

.no-comments {
  text-align: center;
  color: #909399;
  padding: 30px 0;
}

.comment-item {
  display: flex;
  margin-bottom: 25px;
}

.comment-avatar {
  flex: 0 0 50px;
  margin-right: 15px;
}

.comment-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  margin-bottom: 8px;
}

.comment-author {
  font-weight: bold;
  margin-right: 10px;
}

.comment-date {
  color: #909399;
  font-size: 13px;
}

.comment-text {
  line-height: 1.6;
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}

.comment-actions span {
  cursor: pointer;
}

.comment-actions span:hover {
  color: #409EFF;
}

.replies-list {
  margin-top: 15px;
  margin-left: 20px;
  padding-left: 15px;
  border-left: 2px solid #EBEEF5;
}

.reply-item {
  display: flex;
  margin-bottom: 15px;
}

.reply-avatar {
  flex: 0 0 40px;
  margin-right: 10px;
}

.reply-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reply-content {
  flex: 1;
}

.reply-header {
  margin-bottom: 5px;
  font-size: 13px;
}

.reply-author {
  font-weight: bold;
}

.reply-to, .reply-target {
  margin: 0 5px;
}

.reply-date {
  color: #909399;
}
.reply-text {
  line-height: 1.6;
}

.reply-form {
  margin-top: 15px;
  margin-bottom: 15px;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}
</style>