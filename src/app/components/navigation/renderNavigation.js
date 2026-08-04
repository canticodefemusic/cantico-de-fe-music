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

export function renderNavigation(
  items = [],
  activePage = 'home'
) {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  const links = safeItems
    .map(item => {
      const active =
        item.id === activePage
          ? 'is-active'
          : '';

      return `
        <a
          class="${active}"
          href="${escapeHtml(item.href)}"
        >
          ${escapeHtml(item.label)}
        </a>
      `;
    })
    .join('');

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

        <span>
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
          class="cantico-nav"
          aria-label="Navegación principal"
        >
          ${links}
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
      </div>
    </header>
  `;
}
