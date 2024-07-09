import { http } from '@/utils/http/axios';

/**
 * @description: 获取用户列表
 */
export function getSysUserList(data) {
  return http.request({
    url: '/admin/upms/sysUser/list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取单个用户详情
 */
export function getSysUserView(params) {
  return http.request({
    url: '/admin/upms/sysUser/view',
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加用户
 */
export function addSysUser(data) {
  return http.request({
    url: '/admin/upms/sysUser/add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 编辑用户
 */
export function updateSysUser(data) {
  return http.request({
    url: '/admin/upms/sysUser/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 删除用户
 */
export function deleteSysUser(data) {
  return http.request({
    url: '/admin/upms/sysUser/delete',
    method: 'POST',
    data,
  });
}

/**
 * @description: 重置用户密码
 */
export function resetPasswordSysUser(data) {
  return http.request({
    url: '/admin/upms/sysUser/resetPassword',
    method: 'POST',
    data,
  });
}

/**
 * @description: 获取部门岗位人员
 */
export function getListByDeptPostId(params) {
  return http.request({
    url: '/admin/upms/sysUser/listByDeptPostId',
    method: 'GET',
    params,
  });
}

/**
 * @description: 岗位部门变更
 */
export function updateSysUserPost(data) {
  return http.request({
    url: '/admin/upms/sysUserPost/update',
    method: 'POST',
    data,
  });
}

/**
 * @description: 岗位部门变更记录
 */
export function sysUserPostList(data) {
  return http.request({
    url: '/admin/upms/sysUserPost/list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取部门人员
 */
export function getListByDeptId(params) {
  return http.request({
    url: '/admin/upms/sysUser/listByDeptId',
    method: 'GET',
    params,
  });
}

/**
 * @description: 获取岗位人员
 */
export function getListByPostId(params) {
  return http.request({
    url: '/admin/upms/sysUser/listByPostId',
    method: 'GET',
    params,
  });
}

/**
 * @description: 更新个人信息
 */
export function updateBasicInformation(data) {
  return http.request({
    url: '/admin/upms/sysUser/updateBasicInformation',
    method: 'POST',
    data,
  });
}

/**
 * @description: 更新绑定手机号码
 */
export function updateUserPhone(data) {
  return http.request({
    url: '/admin/upms/sysUser/updateUserPhone',
    method: 'POST',
    data,
  });
}

/**
 * @description: 切换部门岗位
 */
export function changeDeptIdentity(data) {
  return http.request({
    url: '/admin/upms/login/changeIdentity',
    method: 'POST',
    data,
  });
}
