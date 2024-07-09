import type { App } from 'vue';
import I18n from '@/lang/index'; //引入i18n组件
export function setupI18n(app: App) {
  app.use(I18n);
}
