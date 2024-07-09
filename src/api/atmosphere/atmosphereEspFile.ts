import { http } from '@/utils/http/axios';
import Server from './server';
let atmosphere = Server.atmosphere;
/**
 * @module: esp文件操作
 * @description: 获取列表
 */
export function get(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/esp/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取详情
 */
export function getView(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/esp/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: sendEspFile
 */
export function sendEspFile(params: any) {
    return http.request({
      url: atmosphere + '/admin/app/esp/sendEspFile',
      method: 'GET',
      params,
    });
}

/**
 * @description: 编辑
 */
export function update(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/esp/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除
 */
export function deleteItem(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/esp/delete',
    method: 'POST',
    data,
  });
}

export default {
    get,
    getView,
    update,
    deleteItem,
    sendEspFile,
}