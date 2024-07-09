import { http } from '@/utils/http/axios';
import Server from './server';
let atmosphere = Server.atmosphere;
/**
 * @module: 视频类型
 * @description: 获取列表
 */
export function get(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/espType/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取详情
 */
export function getDetail(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/espType/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加
 */
export function add(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/espType/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑
 */
export function update(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/espType/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除
 */
export function deleteItem(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/espType/delete',
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