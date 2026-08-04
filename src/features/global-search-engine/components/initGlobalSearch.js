/**
 * Cántico de Fe Music
 * V11.1 — Global Search UI Controller
 */

import {
  ModalService
} from '../../modal-engine/index.js';

import {
  GlobalSearchService
} from '../index.js';

const GROUP_LABELS = {
  hymns: 'Himnos',
  playlists: 'Playlists',
  favorites: 'Favoritos',
  history: 'Historial',
  recommendations: 'Recomendaciones',
  devotionals: 'Devocionales'
};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderResultItem(item = {}) {
  const title =
    item.title ||
    item.name ||
    'Resultado sin título';

  const description =
    item.description ||
    item.scripture ||
    '';

  const href =
    item.href || '/';

  return `
    <a
      class="global-search-result"
      href="${escapeHtml(href)}"
    >
      <strong
        class="global-search-result__title"
      >
        ${escapeHtml(title)}
      </strong>

      ${
        description
          ? `
            <span
              class="global-search-result__description"
            >
              ${escapeHtml(description)}
            </span>
          `
          : ''
      }
    </a>
  `;
}

function renderSearchResults(results = {}) {
  if (
    !GlobalSearchService.hasResults(
      results
    )
  ) {
    return `
      <div class="global-search-empty">
        <p>
          No se encontraron resultados.
        </p>
      </div>
    `;
  }

  return Object.entries(results)
    .map(([groupName, items]) => {
      if (
        !Array.isArray(items) ||
        !items.length
      ) {
        return '';
      }

      const label =
        GROUP_LABELS[groupName] ||
        groupName;

      return `
        <section
          class="global-search-group"
          aria-label="${escapeHtml(label)}"
        >
          <h3
            class="global-search-group__title"
          >
            ${escapeHtml(label)}
          </h3>

          <div
            class="global-search-group__results"
          >
            ${items
              .map(renderResultItem)
              .join('')}
          </div>
        </section>
      `;
    })
    .join('');
}

function openGlobalSearch() {
  ModalService.open({
    title: 'Buscar',

    message: `
      <div class="global-search">
        <label
          for="globalSearchInput"
        >
          Buscar en Cántico de Fe Music
        </label>

        <input
          id="globalSearchInput"
          type="search"
          autocomplete="off"
          placeholder="Buscar himnos, playlists, devocionales..."
        >

        <div
          id="globalSearchResults"
          class="global-search-results"
          aria-live="polite"
        >
          <p>
            Escribe para comenzar la búsqueda.
          </p>
        </div>
      </div>
    `,

    actions: `
      <button
        type="button"
        data-global-search-close
      >
        Cerrar
      </button>
    `
  });

  const input =
    document.querySelector(
      '#globalSearchInput'
    );

  const resultsContainer =
    document.querySelector(
      '#globalSearchResults'
    );

  const closeButton =
    document.querySelector(
      '[data-global-search-close]'
    );

  if (
    !input ||
    !resultsContainer ||
    !closeButton
  ) {
    ModalService.close();
    return;
  }

  let searchTimeout = null;

  const runSearch = () => {
    const query =
      input.value.trim();

    if (!query) {
      resultsContainer.innerHTML = `
        <p>
          Escribe para comenzar la búsqueda.
        </p>
      `;

      return;
    }

    const results =
      GlobalSearchService.search(
        query,
        {
          limitPerGroup: 6
        }
      );

    resultsContainer.innerHTML =
      renderSearchResults(results);
  };

  input.addEventListener(
    'input',
    () => {
      window.clearTimeout(
        searchTimeout
      );

      searchTimeout =
        window.setTimeout(
          runSearch,
          180
        );
    }
  );

  closeButton.addEventListener(
    'click',
    () => {
      ModalService.close();
    }
  );

  window.setTimeout(() => {
    input.focus();
  }, 0);
}

export function initGlobalSearch() {
  document
    .querySelectorAll(
      '[data-global-search-open]'
    )
    .forEach(button => {
      button.addEventListener(
        'click',
        openGlobalSearch
      );
    });
}

export default initGlobalSearch;
