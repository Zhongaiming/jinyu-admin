import { http } from '@/utils/http/axios';
import Server from './server';
let atmosphere = Server.atmosphere;
/**
 * @module: 视频资源操作
 * @description: 获取列表
 */
export function get(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereVideo/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: xxx
 */
export function getView(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereVideo/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: sendVideoFile
 */
export function sendVideoFile(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereVideo/sendVideoFile',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑
 */
export function update(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereVideo/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除
 */
export function deleteItem(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmosphereVideo/delete',
    method: 'POST',
    data,
  });
}

/**
 * @description: buySystemFile
 * 积分购买视频
 */
export function buySystemFile(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceVideo/buySystemFile',
    method: 'GET',
    params,
  });
}

export default {
  get,
  getView,
  sendVideoFile,
  update,
  deleteItem,
  buySystemFile,
}