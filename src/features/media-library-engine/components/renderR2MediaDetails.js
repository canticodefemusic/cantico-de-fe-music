/**
 * Cántico de Fe Music
 * V13.4.5 — Render R2 Media Details
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
                        media.name
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
              'Nombre original',
              r2.originalName ||
              media.name
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
