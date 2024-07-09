import { http } from '@/utils/http/axios';

/**
 * @description: 获取邮件行为列表
 */
export function getEmailBehaviorList(data) {
  return http.request({
    url: '/admin/email/emailBehavior/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 删除邮件行为
 */
export function deleteEmailBehavior(data) {
  return http.request({
    url: '/admin/email/emailBehavior/delete',
    method: 'POST',
    data,
  });
}
