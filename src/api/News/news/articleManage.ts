import { http } from '@/utils/http/axios';

/**
 * @description: 获取新闻文章列表
 */
export function getCmsArticleList(data) {
  return http.request({
    url: '/admin/upms/cmsArticle/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取新闻文章详情
 */
export function getCmsArticleView(params) {
  return http.request({
    url: '/admin/upms/cmsArticle/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加新闻文章
 */
export function addCmsArticle(data) {
  return http.request({
    url: '/admin/upms/cmsArticle/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑新闻文章
 */
export function updateCmsArticle(data) {
  return http.request({
    url: '/admin/upms/cmsArticle/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除新闻文章
 */
export function deleteCmsArticle(data) {
  return http.request({
    url: '/admin/upms/cmsArticle/delete',
    method: 'POST',
    data,
  });
}

/**
 * @description: 新闻文章推送
 */
export function pushCmsArticle(data) {
  return http.request({
    url: '/admin/upms/cmsArticle/push',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取新闻文章推送类型
 */
export function getListAuthType(params) {
  return http.request({
    url: '/admin/upms/cmsArticle/listAuthType',
    method: 'GET',
    params,
  });
}
