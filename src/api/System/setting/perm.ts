import { http } from '@/utils/http/axios';

export function getPermCodeListDict() {
  return http.request({
    url: '/admin/upms/sysPermCode/listDict',
    method: 'GET',
  });
}
export function getPermCodeList(data) {
  return http.request({
    url: '/admin/upms/sysPermCode/list',
    method: 'POST',
    data,
  });
}
export function updatePermCode(data) {
  return http.request({
    url: '/admin/upms/sysPermCode/update',
    method: 'POST',
    data,
  });
}
