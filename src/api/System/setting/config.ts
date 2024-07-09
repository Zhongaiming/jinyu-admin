import { http } from '@/utils/http/axios';

/**
 * @description: 获取配置分组列表
 */
export function getSysConfigGroupList(data) {
  return http.request({
    url: '/admin/upms/configGroup/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取配置分组配置列表
 */
export function getListSysConfigById(data) {
  return http.request({
    url: '/admin/upms/configGroup/listConfig',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取配置分组配置列表
 */
export function updateSysConfig(data) {
  return http.request({
    url: '/admin/upms/configGroup/updateConfig',
    method: 'POST',
    data,
  });
}
