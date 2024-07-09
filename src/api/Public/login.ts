import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.request({
    url: '/admin/upms/login/getLoginInfo',
    // url: '/admin_info',
    method: 'GET',
  });
}

/**
 * @description: 用户登录
 */
export function login(data) {
  return http.request<BasicResponseModel>(
    {
      // url: '/login',
      url: '/admin/upms/login/doLogin',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(data) {
  return http.request({
    url: '/admin/upms/login/changePassword',
    method: 'POST',
    data,
  });
}

/**
 * @description: 用户登出
 */
export function logout(data) {
  return http.request({
    url: '/admin/upms/login/doLogout',
    method: 'POST',
    data,
  });
}
