import { http } from '@/utils/http/axios';

export function getUserMessageList(params) {
  return http.request({
    url: '/admin/upms/message/listUserMessage',
    method: 'POST',
    params,
  });
}
/**
 * 根据提供的参数获取管理员消息列表。
 */
export function getAdminMessageList(params) {
  return http.request({
    url: '/admin/upms/message/list',
    method: 'POST',
    params,
  });
}
export function readMessage(params) {
  return http.request({
    url: '/admin/upms/message/readMessage',
    method: 'POST',
    params,
  });
}
export function getUserMessageCount() {
  return http.request({
    url: '/admin/upms/message/getMessageCount',
    method: 'POST',
  });
}
