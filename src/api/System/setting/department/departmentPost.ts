import { http } from '@/utils/http/axios';

/**
 * @description: 获取部门下绑定岗位列表
 */
export function getSysDeptPostList(data) {
  return http.request({
    url: '/admin/upms/sysDept/listSysDeptPost',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取部门下未绑定岗位列表
 */
export function getNotInSysDeptPostList(params) {
  return http.request({
    url: '/admin/upms/sysDept/listNotInSysDeptPost',
    method: 'POST',
    params,
  });
}

/**
 * @description: 部门绑定岗位
 */
export function addSysDeptPost(data) {
  return http.request({
    url: '/admin/upms/sysDept/addSysDeptPost',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑部门下岗位
 */
export function updateSysDeptPost(data) {
  return http.request({
    url: '/admin/upms/sysDept/updateSysDeptPost',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除部门下岗位
 */
export function deleteSysDeptPost(data) {
  return http.request({
    url: '/admin/upms/sysDept/deleteSysDeptPost',
    method: 'POST',
    data,
  });
}
