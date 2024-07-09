import { http } from '@/utils/http/axios';
import Server from './server';
let atmosphere = Server.atmosphere;
/**
 * @module: 系统资源操作
 * @description: 获取列表
 */
export function get(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereSystemFile/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取详情
 */
export function getView(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereSystemFile/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: buySystemFile
 */
export function buySystemFile(params: any) {
    return http.request({
      url: atmosphere + '/admin/app/atmosphereSystemFile/buySystemFile',
      method: 'GET',
      params,
    });
}


/**
 * @description: 添加
 */
export function add(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereSystemFile/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑
 */
export function update(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereSystemFile/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除
 */
export function deleteItem(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereSystemFile/delete',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除全部
 */
export function deleteAll(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereSystemFile/deleteAllSystemFile',
    method: 'POST',
    data,
  });
}

export default {
    get,
    getView,
    add,
    update,
    deleteItem,
    buySystemFile,
    deleteAll,
}