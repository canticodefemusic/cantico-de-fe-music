/**
 * Cántico de Fe Music
 * V13.9.0 — Professional Media Manager Toolbar
 *
 * Funciones:
 * - Búsqueda
 * - Filtros multimedia
 * - Ordenamiento
 * - Cuadrícula / Lista
 * - Contador de resultados
 * - Compatible con controladores existentes
 */

function escapeHtml(
  value = ''
) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ------------------------------------------------------------------ */
/* Búsqueda                                                           */
/* ------------------------------------------------------------------ */

function renderSearch({
  searchQuery = ''
} = {}) {
  const searching =
    Boolean(
      String(
        searchQuery
      ).trim()
    );

  return `
    <div
      class="media-manager-toolbar__search"
    >

      <label
        class="media-manager-toolbar__search-label"
        for="media-manager-search"
      >
        Buscar archivos
      </label>

      <div
        class="media-manager-toolbar__search-control"
      >

        <span
          class="media-manager-toolbar__search-icon"
          aria-hidden="true"
        >
          🔍
        </span>

        <input
          id="media-manager-search"
          class="media-manager-toolbar__search-input"
          type="search"
          placeholder="Buscar archivos..."
          value="${escapeHtml(
            searchQuery
          )}"
          autocomplete="off"
          spellcheck="false"
          data-media-search
        >

        ${
          searching
            ? `
              <button
                type="button"
                class="media-manager-toolbar__search-clear"
                data-media-search-clear
                aria-label="Limpiar búsqueda"
                title="Limpiar búsqueda"
              >
                ×
              </button>
            `
            : ''
        }

      </div>

    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Filtros                                                            */
/* ------------------------------------------------------------------ */

function renderFilterButton({
  value,
  label,
  activeFilter
}) {
  const active =
    value === activeFilter;

  return `
    <button
      type="button"
      class="
        media-manager-toolbar__filter
        ${
          active
            ? 'is-active'
            : ''
        }
      "
      data-media-filter="${value}"
      aria-pressed="${
        active
          ? 'true'
          : 'false'
      }"
    >
      ${label}
    </button>
  `;
}

function renderFilters({
  activeFilter = 'all'
} = {}) {
  const filters = [
    {
      value: 'all',
      label: 'Todos'
    },
    {
      value: 'image',
      label: 'Imágenes'
    },
    {
      value: 'audio',
      label: 'Audio'
    },
    {
      value: 'video',
      label: 'Video'
    },
    {
      value: 'document',
      label: 'PDF'
    },
    {
      value: 'file',
      label: 'Otros'
    }
  ];

  return `
    <div
      class="media-manager-toolbar__filters"
      role="group"
      aria-label="Filtrar archivos por tipo"
    >
      ${filters
        .map(
          filter =>
            renderFilterButton({
              ...filter,
              activeFilter
            })
        )
        .join('')}
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Ordenamiento                                                       */
/* ------------------------------------------------------------------ */

function renderSort({
  sortMode = 'newest'
} = {}) {
  return `
    <div
      class="media-manager-toolbar__sort"
    >

      <label
        class="media-manager-toolbar__sort-label"
        for="media-manager-sort"
      >
        Ordenar
      </label>

      <select
        id="media-manager-sort"
        class="media-manager-toolbar__sort-select"
        data-media-sort
      >

        <option
          value="newest"
          ${
            sortMode === 'newest'
              ? 'selected'
              : ''
          }
        >
          Más recientes
        </option>

        <option
          value="oldest"
          ${
            sortMode === 'oldest'
              ? 'selected'
              : ''
          }
        >
          Más antiguos
        </option>

        <option
          value="name"
          ${
            sortMode === 'name'
              ? 'selected'
              : ''
          }
        >
          Nombre
        </option>

        <option
          value="size"
          ${
            sortMode === 'size'
              ? 'selected'
              : ''
          }
        >
          Tamaño
        </option>

        <option
          value="type"
          ${
            sortMode === 'type'
              ? 'selected'
              : ''
          }
        >
          Tipo
        </option>

      </select>

    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Selector Grid / Lista                                              */
/* ------------------------------------------------------------------ */

function renderViewSelector({
  viewMode = 'grid'
} = {}) {
  return `
    <div
      class="media-manager-toolbar__views"
      role="group"
      aria-label="Modo de visualización"
    >

      <button
        type="button"
        class="
          media-manager-toolbar__view
          ${
            viewMode === 'grid'
              ? 'is-active'
              : ''
          }
        "
        data-media-view="grid"
        aria-pressed="${
          viewMode === 'grid'
            ? 'true'
            : 'false'
        }"
        title="Vista Cuadrícula"
      >
        <span
          aria-hidden="true"
          class="media-manager-toolbar__view-icon"
        >
          ▦
        </span>

        <span>
          Cuadrícula
        </span>
      </button>

      <button
        type="button"
        class="
          media-manager-toolbar__view
          ${
            viewMode === 'list'
              ? 'is-active'
              : ''
          }
        "
        data-media-view="list"
        aria-pressed="${
          viewMode === 'list'
            ? 'true'
            : 'false'
        }"
        title="Vista Lista"
      >
        <span
          aria-hidden="true"
          class="media-manager-toolbar__view-icon"
        >
          ☰
        </span>

        <span>
          Lista
        </span>
      </button>

    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Resultados                                                         */
/* ------------------------------------------------------------------ */

function renderResults({
  totalCount = 0,
  visibleCount = 0,
  searchQuery = '',
  activeFilter = 'all'
} = {}) {
  const searching =
    Boolean(
      String(
        searchQuery
      ).trim()
    );

  const filtering =
    activeFilter !== 'all';

  if (
    searching ||
    filtering
  ) {
    return `
      <span
        class="media-manager-toolbar__results"
        aria-live="polite"
      >
        <strong>
          ${visibleCount}
        </strong>
        de
        ${totalCount}
        archivo${
          totalCount === 1
            ? ''
            : 's'
        }
      </span>
    `;
  }

  return `
    <span
      class="media-manager-toolbar__results"
      aria-live="polite"
    >
      <strong>
        ${totalCount}
      </strong>
      archivo${
        totalCount === 1
          ? ''
          : 's'
      }
    </span>
  `;
}

/* ------------------------------------------------------------------ */
/* Render principal                                                   */
/* ------------------------------------------------------------------ */

export function renderMediaManagerToolbar({
  searchQuery = '',
  activeFilter = 'all',
  sortMode = 'newest',
  viewMode = 'grid',
  totalCount = 0,
  visibleCount = 0
} = {}) {
  return `
    <section
      class="media-manager-toolbar"
      data-media-manager-toolbar
      aria-label="Herramientas de biblioteca multimedia"
    >

      <div
        class="media-manager-toolbar__primary"
      >

        ${renderSearch({
          searchQuery
        })}

        <div
          class="media-manager-toolbar__primary-actions"
        >

          ${renderSort({
            sortMode
          })}

          ${renderViewSelector({
            viewMode
          })}

        </div>

      </div>

      <div
        class="media-manager-toolbar__secondary"
      >

        ${renderFilters({
          activeFilter
        })}

        ${renderResults({
          totalCount,
          visibleCount,
          searchQuery,
          activeFilter
        })}

      </div>

    </section>
  `;
}

export default
  renderMediaManagerToolbar;
