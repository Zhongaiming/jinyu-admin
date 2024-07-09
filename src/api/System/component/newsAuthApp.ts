import { http } from '@/utils/http/axios';

/**
 * @description: 获取新闻授权应用列表
 */
export function getNewsAppList(data) {
  return http.request({
    url: '/admin/upms/newsApp/list',
    method: 'POST',
    data,
  });
}
// 获取新闻授权应用详情
export function getNewsAppView(params) {
  return http.request({
    url: '/admin/upms/newsApp/view',
    method: 'GET',
    params,
  });
}
/**
 * @description: 新增新闻授权应用
 */
export function addNewsApp(data) {
  return http.request({
    url: '/admin/upms/newsApp/add',
    method: 'POST',
    data,
  });
}
/**
 * @description: 更新新闻授权应用
 */
export function updateNewsApp(data) {
  return http.request({
    url: '/admin/upms/newsApp/update',
    method: 'POST',
    data,
  });
}
/**
 * @description: 删除新闻授权应用
 */
export function deleteNewsApp(data) {
  return http.request({
    url: '/admin/upms/newsApp/delete',
    method: 'POST',
    data,
  });
}
