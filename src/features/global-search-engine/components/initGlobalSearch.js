/**
 * Cántico de Fe Music
 * V11.3 — Global Search Experience Pro
 */

import {
  ModalService
} from '../../modal-engine/index.js';

import GlobalSearchService
  from '../services/GlobalSearchService.js';

const SEARCH_DELAY = 180;

const GROUP_CONFIG = {
  hymns: {
    label: 'Himnos',
    icon: '♪'
  },

  playlists: {
    label: 'Playlists',
    icon: '▤'
  },

  favorites: {
    label: 'Favoritos',
    icon: '★'
  },

  history: {
    label: 'Historial',
    icon: '◷'
  },

  recommendations: {
    label: 'Recomendaciones',
    icon: '✦'
  },

  devotionals: {
    label: 'Devocionales',
    icon: '▧'
  }
};

const boundTriggers = new WeakSet();

let shortcutInitialized = false;
let activeResultIndex = -1;
let searchTimeout = null;
let lastSearchTrigger = null;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegExp(value = '') {
  return String(value)
    .replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
}

function highlightMatch(
  value = '',
  query = ''
) {
  const text =
    String(value || '');

  const cleanQuery =
    String(query || '').trim();

  if (!cleanQuery) {
    return escapeHtml(text);
  }

  const pattern =
    new RegExp(
      `(${escapeRegExp(cleanQuery)})`,
      'gi'
    );

  return text
    .split(pattern)
    .map(part => {
      const matches =
        part.toLowerCase() ===
        cleanQuery.toLowerCase();

      return matches
        ? `
          <mark class="global-search-highlight">
            ${escapeHtml(part)}
          </mark>
        `
        : escapeHtml(part);
    })
    .join('');
}

function getResultTitle(item = {}) {
  return (
    item.title ||
    item.name ||
    'Resultado sin título'
  );
}

function getResultDescription(item = {}) {
  return (
    item.description ||
    item.scripture ||
    item.subtitle ||
    ''
  );
}

function renderResultItem(
  item = {},
  query = '',
  groupName = ''
) {
  const title =
    getResultTitle(item);

  const description =
    getResultDescription(item);

  const href =
    item.href || '/';

  const group =
    GROUP_CONFIG[groupName] || {
      label: groupName,
      icon: '•'
    };

  return `
    <a
      class="global-search-result"
      href="${escapeHtml(href)}"
      data-global-search-result
      data-result-type="${escapeHtml(
        item.resultType || groupName
      )}"
      role="option"
      aria-selected="false"
    >
      <span
        class="global-search-result__icon"
        aria-hidden="true"
      >
        ${escapeHtml(group.icon)}
      </span>

      <span
        class="global-search-result__content"
      >
        <strong
          class="global-search-result__title"
        >
          ${highlightMatch(
            title,
            query
          )}
        </strong>

        ${
          description
            ? `
              <span
                class="global-search-result__description"
              >
                ${highlightMatch(
                  description,
                  query
                )}
              </span>
            `
            : ''
        }
      </span>
    </a>
  `;
}

