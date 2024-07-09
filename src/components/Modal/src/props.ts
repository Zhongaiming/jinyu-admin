import { NModal } from 'naive-ui';
import I18n from '@/lang/index'; //引入i18n组件
export const basicProps = {
  ...NModal.props,
  // 确认按钮文字
  subBtuText: {
    type: String,
    default: I18n.global.t('queRen'),
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [String, Number],
    default: 446,
  },
  title: {
    type: String,
    default: '',
  },
  maskClosable: {
    type: Boolean,
    default: false,
  },
  preset: {
    type: String,
    default: 'dialog',
  },
  showDefaultAction: {
    type: Boolean,
    default: false,
  },
};
