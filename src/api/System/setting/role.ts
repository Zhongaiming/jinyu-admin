import { http } from '@/utils/http/axios';

/**
 * @description: 获取角色列表
 */
export function getSysRoleList(data) {
  return http.request({
    url: '/admin/upms/sysRole/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取单个角色详情
 */
export function getSysRoleView(params) {
  return http.request({
    url: '/admin/upms/sysRole/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加角色
 */
export function addSysRole(data) {
  return http.request({
    url: '/admin/upms/sysRole/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑角色
 */
export function updateSysRole(data) {
  return http.request({
    url: '/admin/upms/sysRole/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除角色
 */
export function deleteSysRole(data) {
  return http.request({
    url: '/admin/upms/sysRole/delete',
    method: 'POST',
    data,
  });
}

/**
 * @description: 角色选择列表
 */
export function appAllList(data) {
  return http.request({
    url: '/admin/upms/app/appAllList',
    method: 'POST',
    data,
  });
}
