/**
 * Cántico de Fe Music
 * V13.3.1 — Render R2 Media Library
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

function renderEmptyState() {
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

export function renderR2MediaLibrary({
  objects = [],
  loading = false,
  error = null,
  title =
    'Archivos multimedia',
  description =
    'Contenido almacenado en Cloudflare R2.'
} = {}) {

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
          ${
            Array.isArray(objects)
              ? objects.length
              : 0
          }
          archivo${
            objects?.length === 1
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
        !error &&
        Array.isArray(objects) &&
        objects.length
          ? `
            <div
              class="media-library-grid"
              data-media-library-grid
            >
              ${objects
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
        (
          !Array.isArray(objects) ||
          !objects.length
        )
          ? renderEmptyState()
          : ''
      }

    </section>
  `;
}
