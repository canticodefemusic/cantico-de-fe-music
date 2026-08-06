/**
 * Cántico de Fe Music
 * V13.0.2 — Media Metadata Editor
 */

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeTags(
  tags = []
) {
  if (Array.isArray(tags)) {
    return tags
      .map(tag =>
        String(tag ?? '').trim()
      )
      .filter(Boolean)
      .join(', ');
  }

  return String(
    tags ?? ''
  ).trim();
}

function normalizeCopyright(
  copyright = {}
) {
  const source =
    copyright &&
    typeof copyright ===
      'object'
      ? copyright
      : {};

  return {
    holder:
      source.holder || '',

    author:
      source.author || '',

    license:
      source.license || '',

    source:
      source.source || '',

    year:
      source.year || ''
  };
}

function getTypeLabel(
  type = ''
) {
  const labels = {
    image:
      'Imagen',

    audio:
      'Audio',

    video:
      'Video',

    document:
      'Documento',

    other:
      'Otro'
  };

  return (
    labels[type] ||
    'Archivo'
  );
}

function renderImagePreview(
  media = {}
) {
  return `
    <figure
      class="
        media-metadata-editor__preview-content
        media-metadata-editor__preview-content--image
      "
    >
      <img
        src="${escapeHtml(
          media.path
        )}"
        alt="${escapeHtml(
          media.alt ||
          media.name ||
          'Vista previa'
        )}"
        loading="lazy"
      >
    </figure>
  `;
}

function renderAudioPreview(
  media = {}
) {
  return `
    <div
      class="
        media-metadata-editor__preview-content
        media-metadata-editor__preview-content--audio
      "
    >
      <span
        class="media-metadata-editor__preview-icon"
        aria-hidden="true"
      >
        🎵
      </span>

      <audio
        controls
        preload="metadata"
        src="${escapeHtml(
          media.path
        )}"
      >
        Tu navegador no puede reproducir
        este archivo de audio.
      </audio>
    </div>
  `;
}

function renderVideoPreview(
  media = {}
) {
  return `
    <div
      class="
        media-metadata-editor__preview-content
        media-metadata-editor__preview-content--video
      "
    >
      <video
        controls
        preload="metadata"
        src="${escapeHtml(
          media.path
        )}"
      >
        Tu navegador no puede reproducir
        este archivo de video.
      </video>
    </div>
  `;
}

function renderDocumentPreview(
  media = {}
) {
  return `
    <div
      class="
        media-metadata-editor__preview-content
        media-metadata-editor__preview-content--document
      "
    >
      <span
        class="media-metadata-editor__preview-icon"
        aria-hidden="true"
      >
        📄
      </span>

      <p>
        Este tipo de archivo no tiene
        vista previa directa.
      </p>

      ${
        media.path
          ? `
            <a
              href="${escapeHtml(
                media.path
              )}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir documento
            </a>
          `
          : ''
      }
    </div>
  `;
}

function renderOtherPreview(
  media = {}
) {
  return `
    <div
      class="
        media-metadata-editor__preview-content
        media-metadata-editor__preview-content--other
      "
    >
      <span
        class="media-metadata-editor__preview-icon"
        aria-hidden="true"
      >
        📦
      </span>

      <p>
        No existe una vista previa
        disponible para este archivo.
      </p>

      ${
        media.path
          ? `
            <a
              href="${escapeHtml(
                media.path
              )}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir archivo
            </a>
          `
          : ''
      }
    </div>
  `;
}

function renderPreview(
  media = {}
) {
  switch (media.type) {
    case 'image':
      return renderImagePreview(
        media
      );

    case 'audio':
      return renderAudioPreview(
        media
      );

    case 'video':
      return renderVideoPreview(
        media
      );

    case 'document':
      return renderDocumentPreview(
        media
      );

    default:
      return renderOtherPreview(
        media
      );
  }
}

