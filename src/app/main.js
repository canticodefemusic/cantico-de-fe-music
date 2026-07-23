import { startUnifiedCanticoApp } from './unifiedApp.js';
import { initLazyLoad } from '../features/hymn-library-engine/services/lazyLoadService.js';
import { initPwaInstallService } from '../features/pwa-engine/services/installService.js';

document.addEventListener('DOMContentLoaded', () => {
  startUnifiedCanticoApp('#app');
  initLazyLoad();
  initLazyLoad();
});
