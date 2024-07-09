import { createI18n } from 'vue-i18n';
import { storage } from '@/utils/Storage';
import { LOCALE } from '@/store/mutation-types';
import ZH from './zh.json';
import EN from './en.json';
const i18n = createI18n({
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: storage.get(LOCALE, 'zh'), //默认显示的语言
  legacy: false,
  messages: {
    zh: { ...ZH }, //引入语言文件
    en: { ...EN },
  },
});
export default i18n;
