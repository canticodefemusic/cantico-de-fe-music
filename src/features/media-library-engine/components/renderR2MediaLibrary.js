/**
 * Cántico de Fe Music
 * V13.6.5 — R2 Media Library
 *
 * Funciones:
 * - Estadísticas multimedia
 * - Búsqueda
 * - Filtros
 * - Ordenamiento
 * - Selección múltiple
 * - Barra de operaciones masivas
 */

import {
  renderR2MediaItem
} from './renderR2MediaItem.js';

import {
  renderMediaStatistics
} from './renderMediaStatistics.js';

/* ------------------------------------------------------------------ */
/* Utilidades                                                         */
/* ------------------------------------------------------------------ */

function escapeHtml(
  value = ''
) {
  return String(value)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );
}

/* ------------------------------------------------------------------ */
/* Estado vacío                                                       */
/* ------------------------------------------------------------------ */

function renderEmptyState({
  searchQuery = '',
  activeFilter = 'all'
} = {}) {

  if (searchQuery) {
    return `
      <div
        class="media-library-empty"
      >
        <p>
          No se encontraron archivos para
          "<strong>${escapeHtml(
            searchQuery
          )}</strong>".
        </p>
      </div>
    `;
  }

  if (
    activeFilter &&
    activeFilter !== 'all'
  ) {
    return `
      <div
        class="media-library-empty"
      >
        <p>
          No hay archivos en este filtro.
        </p>
      </div>
    `;
  }

  return `
    <div
      class="media-library-empty"
    >
      <p>
        No hay archivos disponibles.
      </p>
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Error                                                              */
/* ------------------------------------------------------------------ */

function renderErrorState(
  message = ''
) {
  return `
    <div
      class="media-library-error"
      role="alert"
    >
      <strong>
        No se pudo cargar la biblioteca multimedia.
      </strong>

      ${
        message
          ? `
            <p>
              ${escapeHtml(
                message
              )}
            </p>
          `
          : ''
      }
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
        media-library-filter
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
      class="media-library-filters"
      aria-label="Filtrar archivos"
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

function renderSortControl({
  sortMode = 'newest'
} = {}) {
  return `
    <div
      class="media-library-sort"
    >
      <label
        class="media-library-sort__label"
        for="media-library-sort-select"
      >
        Ordenar por
      </label>

      <select
        id="media-library-sort-select"
        class="media-library-sort__select"
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
/* Barra principal                                                    */
/* ------------------------------------------------------------------ */

function renderToolbar({
  searchQuery = '',
  activeFilter = 'all',
  sortMode = 'newest',
  totalCount = 0,
  visibleCount = 0
} = {}) {

  const searching =
    Boolean(
      String(
        searchQuery
      ).trim()
    );

  const filtering =
    activeFilter !== 'all';

  return `
    <div
      class="media-library-toolbar"
      data-media-toolbar
    >

      <div
        class="media-library-search"
      >
        <label
          class="media-library-search__label"
          for="media-library-search-input"
        >
          Buscar archivos
        </label>

        <div
          class="media-library-search__control"
        >
          <span
            class="media-library-search__icon"
            aria-hidden="true"
          >
            🔍
          </span>

          <input
            id="media-library-search-input"
            class="media-library-search__input"
            type="search"
            placeholder="Buscar por nombre o tipo..."
            value="${escapeHtml(
              searchQuery
            )}"
            autocomplete="off"
            spellcheck="false"
            data-media-search
          />

          ${
            searching
              ? `
                <button
                  type="button"
                  class="media-library-search__clear"
                  aria-label="Limpiar búsqueda"
                  data-media-search-clear
                >
                  ×
                </button>
              `
              : ''
          }
        </div>
      </div>

      ${renderFilters({
        activeFilter
      })}

      ${renderSortControl({
        sortMode
      })}

      <div
        class="media-library-toolbar__results"
        aria-live="polite"
      >
        ${
          searching ||
          filtering
            ? `
              ${visibleCount}
              de
              ${totalCount}
              archivo${
                totalCount === 1
                  ? ''
                  : 's'
              }
            `
            : `
              ${totalCount}
              archivo${
                totalCount === 1
                  ? ''
                  : 's'
              }
            `
        }
      </div>

    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Barra de selección / Bulk Operations                               */
/* ------------------------------------------------------------------ */

