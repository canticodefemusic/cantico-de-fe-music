import {
  startUnifiedCanticoApp
} from './unifiedApp.js';

import {
  initLazyLoad
} from '../features/hymn-library-engine/services/lazyLoadService.js';

import {
  initPwaInstallService
} from '../features/pwa-engine/services/installService.js';

import {
  ToastEngine
} from '../features/toast-engine/index.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    ToastEngine.init();

    startUnifiedCanticoApp(
      '#app'
    );

    initLazyLoad();
    initPwaInstallService();
  }
);
