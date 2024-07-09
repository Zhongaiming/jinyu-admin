import { http } from '@/utils/http/axios';
import Server from './server';
let atmosphere = Server.atmosphere;
/**
 * @module: 场地视频关联
 * @description: 获取列表
 */
export function get(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceVideo/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取详情
 */
export function getView(params: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceVideo/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加
 */
export function add(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceVideo/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑
 */
export function update(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceVideo/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除
 */
export function deleteItem(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceVideo/delete',
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

/**
 * @description: sendVideoFileByUserSelf
 */
export function sendVideoFileByUserSelf(data: any) {
  return http.request({
    url: atmosphere + '/admin/app/atmospherePlaceVideo/sendVideoFileByUserSelf',
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
    sendVideoFileByUserSelf,
}