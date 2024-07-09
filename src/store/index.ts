import type { App } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist'; //导入持久化插件
import Colada, { PiniaColadaPlugin } from 'colada-plugin';
const store = createPinia();
store.use(piniaPluginPersist);
store.use(PiniaColadaPlugin);
export function setupStore(app: App<Element>) {
  app.use(store);
  app.use(Colada);
}

export { store };
