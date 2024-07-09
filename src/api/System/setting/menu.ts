import { http } from '@/utils/http/axios';
import { setObjToUrlParams } from '@/utils/urlUtils';

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return http.request({
    url: '/menus',
    method: 'GET',
  });
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(query, params?) {
  return http.request({
    url: setObjToUrlParams('/admin/upms/sysMenu/list', query),
    method: 'POST',
    params,
  });
}
// 添加菜单
export function addMenu(params) {
  return http.request({
    url: '/admin/upms/sysMenu/add',
    method: 'POST',
    params,
  });
}
// 添加菜单
export function deleteMenu(params) {
  return http.request({
    url: '/admin/upms/sysMenu/delete',
    method: 'POST',
    params,
  });
}
// 通过id查看菜单信息
export function viewMenuById(params) {
  return http.request({
    url: '/admin/upms/sysMenu/view',
    method: 'POST',
    params,
  });
}
// 更新菜单
export function updateMenu(params) {
  return http.request({
    url: '/admin/upms/sysMenu/update',
    method: 'POST',
    params,
  });
}
