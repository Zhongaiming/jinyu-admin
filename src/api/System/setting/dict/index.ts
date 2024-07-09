import { http } from '@/utils/http/axios';

// 查询字典列表
export function getDictList(params) {
  return http.request({
    url: '/common/dict/list',
    method: 'POST',
    params,
  });
}

// 查询字典详情
export function getDictView(params) {
  return http.request({
    url: '/common/dict/view',
    method: 'GET',
    params,
  });
}

// 新增字典
export function addDict(data) {
  return http.request({
    url: '/common/dict/add',
    method: 'POST',
    data,
  });
}

// 修改字典
export function updateDict(data) {
  return http.request({
    url: '/common/dict/update',
    method: 'POST',
    data,
  });
}

// 删除数据
export function deleteDict(data) {
  return http.request({
    url: '/common/dict/delete',
    method: 'POST',
    data,
  });
}

// 查询数据库接口
export function getOlineDblinkList(data) {
  return http.request({
    url: '/admin/online/onlineDblink/list',
    method: 'POST',
    data,
  });
}

// 查询数据表接口
export function getListDblinkTables(params) {
  return http.request({
    url: '/admin/online/onlineDblink/listDblinkTables',
    method: 'GET',
    params,
  });
}

// 查询表字段接口
export function getListDblinkTableColumns(params) {
  return http.request({
    url: '/admin/online/onlineDblink/listDblinkTableColumns',
    method: 'GET',
    params,
  });
}

//获取字典列表筛选
export function getDictMapList(params) {
  return http.request({
    url: '/common/dict/dictMapList',
    method: 'GET',
    params,
  });
}

// 根据字典类型查询字典数据信息
export function getListByDictType(data) {
  return http.request({
    url: '/common/dictData/listByDictType',
    method: 'POST',
    data,
  });
}
