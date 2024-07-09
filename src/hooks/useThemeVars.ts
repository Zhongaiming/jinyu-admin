import { computed } from 'vue';
import { useThemeVars } from 'naive-ui';
import { getColorType, hexToRgba, rgbStringToRgba } from '@/utils';
/*
 * 用于全局CSS转换成rgba形式
 * @param {string} name 类名
 * @param {number} opacity 数据删除项
 * @returns {string} 返回的rgba
 */
export function cssConvert(name: string, opacity?: number) {
  const themeVars = useThemeVars();
  const type = getColorType(themeVars.value[name]);
  if (type === 'hex') {
    return computed(() => hexToRgba(themeVars.value[name], opacity));
  } else if (type === 'rgb') {
    return computed(() => rgbStringToRgba(themeVars.value[name], opacity));
  } else {
    return computed(() => themeVars.value[name]);
  }
}
