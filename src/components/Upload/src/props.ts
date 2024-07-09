import type { PropType } from 'vue';
import { NUpload } from 'naive-ui';

export const basicProps = {
  ...NUpload.props,
  accept: {
    type: String,
    default: '.jpg,.png,.jpeg,.svg,.gif',
  },
  listType: {
    type: String as PropType<string>,
    default: 'image-card', //文件列表的内建样式，text、image 和 image-card
  },
  helpText: {
    type: String as PropType<string>,
    default: '',
  },
  maxSize: {
    type: Number as PropType<number>,
    default: 2,
  },
  max: {
    type: Number as PropType<number>,
    default: Infinity,
  },
  maxNumber: {
    type: Number as PropType<number>,
    default: Infinity,
  },
  value: {
    type: String as PropType<string>,
    default: '',
  },
  width: {
    type: Number as PropType<number>,
    default: 96,
  },
  height: {
    type: Number as PropType<number>,
    default: 96, //建议不小于这个尺寸 太小页面可能显示有异常
  },
};
