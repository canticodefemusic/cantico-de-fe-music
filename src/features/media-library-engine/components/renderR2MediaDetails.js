/**
 * Cántico de Fe Music
 * V13.4.10 — Render R2 Media Details
 *
 * Muestra:
 * - Información física del archivo R2
 * - Metadatos persistentes
 * - Copyright
 */

function escapeHtml(
  value = ''
) {
  return String(
    value ?? ''
  )
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(
  value = ''
) {
  if (!value) {
    return 'No disponible';
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'No disponible';
  }

  return new Intl.DateTimeFormat(
    'es-US',
    {
      dateStyle:
        'medium',

      timeStyle:
        'short'
    }
  ).format(
    date
  );
}

function renderValue(
  label,
  value
) {
  return `
    <div
      class="r2-media-details__row"
    >
      <dt>
        ${escapeHtml(label)}
      </dt>

      <dd>
        ${escapeHtml(
          value ||
          'No disponible'
        )}
      </dd>
    </div>
  `;
}

function renderTags(
  tags = []
) {
  if (
    !Array.isArray(tags) ||
    !tags.length
  ) {
    return 'No disponible';
  }

  return tags
    .filter(Boolean)
    .join(', ');
}

function getCopyrightText(
  copyright = {}
) {
  const values = [
    copyright?.author
      ? `Autor: ${copyright.author}`
      : '',

    copyright?.holder
      ? `Titular: ${copyright.holder}`
      : '',

    copyright?.license
      ? `Licencia: ${copyright.license}`
      : '',

    copyright?.source
      ? `Fuente: ${copyright.source}`
      : '',

    copyright?.year
      ? `Año: ${copyright.year}`
      : ''
  ].filter(Boolean);

  return values.length
    ? values.join(' · ')
    : 'No disponible';
}

export function renderR2MediaDetails({
  media = null
} = {}) {
  if (!media) {
    return '';
  }

  const r2 =
    media.r2 || {};

  const signature =
    r2.signatureValidated === true
      ? 'Sí'
      : (
          r2.signatureValidated === false
            ? 'No'
            : 'No disponible'
        );

  const mediaUrl =
    r2.url ||
    media.path ||
    '';

  const displayName =
    media.name ||
    r2.displayName ||
    r2.originalName ||
    '';

  const originalName =
    r2.originalName ||
    displayName;

  const category =
    media.category &&
    media.category !== 'uploads'
      ? media.category
      : 'No disponible';

  const featured =
    media.featured
      ? 'Sí'
      : 'No';

  const copyrightText =
    getCopyrightText(
      media.copyright
    );

  return `
    <section
      class="r2-media-details"
      data-r2-media-details
      role="dialog"
      aria-modal="true"
      aria-labelledby="r2-media-details-title"
    >
      <div
        class="r2-media-details__panel"
      >
        <header
          class="r2-media-details__header"
        >
          <div>
            <p
              class="r2-media-details__eyebrow"
            >
              Cloudflare R2
            </p>

            <h2
              id="r2-media-details-title"
            >
              Detalles del archivo
            </h2>
          </div>

          <button
            type="button"
            class="r2-media-details__close"
            data-r2-media-details-close
            aria-label="Cerrar detalles"
          >
            ×
          </button>
        </header>

        <div
          class="r2-media-details__body"
        >
          ${
            media.type === 'image' &&
            mediaUrl
              ? `
                  <div
                    class="r2-media-details__preview"
                  >
                    <img
                      src="${escapeHtml(
                        mediaUrl
                      )}"
                      alt="${escapeHtml(
                        media.alt ||
                        displayName
                      )}"
                      loading="lazy"
                    />
                  </div>
                `
              : ''
          }

          <dl
            class="r2-media-details__list"
          >
            ${renderValue(
              'Nombre',
              displayName
            )}

            ${renderValue(
              'Nombre original',
              originalName
            )}

            ${renderValue(
              'Descripción',
              media.description
            )}

            ${renderValue(
              'Categoría',
              category
            )}

            ${renderValue(
              'Etiquetas',
              renderTags(
                media.tags
              )
            )}

            ${renderValue(
              'Destacado',
              featured
            )}

            ${
              media.type === 'image'
                ? renderValue(
                    'Texto ALT',
                    media.alt
                  )
                : ''
            }

            ${renderValue(
              'Copyright',
              copyrightText
            )}

            ${renderValue(
              'Tipo',
              media.type
            )}

            ${renderValue(
              'MIME',
              r2.contentType ||
              media.mimeType
            )}

            ${renderValue(
              'Extensión',
              r2.extension ||
              media.extension
            )}

            ${renderValue(
              'Tamaño',
              media
                ?.metadata
                ?.fileSize
            )}

            ${renderValue(
              'Fecha de subida',
              formatDate(
                r2.uploaded
              )
            )}

            ${renderValue(
              'Metadatos actualizados',
              formatDate(
                r2.metadataUpdatedAt
              )
            )}

            ${renderValue(
              'Firma validada',
              signature
            )}

            ${renderValue(
              'R2 Key',
              r2.key
            )}
          </dl>

          <div
            class="r2-media-details__actions"
          >
            ${
              mediaUrl
                ? `
                    <a
                      href="${escapeHtml(
                        mediaUrl
                      )}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="r2-media-details__action"
                    >
                      Ver archivo
                    </a>

                    <button
                      type="button"
                      class="r2-media-details__action"
                      data-r2-media-details-copy
                      data-r2-media-url="${escapeHtml(
                        mediaUrl
                      )}"
                    >
                      Copiar enlace
                    </button>
                  `
                : ''
            }

            <button
              type="button"
              class="r2-media-details__action"
              data-r2-media-details-close
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

export default
  renderR2MediaDetails;
