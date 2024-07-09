import { http } from '@/utils/http/axios';

/**
 * @description: 获取岗位列表
 */
export function getSysPostList(data) {
  return http.request({
    url: '/admin/upms/sysPost/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取单个岗位详情
 */
export function getSysPostView(params) {
  return http.request({
    url: '/admin/upms/sysPost/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加岗位
 */
export function addSysPost(data) {
  return http.request({
    url: '/admin/upms/sysPost/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑岗位
 */
export function updateSysPost(data) {
  return http.request({
    url: '/admin/upms/sysPost/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除岗位
 */
export function deleteSysPost(data) {
  return http.request({
    url: '/admin/upms/sysPost/delete',
    method: 'POST',
    data,
  });
}
