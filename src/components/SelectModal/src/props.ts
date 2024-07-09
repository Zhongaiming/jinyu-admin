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
    type: [Number, String],
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
    default: true,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  /*
   类型
   Dept 部门
   Post 岗位
   DeptPost 部门岗位
   DeptMan 部门选人
   DostMan 岗位选人
   DeptPostMan 部门岗位选人
  */
  type: {
    type: String,
    default: '',
  },
};
