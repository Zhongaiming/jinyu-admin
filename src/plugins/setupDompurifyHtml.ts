import type { App } from 'vue';
import VueDOMPurifyHTML from 'vue-dompurify-html';
export function setupDompurifyHtml(app: App) {
  app.use(VueDOMPurifyHTML);
}
