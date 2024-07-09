import { http } from '@/utils/http/axios';

// 查询动态字典数据列表
export function getDynamicDictDataList(data) {
  return http.request({
    url: '/common/dictData/listByDynamicDictType',
    method: 'POST',
    data,
  });
}
