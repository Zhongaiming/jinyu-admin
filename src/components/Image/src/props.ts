import { NImage } from 'naive-ui';

export const basicProps = {
  ...NImage.props,
  round: {
    type: Boolean,
    default: false,
  },
  srcfull: {
    type: Boolean,
    default: false,
  },
  other: {
    type: [Object],
    default: () => {},
  },
  fallsrc: {
    type: String,
    default: new URL('@/assets/images/fallImg.png', import.meta.url).href,
  },
  nosrc: {
    type: String,
    default: new URL('@/assets/images/noImg.png', import.meta.url).href,
  },
};
