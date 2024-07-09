import { http } from '@/utils/http/axios';

/**
 *  获取版本列表
 * @param data
 */
export function getVersionList(data) {
  return http.request({
    url: '/admin/upms/app/version/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 新增版本更新记录
 */
export function addVersion(data) {
  return http.request({
    url: '/admin/upms/app/version/add',
    method: 'POST',
    data,
  });
}

/**
 * 获取版本详情
 * @param data
 */
export function getVersionDetail(data) {
  return http.request({
    url: '/admin/upms/app/version/get',
    method: 'POST',
    data,
  });
}

/**
 * 删除版本信息
 * @param data
 */
export function deleteVersion(data) {
  return http.request({
    url: '/admin/upms/app/version/delete',
    method: 'POST',
    data,
  });
}

/**
 * 修改版本信息
 * @param data
 */
export function updateVersion(data) {
  return http.request({
    url: '/admin/upms/app/version/update',
    method: 'POST',
    data,
  });
}
