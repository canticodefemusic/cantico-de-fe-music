import {
  appConfig
} from '../../config/appConfig.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderNavigationLinks(
  items = [],
  activePage = 'home',
  className = ''
) {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  return safeItems
    .map(item => {
      const active =
        item.id === activePage
          ? 'is-active'
          : '';

      const classes = [
        className,
        active
      ]
        .filter(Boolean)
        .join(' ');

      return `
        <a
          class="${classes}"
          href="${escapeHtml(item.href)}"
          ${
            item.id === activePage
              ? 'aria-current="page"'
              : ''
          }
        >
          ${escapeHtml(item.label)}
        </a>
      `;
    })
    .join('');
}

export function renderNavigation(
  items = [],
  activePage = 'home'
) {
  const desktopLinks =
    renderNavigationLinks(
      items,
      activePage
    );

  const mobileLinks =
    renderNavigationLinks(
      items,
      activePage,
      'cantico-mobile-nav__link'
    );

  return `
    <header class="cantico-header">

      <a
        class="cantico-brand"
        href="/"
        aria-label="Ir al inicio"
      >
        <span
          class="cantico-logo"
          aria-hidden="true"
        >
          ♪
        </span>

        <span class="cantico-brand__text">
          <strong>
            ${escapeHtml(
              appConfig.brand.name
            )}
          </strong>

          <small>
            ${escapeHtml(
              appConfig.brand.subtitle
            )}
          </small>
        </span>
      </a>

      <div class="cantico-header__actions">

        <nav
          class="cantico-nav cantico-nav--desktop"
          aria-label="Navegación principal"
        >
          ${desktopLinks}
        </nav>

        <button
          type="button"
          class="cantico-search-trigger"
          data-global-search-open
          aria-label="Abrir búsqueda global"
          title="Buscar"
        >
          <span aria-hidden="true">
            🔍
          </span>

          <span>
            Buscar
          </span>
        </button>

        <details class="cantico-mobile-nav">

          <summary
            class="cantico-mobile-nav__trigger"
            aria-label="Abrir menú de navegación"
            title="Menú"
          >
            <span
              class="cantico-mobile-nav__hamburger"
              aria-hidden="true"
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </summary>

          <div class="cantico-mobile-nav__panel">

            <nav
              class="cantico-mobile-nav__links"
              aria-label="Navegación móvil"
            >
              ${mobileLinks}
            </nav>

            <button
              type="button"
              class="cantico-mobile-nav__search"
              data-global-search-open
            >
              <span aria-hidden="true">
                🔍
              </span>

              <span>
                Buscar
              </span>
            </button>

          </div>

        </details>

      </div>

    </header>
  `;
}
