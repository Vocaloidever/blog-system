import request from './index'

// 获取文章列表
export function fetchArticles(params) {
  return request({
    url: '/articles',
    method: 'get',
    params
  })
}

// 获取文章详情
export function fetchArticleDetail(id) {
  return request({
    url: `/articles/${id}`,
    method: 'get'
  })
}

// 创建文章
export function createArticle(data) {
  return request({
    url: '/articles',
    method: 'post',
    data
  })
}

// 更新文章
export function updateArticle(id, data) {
  return request({
    url: `/articles/${id}`,
    method: 'put',
    data
  })
}

// 删除文章
export function deleteArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: 'delete'
  })
}

// 获取文章评论
export function fetchComments(articleId, params) {
  return request({
    url: `/articles/${articleId}/comments`,
    method: 'get',
    params
  })
}

// 发表评论
export function postComment(articleId, data) {
  return request({
    url: `/articles/${articleId}/comments`,
    method: 'post',
    data
  })
}

// 回复评论
export function replyComment(articleId, commentId, data) {
  return request({
    url: `/articles/${articleId}/comments/${commentId}/replies`,
    method: 'post',
    data
  })
}

// 点赞文章
export function likeArticle(id) {
  return request({
    url: `/articles/${id}/like`,
    method: 'post'
  })
}

// 取消点赞
export function unlikeArticle(id) {
  return request({
    url: `/articles/${id}/unlike`,
    method: 'post'
  })
}