function renderSelectionToolbar({
  selectedCount = 0,
  visibleCount = 0,
  bulkBusy = false
} = {}) {

  if (!selectedCount) {
    return '';
  }

  return `
    <section
      class="
        media-selection-toolbar
        ${
          bulkBusy
            ? 'is-busy'
            : ''
        }
      "
      data-media-selection-toolbar
    >

      <div
        class="media-selection-toolbar__info"
      >
        <strong
          class="media-selection-toolbar__count"
        >
          ${selectedCount}
          archivo${
            selectedCount === 1
              ? ''
              : 's'
          }
          seleccionado${
            selectedCount === 1
              ? ''
              : 's'
          }
        </strong>

        ${
          bulkBusy
            ? `
              <span
                class="media-selection-toolbar__status"
                aria-live="polite"
              >
                Procesando...
              </span>
            `
            : ''
        }
      </div>

      <div
        class="media-selection-toolbar__actions"
      >

        ${
          visibleCount
            ? `
              <button
                type="button"
                data-media-select-all
                ${
                  bulkBusy
                    ? 'disabled'
                    : ''
                }
              >
                Seleccionar visibles
              </button>
            `
            : ''
        }

        <button
          type="button"
          data-media-bulk-copy
          ${
            bulkBusy
              ? 'disabled'
              : ''
          }
        >
          Copiar enlaces
        </button>

        <button
          type="button"
          data-media-bulk-delete
          class="media-selection-toolbar__delete"
          ${
            bulkBusy
              ? 'disabled'
              : ''
          }
        >
          Eliminar seleccionados
        </button>

        <button
          type="button"
          data-media-selection-clear
          ${
            bulkBusy
              ? 'disabled'
              : ''
          }
        >
          Limpiar selección
        </button>

      </div>

    </section>
  `;
}

/* ------------------------------------------------------------------ */
/* Render principal                                                   */
/* ------------------------------------------------------------------ */

export function renderR2MediaLibrary({
  objects = [],
  allObjects = [],
  loading = false,
  error = null,

  searchQuery = '',
  activeFilter = 'all',
  sortMode = 'newest',

  selectedKeys = [],
  selectedCount = null,

  bulkBusy = false,

  totalCount = null,

  title =
    'Archivos multimedia',

  description =
    'Contenido almacenado en Cloudflare R2.'
} = {}) {

  const safeObjects =
    Array.isArray(
      objects
    )
      ? objects
      : [];

  const safeAllObjects =
    Array.isArray(
      allObjects
    )
      ? allObjects
      : safeObjects;

  const safeSelectedKeys =
    selectedKeys instanceof Set
      ? selectedKeys
      : new Set(
          Array.isArray(
            selectedKeys
          )
            ? selectedKeys
            : []
        );

  const fullCount =
    Number.isFinite(
      Number(
        totalCount
      )
    )
      ? Number(
          totalCount
        )
      : safeAllObjects.length;

  const visibleCount =
    safeObjects.length;

  const finalSelectedCount =
    Number.isFinite(
      Number(
        selectedCount
      )
    )
      ? Number(
          selectedCount
        )
      : safeSelectedKeys.size;

  if (loading) {
    return `
      <section
        class="media-library-explorer"
        data-r2-media-library
      >

        <div
          class="media-library-explorer__header"
        >
          <div>
            <h2>
              ${escapeHtml(
                title
              )}
            </h2>

            <p>
              ${escapeHtml(
                description
              )}
            </p>
          </div>
        </div>

        <div
          class="media-library-loading"
          aria-live="polite"
        >
          Cargando archivos...
        </div>

      </section>
    `;
  }

  return `
    <section
      class="media-library-explorer"
      data-r2-media-library
    >

      ${
        !error
          ? renderMediaStatistics({
              objects:
                safeAllObjects
            })
          : ''
      }

      <div
        class="media-library-explorer__header"
      >

        <div>
          <h2>
            ${escapeHtml(
              title
            )}
          </h2>

          <p>
            ${escapeHtml(
              description
            )}
          </p>
        </div>

        <div
          class="media-library-explorer__summary"
        >
          ${fullCount}
          archivo${
            fullCount === 1
              ? ''
              : 's'
          }
        </div>

      </div>

      ${
        error
          ? renderErrorState(
              error
            )
          : ''
      }

      ${
        !error
          ? renderToolbar({
              searchQuery,
              activeFilter,
              sortMode,
              totalCount:
                fullCount,
              visibleCount
            })
          : ''
      }

      ${
        !error
          ? renderSelectionToolbar({
              selectedCount:
                finalSelectedCount,

              visibleCount,

              bulkBusy
            })
          : ''
      }

      ${
        !error &&
        safeObjects.length
          ? `
            <div
              class="media-library-grid"
              data-media-library-grid
            >
              ${safeObjects
                .map(
                  object =>
                    renderR2MediaItem(
                      object,
                      {
                        selected:
                          safeSelectedKeys.has(
                            object.key
                          )
                      }
                    )
                )
                .join('')}
            </div>
          `
          : ''
      }

      ${
        !error &&
        !safeObjects.length
          ? renderEmptyState({
              searchQuery,
              activeFilter
            })
          : ''
      }

    </section>
  `;
}
