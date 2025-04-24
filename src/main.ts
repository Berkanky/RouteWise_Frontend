import { createApp } from 'vue';
import { Capacitor } from '@capacitor/core';
//import { StatusBar, Style } from '@capacitor/status-bar';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { IonicVue } from '@ionic/vue';
import App from './App.vue';
import router from './router';

/* Ionic CSS */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme overrides */
import './theme/variables.css';
import './theme/global.css'; // safe‑area insets burada

/* StatusBar yalnızca native’da çalışsın */
if (Capacitor.getPlatform() !== 'web') {
  /* StatusBar.setOverlaysWebView({ overlay: true });
  StatusBar.setBackgroundColor({ color: '#ffffff' });
  StatusBar.setStyle({ style: Style.Dark }); */
}

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia);

router.isReady().then(() => {
  app.mount('#app');
});
