/**
 * 全局注册自定义组件
 * @param app
 */

import { App } from 'vue';
import { BasicTable } from '@/components/Table';
import { BasicImage } from '@/components/Image';
export function setupCustomComponents(app: App) {
  app.component('BasicTable', BasicTable);
  app.component('BasicImage', BasicImage);
}
