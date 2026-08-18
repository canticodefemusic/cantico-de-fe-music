/**
 * Cántico de Fe Music
 * V13.4.30 — Render R2 Media Details + Cover Key
 *
 * Funciones:
 * - Mostrar información del archivo R2
 * - Mostrar metadatos persistentes
 * - Formulario para editar metadatos
 * - Editar asociación de portada mediante coverKey
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

function getCoverKey(
  media = {}
) {
  return String(
    media.coverKey ||
    media?.r2?.coverKey ||
    media?.r2?.customMetadata?.coverKey ||
    ''
  ).trim();
}

function renderMetadataForm(
  media
) {
  const r2 =
    media.r2 || {};

  const copyright =
    media.copyright || {};

  const tags =
    Array.isArray(
      media.tags
    )
      ? media.tags.join(', ')
      : '';

  const coverKey =
    getCoverKey(
      media
    );

  return `
    <form
      class="r2-media-details__editor"
      data-r2-media-metadata-form
      data-r2-media-key="${escapeHtml(
        r2.key
      )}"
      hidden
    >
      <div
        class="r2-media-details__field"
      >
        <label>
          Nombre visible
        </label>

        <input
          type="text"
          name="displayName"
          value="${escapeHtml(
            media.name
          )}"
          autocomplete="off"
        />
      </div>

      <div
        class="r2-media-details__field"
      >
        <label>
          Descripción
        </label>

        <textarea
          name="description"
          rows="3"
        >${escapeHtml(
          media.description
        )}</textarea>
      </div>

      ${
        media.type === 'image'
          ? `
              <div
                class="r2-media-details__field"
              >
                <label>
                  Texto ALT
                </label>

                <input
                  type="text"
                  name="alt"
                  value="${escapeHtml(
                    media.alt
                  )}"
                  autocomplete="off"
                />
              </div>
            `
          : `
              <input
                type="hidden"
                name="alt"
                value="${escapeHtml(
                  media.alt
                )}"
              />
            `
      }

      <div
        class="r2-media-details__field"
      >
        <label>
          Categoría
        </label>

        <input
          type="text"
          name="category"
          value="${escapeHtml(
            media.category === 'uploads'
              ? ''
              : media.category
          )}"
          autocomplete="off"
          placeholder="Ej. himnos"
        />
      </div>

      <div
        class="r2-media-details__field"
      >
        <label>
          Portada (R2 Key)
        </label>

        <input
          type="text"
          name="coverKey"
          value="${escapeHtml(
            coverKey
          )}"
          autocomplete="off"
          placeholder="Ej. uploads/2026-08-17/portada.jpg"
          data-r2-media-cover-key
        />

        <small>
          R2 Key de la imagen que se utilizará
          como portada de este archivo.
        </small>
      </div>

      <div
        class="r2-media-details__field"
      >
        <label>
          Etiquetas
        </label>

        <input
          type="text"
          name="tags"
          value="${escapeHtml(
            tags
          )}"
          autocomplete="off"
          placeholder="himno, audio, música"
        />
      </div>

      <label
        class="r2-media-details__checkbox"
      >
        <input
          type="checkbox"
          name="featured"
          ${
            media.featured
              ? 'checked'
              : ''
          }
        />

        <span>
          Archivo destacado
        </span>
      </label>

      <fieldset
        class="r2-media-details__copyright"
      >
        <legend>
          Copyright
        </legend>

        <div
          class="r2-media-details__field"
        >
          <label>
            Autor
          </label>

          <input
            type="text"
            name="copyrightAuthor"
            value="${escapeHtml(
              copyright.author
            )}"
            autocomplete="off"
          />
        </div>

        <div
          class="r2-media-details__field"
        >
          <label>
            Titular
          </label>

          <input
            type="text"
            name="copyrightHolder"
            value="${escapeHtml(
              copyright.holder
            )}"
            autocomplete="off"
          />
        </div>

        <div
          class="r2-media-details__field"
        >
          <label>
            Licencia
          </label>

          <input
            type="text"
            name="copyrightLicense"
            value="${escapeHtml(
              copyright.license
            )}"
            autocomplete="off"
          />
        </div>

        <div
          class="r2-media-details__field"
        >
          <label>
            Fuente
          </label>

          <input
            type="text"
            name="copyrightSource"
            value="${escapeHtml(
              copyright.source
            )}"
            autocomplete="off"
          />
        </div>

        <div
          class="r2-media-details__field"
        >
          <label>
            Año
          </label>

          <input
            type="text"
            name="copyrightYear"
            value="${escapeHtml(
              copyright.year
            )}"
            autocomplete="off"
            inputmode="numeric"
          />
        </div>
      </fieldset>

      <div
        class="r2-media-details__editor-actions"
      >
        <button
          type="submit"
          class="r2-media-details__action"
          data-r2-media-metadata-save
        >
          Guardar cambios
        </button>

        <button
          type="button"
          class="r2-media-details__action"
          data-r2-media-metadata-cancel
        >
          Cancelar
        </button>
      </div>

      <p
        class="r2-media-details__status"
        data-r2-media-metadata-status
        aria-live="polite"
      ></p>
    </form>
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

  const coverKey =
    getCoverKey(
      media
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

          <div
            data-r2-media-details-readonly
          >
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
                'Portada (R2 Key)',
                coverKey
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
          </div>

          ${renderMetadataForm(
            media
          )}

          <div
            class="r2-media-details__actions"
            data-r2-media-details-actions
          >
            <button
              type="button"
              class="r2-media-details__action"
              data-r2-media-metadata-edit
            >
              Editar
            </button>

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

export {
  escapeHtml,
  formatDate,
  renderValue,
  renderTags,
  getCopyrightText,
  getCoverKey,
  renderMetadataForm
};

export default
  renderR2MediaDetails;
