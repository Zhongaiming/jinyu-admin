import { http } from '@/utils/http/axios';
import Server from './server';
const atmosphere = Server.atmosphere;
/**
 * @module: esp文件操作
 * @description: 获取列表
 */
export function get(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceEsp/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取详情
 */
export function getView(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceEsp/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加
 */
export function add(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceEsp/add',
    method: 'GET',
    params,
  });
}

/**
 * @description: 编辑
 */
export function update(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceEsp/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除
 */
export function deleteItem(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceEsp/delete',
    method: 'POST',
    data,
  });
}

export function sendEspFile(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/esp/sendEspFile',
    method: 'POST',
    data,
  });
}

export default {
  get,
  getView,
  update,
  deleteItem,
  add,
  sendEspFile,
};
