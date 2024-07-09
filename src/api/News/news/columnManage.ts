import { http } from '@/utils/http/axios';

/**
 * @description: 获取新闻栏目列表
 */
export function getCmsSectionList(data) {
  return http.request({
    url: '/admin/upms/cmsSection/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取新闻栏目详情
 */
export function getCmsSectionView(params) {
  return http.request({
    url: '/admin/upms/cmsSection/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加新闻栏目
 */
export function addCmsSection(data) {
  return http.request({
    url: '/admin/upms/cmsSection/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑新闻栏目
 */
export function updateCmsSection(data) {
  return http.request({
    url: '/admin/upms/cmsSection/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除新闻栏目
 */
export function deleteCmsSection(data) {
  return http.request({
    url: '/admin/upms/cmsSection/delete',
    method: 'POST',
    data,
  });
}

/**
 * @description: 新闻栏目字典
 */
export function cmsSectionDictList(params) {
  return http.request({
    url: '/admin/upms/cmsSection/listDict',
    method: 'GET',
    params,
  });
}
