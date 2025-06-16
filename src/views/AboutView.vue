<!-- src/views/AboutView.vue -->
<template>
  <div class="about-container">
    <div class="about-header">
      <h1>关于我们</h1>
      <p class="subtitle">了解个人博客系统的故事和团队</p>
    </div>
    
    <div class="about-section">
      <h2>我们的故事</h2>
      <p>个人博客系统是一个专为内容创作者设计的平台，旨在提供简洁、高效的内容管理和分享体验。</p>
      <p>我们的目标是帮助每一位创作者轻松地分享自己的想法、知识和经验，连接志同道合的读者，构建有价值的内容社区。</p>
      <p>无论您是技术博主、生活记录者还是专业领域的知识分享者，我们的平台都能满足您的需求，让您专注于创作本身。</p>
    </div>
    
    <div class="about-section">
      <h2>核心功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="el-icon-edit"></i>
          <h3>内容创作</h3>
          <p>强大的编辑器，支持多种格式的内容创作，让您的想法得到完美呈现。</p>
        </div>
        
        <div class="feature-card">
          <i class="el-icon-share"></i>
          <h3>社交分享</h3>
          <p>一键分享到各大社交平台，扩大您的影响力和读者群体。</p>
        </div>
        
        <div class="feature-card">
          <i class="el-icon-data-analysis"></i>
          <h3>数据分析</h3>
          <p>详细的阅读数据和用户行为分析，帮助您了解读者喜好。</p>
        </div>
        
        <div class="feature-card">
          <i class="el-icon-chat-dot-round"></i>
          <h3>互动社区</h3>
          <p>评论系统和用户互动功能，促进作者与读者之间的交流。</p>
        </div>
      </div>
    </div>
    
    <div class="about-section">
      <h2>我们的团队</h2>
      <div class="team-grid">
        <div class="team-member">
          <img src="https://picsum.photos/id/1005/200/200" alt="团队成员">
          <h3>张三</h3>
          <p class="role">创始人 & 产品设计</p>
          <p class="bio">拥有10年产品设计经验，致力于创造简洁实用的用户体验。</p>
        </div>
        
        <div class="team-member">
          <img src="https://picsum.photos/id/1012/200/200" alt="团队成员">
          <h3>李四</h3>
          <p class="role">技术负责人</p>
          <p class="bio">全栈开发工程师，热爱开源技术，Vue.js 社区活跃贡献者。</p>
        </div>
        
        <div class="team-member">
          <img src="https://picsum.photos/id/1027/200/200" alt="团队成员">
          <h3>王五</h3>
          <p class="role">UI/UX 设计师</p>
          <p class="bio">注重细节的设计师，追求每一个像素的完美呈现。</p>
        </div>
      </div>
    </div>
    
    <div class="about-section contact-section">
      <h2>联系我们</h2>
      <p>如果您有任何问题、建议或合作意向，欢迎随时联系我们。</p>
      
      <div class="contact-info">
        <div class="contact-item">
          <i class="el-icon-message"></i>
          <span>Email: contact@blogexample.com</span>
        </div>
        
        <div class="contact-item">
          <i class="el-icon-phone"></i>
          <span>电话: (123) 456-7890</span>
        </div>
        
        <div class="contact-item">
          <i class="el-icon-location"></i>
          <span>地址: 北京市海淀区科技园区100号</span>
        </div>
      </div>
      
      <div class="social-links">
        <a href="#" class="social-link"><i class="el-icon-s-platform"></i></a>
        <a href="#" class="social-link"><i class="el-icon-s-custom"></i></a>
        <a href="#" class="social-link"><i class="el-icon-s-promotion"></i></a>
        <a href="#" class="social-link"><i class="el-icon-s-management"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.about-header {
  text-align: center;
  margin-bottom: 50px;
}

.about-header h1 {
  font-size: 36px;
  margin-bottom: 15px;
  color: #303133;
}

.subtitle {
  font-size: 18px;
  color: #606266;
}

.about-section {
  margin-bottom: 60px;
}

.about-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #303133;
  position: relative;
  padding-left: 15px;
}

.about-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #409EFF;
  border-radius: 2px;
}

.about-section p {
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 15px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.feature-card {
  background-color: #f5f7fa;
  padding: 25px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card i {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #303133;
}

.feature-card p {
  font-size: 14px;
  color: #606266;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 30px;
}

.team-member {
  text-align: center;
}

.team-member img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.team-member h3 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #303133;
}

.team-member .role {
  font-size: 14px;
  color: #409EFF;
  margin-bottom: 10px;
}

.team-member .bio {
  font-size: 14px;
  color: #606266;
}

.contact-section {
  text-align: center;
}

.contact-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 30px 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-item i {
  font-size: 20px;
  color: #409EFF;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f5f7fa;
  color: #409EFF;
  font-size: 24px;
  transition: all 0.3s;
}

.social-link:hover {
  background-color: #409EFF;
  color: white;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
