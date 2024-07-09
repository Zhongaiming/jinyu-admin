import { http } from '@/utils/http/axios';

/**
 * @description: 获取部门列表
 */
export function getSysDeptList(data) {
  return http.request({
    url: '/admin/upms/sysDept/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取单个部门详情
 */
export function getSysDeptView(params) {
  return http.request({
    url: '/admin/upms/sysDept/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加部门
 */
export function addSysDept(data) {
  return http.request({
    url: '/admin/upms/sysDept/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑部门
 */
export function updateSysDept(data) {
  return http.request({
    url: '/admin/upms/sysDept/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除部门
 */
export function deleteSysDept(data) {
  return http.request({
    url: '/admin/upms/sysDept/delete',
    method: 'POST',
    data,
  });
}

/**
 * @description: 部门列表字段
 */
export function getDeptListDict(data) {
  return http.request({
    url: '/admin/upms/sysDept/listDict',
    method: 'GET',
    data,
  });
}
