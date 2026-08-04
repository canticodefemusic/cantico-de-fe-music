/**
 * Cántico de Fe Music
 * V11.4.2 — SPA Navigation Controller
 */

let initialized = false;
let navigateHandler = null;

function isModifiedClick(event) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function isSupportedAnchor(anchor) {
  if (!anchor) {
    return false;
  }

  if (anchor.hasAttribute('download')) {
    return false;
  }

  const target =
    anchor.getAttribute('target');

  if (
    target &&
    target !== '_self'
  ) {
    return false;
  }

  const rawHref =
    anchor.getAttribute('href');

  if (
    !rawHref ||
    rawHref.startsWith('#') ||
    rawHref.startsWith('mailto:') ||
    rawHref.startsWith('tel:') ||
    rawHref.startsWith('javascript:')
  ) {
    return false;
  }

  let url;

  try {
    url = new URL(
      rawHref,
      window.location.href
    );
  } catch {
    return false;
  }

  if (
    url.origin !==
    window.location.origin
  ) {
    return false;
  }

  /*
   * Las vistas públicas de la aplicación
   * se resuelven desde la raíz mediante
   * parámetros como ?page=himnos.
   *
   * Esto evita interceptar audios,
   * imágenes, documentos u otros archivos.
   */
  return url.pathname === '/';
}

function notifyNavigation({
  source = 'programmatic'
} = {}) {
  if (
    typeof navigateHandler !==
    'function'
  ) {
    return;
  }

  navigateHandler({
    source,
    url: new URL(
      window.location.href
    )
  });
}

function handleDocumentClick(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    isModifiedClick(event)
  ) {
    return;
  }

  const anchor =
    event.target.closest(
      'a[href]'
    );

  if (!isSupportedAnchor(anchor)) {
    return;
  }

  const url =
    new URL(
      anchor.href,
      window.location.href
    );

  const currentUrl =
    new URL(
      window.location.href
    );

  const sameLocation =
    url.pathname ===
      currentUrl.pathname &&
    url.search ===
      currentUrl.search &&
    url.hash ===
      currentUrl.hash;

  event.preventDefault();

  if (sameLocation) {
    notifyNavigation({
      source: 'same-route'
    });

    return;
  }

  window.history.pushState(
    {
      canticoSpa: true
    },
    '',
    url
  );

  notifyNavigation({
    source: 'link'
  });
}

function handlePopState() {
  notifyNavigation({
    source: 'popstate'
  });
}

export function navigateSpa(
  href,
  {
    replace = false
  } = {}
) {
  let url;

  try {
    url = new URL(
      href,
      window.location.href
    );
  } catch {
    return false;
  }

  if (
    url.origin !==
      window.location.origin ||
    url.pathname !== '/'
  ) {
    window.location.href =
      url.href;

    return false;
  }

  const method =
    replace
      ? 'replaceState'
      : 'pushState';

  window.history[method](
    {
      canticoSpa: true
    },
    '',
    url
  );

  notifyNavigation({
    source:
      replace
        ? 'replace'
        : 'programmatic'
  });

  return true;
}

export function initSpaNavigation({
  onNavigate
} = {}) {
  navigateHandler =
    typeof onNavigate === 'function'
      ? onNavigate
      : null;

  if (initialized) {
    return;
  }

  document.addEventListener(
    'click',
    handleDocumentClick
  );

  window.addEventListener(
    'popstate',
    handlePopState
  );

  initialized = true;
}

export function destroySpaNavigation() {
  if (!initialized) {
    return;
  }

  document.removeEventListener(
    'click',
    handleDocumentClick
  );

  window.removeEventListener(
    'popstate',
    handlePopState
  );

  initialized = false;
  navigateHandler = null;
}

export default initSpaNavigation;
