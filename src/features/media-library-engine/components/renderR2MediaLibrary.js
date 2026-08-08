/**
 * Cántico de Fe Music
 * V13.6.0 — R2 Media Library Search UI
 */

import {
  renderR2MediaItem
} from './renderR2MediaItem.js';

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

function renderEmptyState({
  searchQuery = ''
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

function renderSearchToolbar({
  searchQuery = '',
  totalCount = 0,
  visibleCount = 0
} = {}) {
  const searching =
    Boolean(
      String(
        searchQuery
      ).trim()
    );

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

      <div
        class="media-library-toolbar__results"
        aria-live="polite"
      >
        ${
          searching
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

export function renderR2MediaLibrary({
  objects = [],
  loading = false,
  error = null,
  searchQuery = '',
  totalCount = null,
  title =
    'Archivos multimedia',
  description =
    'Contenido almacenado en Cloudflare R2.'
} = {}) {

  const safeObjects =
    Array.isArray(objects)
      ? objects
      : [];

  const fullCount =
    Number.isFinite(
      Number(totalCount)
    )
      ? Number(totalCount)
      : safeObjects.length;

  const visibleCount =
    safeObjects.length;

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
          ? renderSearchToolbar({
              searchQuery,
              totalCount:
                fullCount,
              visibleCount
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
                      object
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
              searchQuery
            })
          : ''
      }

    </section>
  `;
}
