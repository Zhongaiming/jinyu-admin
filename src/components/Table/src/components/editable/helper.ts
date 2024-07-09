import { ComponentType } from '../../types/componentType';
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
