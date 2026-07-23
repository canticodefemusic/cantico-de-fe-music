import { startUnifiedCanticoApp } from './unifiedApp.js';
import { initLazyLoad } from '../features/hymn-library-engine/services/lazyLoadService.js';

document.addEventListener('DOMContentLoaded', () => {
  startUnifiedCanticoApp('#app');
  initLazyLoad();
});
