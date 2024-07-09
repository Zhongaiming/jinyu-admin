import { http } from '@/utils/http/axios';
import Server from './server';
let atmosphere = Server.atmosphere;
/**
 * @module: 用户场地关联
 * @description: 获取列表
 */
export function get(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereUserPlace/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取详情
 */
export function getDetail(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereUserPlace/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加
 */
export function add(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereUserPlace/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑
 */
export function update(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereUserPlace/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除
 */
export function deleteItem(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereUserPlace/delete',
    method: 'POST',
    data,
  });
}

export default {
  get,
  getDetail,
  add,
  update,
  deleteItem,
}