function renderTechnicalDetails(
  media = {}
) {
  const metadata =
    media.metadata &&
    typeof media.metadata ===
      'object'
      ? media.metadata
      : {};

  return `
    <dl
      class="media-metadata-editor__technical-details"
    >
      <div>
        <dt>
          ID
        </dt>

        <dd>
          <code>
            ${escapeHtml(
              media.id ||
              'No disponible'
            )}
          </code>
        </dd>
      </div>

      <div>
        <dt>
          Tipo
        </dt>

        <dd>
          ${escapeHtml(
            getTypeLabel(
              media.type
            )
          )}
        </dd>
      </div>

      <div>
        <dt>
          Formato
        </dt>

        <dd>
          ${escapeHtml(
            media.extension ||
            'No disponible'
          )}
        </dd>
      </div>

      <div>
        <dt>
          Tipo MIME
        </dt>

        <dd>
          ${escapeHtml(
            media.mimeType ||
            'No disponible'
          )}
        </dd>
      </div>

      <div>
        <dt>
          Ruta
        </dt>

        <dd>
          <code>
            ${escapeHtml(
              media.path ||
              'No disponible'
            )}
          </code>
        </dd>
      </div>

      ${
        media.type === 'image'
          ? `
            <div>
              <dt>
                Dimensiones
              </dt>

              <dd>
                ${
                  metadata.width &&
                  metadata.height
                    ? `${escapeHtml(
                        metadata.width
                      )} × ${escapeHtml(
                        metadata.height
                      )}`
                    : 'No disponibles'
                }
              </dd>
            </div>
          `
          : ''
      }

      ${
        (
          media.type === 'audio' ||
          media.type === 'video'
        )
          ? `
            <div>
              <dt>
                Duración
              </dt>

              <dd>
                ${escapeHtml(
                  metadata.duration ||
                  'No disponible'
                )}
              </dd>
            </div>
          `
          : ''
      }

      <div>
        <dt>
          Tamaño
        </dt>

        <dd>
          ${escapeHtml(
            metadata.fileSize ||
            'No disponible'
          )}
        </dd>
      </div>
    </dl>
  `;
}

function renderGeneralFields(
  media = {}
) {
  return `
    <div
      class="media-metadata-editor__fields"
    >
      <label
        class="media-metadata-editor__field"
        for="mediaMetadataName"
      >
        <span>
          Nombre
        </span>

        <input
          id="mediaMetadataName"
          type="text"
          name="name"
          maxlength="160"
          autocomplete="off"
          required
          value="${escapeHtml(
            media.name
          )}"
          data-media-metadata-name
        >

        <small>
          Nombre utilizado dentro de la
          Biblioteca Multimedia.
        </small>
      </label>

      <label
        class="
          media-metadata-editor__field
          media-metadata-editor__field--full
        "
        for="mediaMetadataDescription"
      >
        <span>
          Descripción
        </span>

        <textarea
          id="mediaMetadataDescription"
          name="description"
          rows="5"
          maxlength="800"
          placeholder="Describe este recurso multimedia..."
          data-media-metadata-description
        >${escapeHtml(
          media.description
        )}</textarea>

        <small>
          Explica el contenido y el propósito
          de este archivo.
        </small>
      </label>

      ${
        media.type === 'image'
          ? `
            <label
              class="
                media-metadata-editor__field
                media-metadata-editor__field--full
              "
              for="mediaMetadataAlt"
            >
              <span>
                Texto alternativo
              </span>

              <textarea
                id="mediaMetadataAlt"
                name="alt"
                rows="3"
                maxlength="300"
                placeholder="Describe lo que aparece en la imagen..."
                data-media-metadata-alt
              >${escapeHtml(
                media.alt
              )}</textarea>

              <small>
                Ayuda a la accesibilidad y al
                posicionamiento SEO.
              </small>
            </label>
          `
          : `
            <input
              type="hidden"
              name="alt"
              value="${escapeHtml(
                media.alt
              )}"
            >
          `
      }

      <label
        class="media-metadata-editor__field"
        for="mediaMetadataCategory"
      >
        <span>
          Categoría
        </span>

        <input
          id="mediaMetadataCategory"
          type="text"
          name="category"
          maxlength="80"
          autocomplete="off"
          value="${escapeHtml(
            media.category
          )}"
          placeholder="Ejemplo: covers"
          data-media-metadata-category
        >

        <small>
          Agrupa archivos relacionados.
        </small>
      </label>

      <label
        class="
          media-metadata-editor__field
          media-metadata-editor__field--full
        "
        for="mediaMetadataTags"
      >
        <span>
          Etiquetas
        </span>

        <input
          id="mediaMetadataTags"
          type="text"
          name="tags"
          maxlength="500"
          autocomplete="off"
          value="${escapeHtml(
            normalizeTags(
              media.tags
            )
          )}"
          placeholder="portada, himno, fe, música"
          data-media-metadata-tags
        >

        <small>
          Separa cada etiqueta con una coma.
        </small>
      </label>

      <label
        class="media-metadata-editor__checkbox"
      >
        <input
          type="checkbox"
          name="featured"
          value="true"
          ${
            media.featured
              ? 'checked'
              : ''
          }
          data-media-metadata-featured
        >

        <span>
          <strong>
            Recurso destacado
          </strong>

          Mostrar este archivo entre los
          recursos principales.
        </span>
      </label>
    </div>
  `;
}

