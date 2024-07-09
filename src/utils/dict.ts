import { useDictStore } from '@/store/modules/dict';
import { getListByDictType } from '@/api/System/setting/dict';
import { NTag } from 'naive-ui';

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res: any = ref({});
  return (() => {
    args.forEach((dictType) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        getListByDictType({ dictType }).then((resp) => {
          res.value[dictType] = resp;
          useDictStore().setDict(dictType, res.value[dictType]);
        });
      }
    });
    return toRefs(res.value);
  })();
}
/**
 * 通过字典值获取字典标签
 */
export const getDictLabel = (data: any[], value: string | number, defaultValue = ''): string =>
  data.find((item) => item.value == value + '')?.label ?? defaultValue;

export const dictTagView = (value: string, props = {}, type?) =>
  h(NTag, { bordered: false, ...props, type }, { default: () => value || '暂无' });


/**
 * @description: 视频类型
 * @param {array} args
 * @return {*}
 * @Date: 2024-06-26 14:49:26
 */  
export const getVideoTypeName = (data: any[], value: string | number, defaultValue = ''): string =>
  data.find((item) => item.id == value + '')?.typeName ?? defaultValue;

export const getUserName = (data: any[], value: string | number, defaultValue = ''): string =>
  data.find((item) => item.userId == value + '')?.showName ?? defaultValue; 
