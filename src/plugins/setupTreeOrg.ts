import type { App } from 'vue';
import vue3TreeOrg from 'vue3-tree-org';
import 'vue3-tree-org/lib/vue3-tree-org.css';
export function setupTreeOrg(app: App) {
  app.use(vue3TreeOrg);
}
