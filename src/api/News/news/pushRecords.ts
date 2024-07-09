import { http } from '@/utils/http/axios';

/**
 * @description: 获取文章推送记录列表
 */
export function getCmsArticlePushLog(data) {
  return http.request({
    url: '/admin/upms/cmsArticlePushLog/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取文章推送记录详情
 */
export function getCmsArticlePushLogView(params) {
  return http.request({
    url: '/admin/upms/cmsArticlePushLog/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 文章推送记录撤销
 */
export function cancelCmsArticlePushLog(data) {
  return http.request({
    url: '/admin/upms/cmsArticle/cancel',
    method: 'POST',
    data,
  });
}
