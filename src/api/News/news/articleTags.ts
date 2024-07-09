import { http } from '@/utils/http/axios';

/**
 * @description: 获取新闻文章标签列表
 */
export function getCmsArticleTagList(data) {
  return http.request({
    url: '/admin/upms/cmsArticleTag/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取新闻文章标签详情
 */
export function getCmsArticleTagView(params) {
  return http.request({
    url: '/admin/upms/cmsArticleTag/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加新闻文章标签
 */
export function addCmsArticleTag(data) {
  return http.request({
    url: '/admin/upms/cmsArticleTag/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑新闻文章标签
 */
export function updateCmsArticleTag(data) {
  return http.request({
    url: '/admin/upms/cmsArticleTag/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除新闻文章标签
 */
export function deleteCmsArticleTag(data) {
  return http.request({
    url: '/admin/upms/cmsArticleTag/delete',
    method: 'POST',
    data,
  });
}
