import { http } from '@/utils/http/axios';

// 查询静态字典数据列表
export function getStaticDictDataList(data) {
  return http.request({
    url: '/common/dictData/list',
    method: 'POST',
    data,
  });
}

// 查询静态字典数据详细
export function getStaticDictDataView(params) {
  return http.request({
    url: '/common/dictData/view',
    method: 'GET',
    params,
  });
}

// 新增静态字典数据
export function addStaticDictData(data) {
  return http.request({
    url: '/common/dictData/add',
    method: 'POST',
    data,
  });
}

// 修改静态字典数据
export function updateStaticDictData(data) {
  return http.request({
    url: '/common/dictData/update',
    method: 'POST',
    data,
  });
}

// 删除静态字典数据
export function deleteStaticDictData(data) {
  return http.request({
    url: '/common/dictData/delete',
    method: 'POST',
    data,
  });
}
