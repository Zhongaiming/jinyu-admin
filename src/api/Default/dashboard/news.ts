import { http } from '@/utils/http/axios';

export function getUserNewsList(params) {
  return http.request({
    url: '/admin/upms/news/listUserNews',
    method: 'POST',
    params,
  });
}
/**
 * 获取用户新闻列表。
 */
export function getAdminNewsList(params) {
  return http.request({
    url: '/admin/upms/news/list',
    method: 'POST',
    params,
  });
}
export function readNews(params) {
  return http.request({
    url: '/admin/upms/news/readNews',
    method: 'POST',
    params,
  });
}
export function getNewsDetailById(params) {
  return http.request({
    url: '/admin/upms/news/view',
    method: 'GET',
    params,
  });
}
