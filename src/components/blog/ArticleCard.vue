<template>
  <div class="article-card" @click="$emit('click')">
    <div class="article-cover">
      <img :src="article.coverImage" :alt="article.title">
    </div>
    <div class="article-content">
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-summary">{{ article.summary }}</p>
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
          <i class="el-icon-view"></i> {{ article.viewCount }}
        </span>
        <span class="comments">
          <i class="el-icon-chat-dot-round"></i> {{ article.commentCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.article-card {
  display: flex;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
  background-color: #fff;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-cover {
  flex: 0 0 200px;
  height: 150px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex: 1;
  padding: 15px;
}

.article-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  color: #303133;
}

.article-summary {
  margin-bottom: 15px;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
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

.article-meta span {
  display: flex;
  align-items: center;
}

.article-meta i {
  margin-right: 4px;
}
</style>
