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


function initMobileNavigationBehavior() {
  document.addEventListener(
    'click',
    event => {
      const mobileNavigation =
        document.querySelector(
          '[data-mobile-navigation]'
        );

      if (!mobileNavigation) {
        return;
      }

      /*
       * Close after selecting
       * a mobile navigation link
       */
      const navigationLink =
        event.target.closest(
          '.cantico-mobile-nav__link'
        );

      if (
        navigationLink &&
        mobileNavigation.contains(
          navigationLink
        )
      ) {
        mobileNavigation.removeAttribute(
          'open'
        );

        return;
      }

      /*
       * Close when pressing
       * the mobile search button
       */
      const closeTrigger =
        event.target.closest(
          '[data-mobile-navigation-close]'
        );

      if (
        closeTrigger &&
        mobileNavigation.contains(
          closeTrigger
        )
      ) {
        mobileNavigation.removeAttribute(
          'open'
        );

        return;
      }

      /*
       * Close when clicking
       * outside the menu
       */
      if (
        mobileNavigation.open &&
        !mobileNavigation.contains(
          event.target
        )
      ) {
        mobileNavigation.removeAttribute(
          'open'
        );
      }
    }
  );
}


document.addEventListener(
  'DOMContentLoaded',
  () => {
    ToastEngine.init();

    startUnifiedCanticoApp(
      '#app'
    );

    initLazyLoad();
    initPwaInstallService();

    initMobileNavigationBehavior();
  }
);
