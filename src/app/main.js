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


function renderCurrentRoute() {
  startUnifiedCanticoApp(
    '#app'
  );

  /*
   * Cada nueva vista puede contener
   * imágenes o elementos lazy-load.
   */
  initLazyLoad();
}


function navigateToUrl(url) {
  const targetUrl =
    url instanceof URL
      ? url
      : new URL(
          url,
          window.location.href
        );

  const currentUrl =
    new URL(
      window.location.href
    );

  /*
   * No hacemos nada si ya estamos
   * exactamente en la misma URL.
   */
  if (
    targetUrl.pathname ===
      currentUrl.pathname &&
    targetUrl.search ===
      currentUrl.search &&
    targetUrl.hash ===
      currentUrl.hash
  ) {
    return;
  }

  history.pushState(
    {},
    '',
    `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`
  );

  renderCurrentRoute();

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });
}


function initSpaNavigation() {
  document.addEventListener(
    'click',
    event => {
      /*
       * Permitir Command/Ctrl/Shift/Alt + click
       * y clicks distintos al principal.
       */
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link =
        event.target.closest(
          'a[href]'
        );

      if (!link) {
        return;
      }

      /*
       * No interceptar descargas.
       */
      if (
        link.hasAttribute(
          'download'
        )
      ) {
        return;
      }

      /*
       * No interceptar enlaces que
       * explícitamente abren otra ventana.
       */
      const target =
        link.getAttribute(
          'target'
        );

      if (
        target &&
        target !== '_self'
      ) {
        return;
      }

      const rawHref =
        link.getAttribute(
          'href'
        );

      if (
        !rawHref ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:')
      ) {
        return;
      }

      let url;

      try {
        url =
          new URL(
            link.href,
            window.location.href
          );
      } catch {
        return;
      }

      /*
       * Enlaces externos, como YouTube,
       * continúan usando navegación normal.
       */
      if (
        url.origin !==
        window.location.origin
      ) {
        return;
      }

      event.preventDefault();

      navigateToUrl(
        url
      );
    }
  );

  /*
   * Soporte para Atrás / Adelante
   * del navegador.
   */
  window.addEventListener(
    'popstate',
    () => {
      renderCurrentRoute();

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }
  );
}


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

    initSpaNavigation();
    initMobileNavigationBehavior();
  }
);