function renderCopyrightFields(
  media = {}
) {
  const copyright =
    normalizeCopyright(
      media.copyright
    );

  return `
    <div
      class="media-metadata-editor__fields"
    >
      <label
        class="media-metadata-editor__field"
        for="mediaMetadataAuthor"
      >
        <span>
          Autor o creador
        </span>

        <input
          id="mediaMetadataAuthor"
          type="text"
          name="copyrightAuthor"
          maxlength="160"
          autocomplete="off"
          value="${escapeHtml(
            copyright.author
          )}"
          placeholder="Cántico de Fe Music"
          data-media-metadata-author
        >
      </label>

      <label
        class="media-metadata-editor__field"
        for="mediaMetadataHolder"
      >
        <span>
          Titular de derechos
        </span>

        <input
          id="mediaMetadataHolder"
          type="text"
          name="copyrightHolder"
          maxlength="160"
          autocomplete="off"
          value="${escapeHtml(
            copyright.holder
          )}"
          placeholder="Cántico de Fe Music"
          data-media-metadata-holder
        >
      </label>

      <label
        class="media-metadata-editor__field"
        for="mediaMetadataLicense"
      >
        <span>
          Licencia
        </span>

        <input
          id="mediaMetadataLicense"
          type="text"
          name="copyrightLicense"
          maxlength="160"
          autocomplete="off"
          value="${escapeHtml(
            copyright.license
          )}"
          placeholder="Todos los derechos reservados"
          data-media-metadata-license
        >
      </label>

      <label
        class="media-metadata-editor__field"
        for="mediaMetadataYear"
      >
        <span>
          Año
        </span>

        <input
          id="mediaMetadataYear"
          type="number"
          name="copyrightYear"
          min="1900"
          max="2200"
          step="1"
          value="${escapeHtml(
            copyright.year
          )}"
          placeholder="2026"
          data-media-metadata-year
        >
      </label>

      <label
        class="
          media-metadata-editor__field
          media-metadata-editor__field--full
        "
        for="mediaMetadataSource"
      >
        <span>
          Fuente
        </span>

        <input
          id="mediaMetadataSource"
          type="text"
          name="copyrightSource"
          maxlength="500"
          autocomplete="off"
          value="${escapeHtml(
            copyright.source
          )}"
          placeholder="Origen del archivo o enlace de referencia"
          data-media-metadata-source
        >

        <small>
          Registra de dónde proviene el
          archivo cuando sea necesario.
        </small>
      </label>
    </div>
  `;
}

