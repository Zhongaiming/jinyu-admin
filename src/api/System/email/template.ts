import { http } from '@/utils/http/axios';

/**
 * @description: 查询邮件模板列表
 */
export function getEmailTemplateList(data) {
  return http.request({
    url: '/admin/email/emailTemplate/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 查询邮件模板详情
 */
export function getEmailTemplateView(params) {
  return http.request({
    url: '/admin/email/emailTemplate/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 新增邮件模板数据
 */
export function addEmailTemplate(data) {
  return http.request({
    url: '/admin/email/emailTemplate/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 修改邮件模板数据
 */
export function updateEmailTemplate(data) {
  return http.request({
    url: '/admin/email/emailTemplate/update',
    method: 'POST',
    data: data,
  });
}

/**
 * @description: 删除邮件模板数据
 */
export function delEmailTemplate(data) {
  return http.request({
    url: '/admin/email/emailTemplate/delete',
    method: 'POST',
    data,
  });
}
