import { http } from '@/utils/http/axios';

/**
 * @description: 获取消息授权应用列表
 */
export function getMessageAppList(data) {
  return http.request({
    url: '/admin/upms/messageApp/list',
    method: 'POST',
    data,
  });
}
// 获取消息授权应用详情
export function getMessageAppView(params) {
  return http.request({
    url: '/admin/upms/messageApp/view',
    method: 'GET',
    params,
  });
}
/**
 * @description: 新增消息授权应用
 */
export function addMessageApp(data) {
  return http.request({
    url: '/admin/upms/messageApp/add',
    method: 'POST',
    data,
  });
}
/**
 * @description: 更新消息授权应用
 */
export function updateMessageApp(data) {
  return http.request({
    url: '/admin/upms/messageApp/update',
    method: 'POST',
    data,
  });
}
/**
 * @description: 删除消息授权应用
 */
export function deleteMessageApp(data) {
  return http.request({
    url: '/admin/upms/messageApp/delete',
    method: 'POST',
    data,
  });
}
