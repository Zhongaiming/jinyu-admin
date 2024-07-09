import { http } from '@/utils/http/axios';

/**
 * @description: 获取应用列表
 */
export function getApplicationList(data) {
  return http.request({
    url: '/admin/upms/app/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 根据userId获取拥有的应用
 */
export function getApplicationById(params) {
  return http.request({
    url: '/admin/upms/app/getByUserId',
    method: 'GET',
    params,
  });
}

/**
 * @description: 获取单个应用详情
 */
export function getApplicationView(params) {
  return http.request({
    url: '/admin/upms/app/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加应用
 */
export function addApplication(data) {
  return http.request({
    url: '/admin/upms/app/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑应用
 */
export function updateApplication(data) {
  return http.request({
    url: '/admin/upms/app/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除应用
 */
export function deleteApplication(data) {
  return http.request({
    url: '/admin/upms/app/delete',
    method: 'POST',
    data,
  });
}

/**
 * @description: 通过角色查看应用信息
 */
export function getAppInfoByRoleId(data) {
  return http.request({
    url: '/admin/upms/app/getByRoleId',
    method: 'POST',
    data,
  });
}
