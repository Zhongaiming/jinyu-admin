import { ComponentType } from './types/index';
import I18n from '@/lang/index'; //引入i18n组件
/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component === 'NInput') return I18n.global.t('qingShuRu');
  if (
    ['NPicker', 'NSelect', 'NCheckbox', 'NRadio', 'NSwitch', 'NDatePicker', 'NTimePicker'].includes(
      component
    )
  )
    return I18n.global.t('qingXuanZe');
  return '';
}

const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'];

function genType() {
  // RangePicker (日期选择器) 代表的组件暂时未知，naive 文档上也没有这个组件，使用的是DatePicker
  return [...DATE_TYPE, 'RangePicker'];
}

/**
 * 时间字段 返回时间选择器相关的type
 */
export const dateItemType = genType();

// 返回不同类型的默认值 (暂时没有用到?)
export function defaultType(component) {
  if (component === 'NInput') return '';
  if (component === 'NInputNumber') return null;
  return [
    'NPicker',
    'NSelect',
    'NCheckbox',
    'NRadio',
    'NSwitch',
    'NDatePicker',
    'NTimePicker',
  ].includes(component)
    ? ''
    : undefined;
}