function renderSearchResults(
  results = {},
  query = ''
) {
  if (
    !GlobalSearchService.hasResults(
      results
    )
  ) {
    return `
      <div class="global-search-empty">
        <p>
          No se encontraron resultados para
          <strong>
            “${escapeHtml(query)}”
          </strong>.
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

      const group =
        GROUP_CONFIG[groupName] || {
          label: groupName,
          icon: '•'
        };

      return `
        <section
          class="global-search-group"
          aria-label="${escapeHtml(
            group.label
          )}"
        >
          <h3
            class="global-search-group__title"
          >
            <span aria-hidden="true">
              ${escapeHtml(group.icon)}
            </span>

            <span>
              ${escapeHtml(group.label)}
            </span>
          </h3>

          <div
            class="global-search-group__results"
          >
            ${items
              .map(item =>
                renderResultItem(
                  item,
                  query,
                  groupName
                )
              )
              .join('')}
          </div>
        </section>
      `;
    })
    .join('');
}

function getResultElements() {
  return Array.from(
    document.querySelectorAll(
      '[data-global-search-result]'
    )
  );
}

function clearActiveResult() {
  const results =
    getResultElements();

  results.forEach(result => {
    result.classList.remove(
      'is-active'
    );

    result.setAttribute(
      'aria-selected',
      'false'
    );
  });

  activeResultIndex = -1;
}

function activateResult(index) {
  const results =
    getResultElements();

  if (!results.length) {
    activeResultIndex = -1;
    return;
  }

  const normalizedIndex =
    (
      index +
      results.length
    ) % results.length;

  results.forEach(
    (result, resultIndex) => {
      const active =
        resultIndex ===
        normalizedIndex;

      result.classList.toggle(
        'is-active',
        active
      );

      result.setAttribute(
        'aria-selected',
        String(active)
      );
    }
  );

  activeResultIndex =
    normalizedIndex;

  results[
    activeResultIndex
  ].scrollIntoView({
    block: 'nearest'
  });
}

function moveActiveResult(direction) {
  const results =
    getResultElements();

  if (!results.length) {
    return;
  }

  if (activeResultIndex < 0) {
    activateResult(
      direction > 0
        ? 0
        : results.length - 1
    );

    return;
  }

  activateResult(
    activeResultIndex +
    direction
  );
}

function openActiveResult() {
  const results =
    getResultElements();

  const activeResult =
    results[activeResultIndex];

  if (!activeResult) {
    return false;
  }

  activeResult.click();

  return true;
}

function openGlobalSearch() {
  const existingInput =
    document.querySelector(
      '#globalSearchInput'
    );

  if (existingInput) {
    existingInput.focus();
    existingInput.select();
    return;
  }

  const existingModal =
    document.querySelector(
      '.cantico-modal-backdrop'
    );

  if (existingModal) {
    return;
  }

  activeResultIndex = -1;

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
          spellcheck="false"
          placeholder="Buscar himnos, playlists, devocionales..."
          aria-describedby="globalSearchShortcut"
        >

        <div
          id="globalSearchShortcut"
          class="global-search-shortcut"
        >
          <span>
            ↑ ↓ Navegar
          </span>

          <span>
            Enter Abrir
          </span>

          <span>
            Esc Cerrar
          </span>
        </div>

        <div
          id="globalSearchSummary"
          class="global-search-summary"
          aria-live="polite"
        >
          Escribe para comenzar la búsqueda.
        </div>

        <div
          id="globalSearchResults"
          class="global-search-results"
          role="listbox"
          aria-label="Resultados de búsqueda"
        >
          <p>
            Puedes buscar en todo el contenido
            de Cántico de Fe Music.
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

  const summary =
    document.querySelector(
      '#globalSearchSummary'
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
    !summary ||
    !resultsContainer ||
    !closeButton
  ) {
    ModalService.close();
    return;
  }

  const runSearch = () => {
    const query =
      input.value.trim();

    clearActiveResult();

    if (!query) {
      summary.textContent =
        'Escribe para comenzar la búsqueda.';

      resultsContainer.innerHTML = `
        <p>
          Puedes buscar en todo el contenido
          de Cántico de Fe Music.
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

    const resultCount =
      GlobalSearchService
        .getResultCount(results);

    summary.textContent =
      resultCount === 1
        ? '1 resultado encontrado.'
        : `${resultCount} resultados encontrados.`;

    resultsContainer.innerHTML =
      renderSearchResults(
        results,
        query
      );
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
          SEARCH_DELAY
        );
    }
  );

  input.addEventListener(
    'keydown',
    event => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActiveResult(1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActiveResult(-1);
        return;
      }

      if (event.key === 'Enter') {
        if (activeResultIndex < 0) {
          return;
        }

        event.preventDefault();
        openActiveResult();
      }
    }
  );

  resultsContainer.addEventListener(
    'mousemove',
    event => {
      const result =
        event.target.closest(
          '[data-global-search-result]'
        );

      if (!result) {
        return;
      }

      const results =
        getResultElements();

      const index =
        results.indexOf(result);

      if (index >= 0) {
        activateResult(index);
      }
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

function handleGlobalShortcut(event) {
  const usesSearchShortcut =
    (
      event.ctrlKey ||
      event.metaKey
    ) &&
    event.key.toLowerCase() === 'k';

  if (!usesSearchShortcut) {
    return;
  }

  event.preventDefault();
  openGlobalSearch();
}

function bindGlobalShortcut() {
  if (shortcutInitialized) {
    return;
  }

  document.addEventListener(
    'keydown',
    handleGlobalShortcut
  );

  shortcutInitialized = true;
}

export function initGlobalSearch() {
  document
    .querySelectorAll(
      '[data-global-search-open]'
    )
    .forEach(button => {
      if (
        boundTriggers.has(button)
      ) {
        return;
      }

      button.addEventListener(
        'click',
        () => {
          lastSearchTrigger = button;
          openGlobalSearch();
        }
      );
      
      boundTriggers.add(button);
    });

  bindGlobalShortcut();
}

export default initGlobalSearch;
