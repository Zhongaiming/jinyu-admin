import { http } from '@/utils/http/axios';

/**
 * @description: 查询邮件发送规则列表
 */
export function getEmailSendingRuleList(data) {
  return http.request({
    url: '/admin/email/emailSendingRule/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 查询邮件发送规则详情
 */
export function getEmailSendingRuleView(params) {
  return http.request({
    url: '/admin/email/emailSendingRule/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 新增邮件发送规则数据
 */
export function addEmailSendingRule(data) {
  return http.request({
    url: '/admin/email/emailSendingRule/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 修改邮件发送规则数据
 */
export function updateEmailSendingRule(data) {
  return http.request({
    url: '/admin/email/emailSendingRule/update',
    method: 'POST',
    data: data,
  });
}

/**
 * @description: 删除邮件发送规则数据
 */
export function delEmailSendingRule(data) {
  return http.request({
    url: '/admin/email/emailSendingRule/delete',
    method: 'POST',
    data,
  });
}