function renderEmptyEditor() {
  return `
    <section
      class="
        media-metadata-editor
        media-metadata-editor--empty
      "
      data-media-metadata-editor
    >
      <div
        class="media-metadata-editor__empty"
      >
        <span
          aria-hidden="true"
        >
          ⚠️
        </span>

        <h2>
          Archivo no encontrado
        </h2>

        <p>
          No fue posible abrir los metadatos
          del recurso seleccionado.
        </p>

        <button
          type="button"
          data-media-metadata-close
        >
          Cerrar
        </button>
      </div>
    </section>
  `;
}

export default function renderMediaMetadataEditor({
  media = null
} = {}) {
  if (!media) {
    return renderEmptyEditor();
  }

  const hasOverride =
    Boolean(
      media.metadataOverride
    );

  return `
    <section
      class="media-metadata-editor"
      data-media-metadata-editor
      data-media-metadata-id="${escapeHtml(
        media.id
      )}"
    >
      <header
        class="media-metadata-editor__header"
      >
        <div>
          <p
            class="admin-section__eyebrow"
          >
            EDITOR DE METADATOS
          </p>

          <h1>
            ${escapeHtml(
              media.name ||
              'Archivo sin nombre'
            )}
          </h1>

          <p>
            Edita la información descriptiva,
            organizativa y legal del recurso.
          </p>

          <div
            class="media-metadata-editor__status"
          >
            <span>
              <strong>
                Tipo:
              </strong>

              ${escapeHtml(
                getTypeLabel(
                  media.type
                )
              )}
            </span>

            <span>
              <strong>
                Estado:
              </strong>

              ${
                hasOverride
                  ? 'Metadatos modificados'
                  : 'Metadatos originales'
              }
            </span>
          </div>
        </div>

        <button
          type="button"
          class="media-metadata-editor__close"
          aria-label="Cerrar editor"
          title="Cerrar"
          data-media-metadata-close
        >
          ×
        </button>
      </header>

      <div
        class="media-metadata-editor__layout"
      >
        <aside
          class="media-metadata-editor__preview"
        >
          <header>
            <h2>
              Vista previa
            </h2>

            <p>
              Recurso original del proyecto.
            </p>
          </header>

          ${renderPreview(
            media
          )}

          <section
            class="media-metadata-editor__technical"
          >
            <h3>
              Información técnica
            </h3>

            ${renderTechnicalDetails(
              media
            )}
          </section>
        </aside>

        <form
          id="mediaMetadataEditorForm"
          class="media-metadata-editor__form"
          novalidate
          data-media-metadata-form
        >
          <input
            type="hidden"
            name="mediaId"
            value="${escapeHtml(
              media.id
            )}"
          >

          <section
            class="media-metadata-editor__panel"
          >
            <header
              class="media-metadata-editor__panel-header"
            >
              <h2>
                Información principal
              </h2>

              <p>
                Define cómo se identificará y
                encontrará este recurso.
              </p>
            </header>

            ${renderGeneralFields(
              media
            )}
          </section>

          <section
            class="media-metadata-editor__panel"
          >
            <header
              class="media-metadata-editor__panel-header"
            >
              <h2>
                Autoría y derechos
              </h2>

              <p>
                Registra información legal,
                atribuciones y procedencia.
              </p>
            </header>

            ${renderCopyrightFields(
              media
            )}
          </section>

          <footer
            class="media-metadata-editor__footer"
          >
            <div
              class="media-metadata-editor__footer-left"
            >
              <button
                type="button"
                data-media-metadata-close
              >
                Cancelar
              </button>

              <button
                type="button"
                ${
                  hasOverride
                    ? ''
                    : 'disabled'
                }
                data-media-metadata-restore
              >
                Restaurar originales
              </button>
            </div>

            <div
              class="media-metadata-editor__footer-right"
            >
              <button
                type="submit"
                class="media-metadata-editor__save"
                data-media-metadata-save
              >
                Guardar cambios
              </button>
            </div>
          </footer>
        </form>
      </div>
    </section>
  `;
}

export {
  escapeHtml,
  normalizeTags,
  normalizeCopyright,
  getTypeLabel,
  renderPreview,
  renderTechnicalDetails,
  renderGeneralFields,
  renderCopyrightFields,
  renderEmptyEditor
};
