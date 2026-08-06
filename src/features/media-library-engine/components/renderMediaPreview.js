/**
 * Cántico de Fe Music
 * V12.8.10 — Media Preview
 */

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderImagePreview(
  media = {}
) {
  return `
    <figure
      class="
        media-preview__visual
        media-preview__visual--image
      "
    >
      <img
        src="${escapeHtml(
          media.path
        )}"
        alt="${escapeHtml(
          media.alt ||
          media.name ||
          'Vista previa de imagen'
        )}"
        loading="lazy"
      >

      ${
        media.description
          ? `
            <figcaption>
              ${escapeHtml(
                media.description
              )}
            </figcaption>
          `
          : ''
      }
    </figure>
  `;
}

function renderAudioPreview(
  media = {}
) {
  return `
    <div
      class="
        media-preview__visual
        media-preview__visual--audio
      "
    >
      <div
        class="media-preview__audio-icon"
        aria-hidden="true"
      >
        🎵
      </div>

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
        media-preview__visual
        media-preview__visual--video
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
        media-preview__visual
        media-preview__visual--document
      "
    >
      <div
        class="media-preview__document-icon"
        aria-hidden="true"
      >
        📄
      </div>

      <p>
        La vista previa directa no está
        disponible para este documento.
      </p>

      <a
        href="${escapeHtml(
          media.path
        )}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir documento
      </a>
    </div>
  `;
}

function renderOtherPreview(
  media = {}
) {
  return `
    <div
      class="
        media-preview__visual
        media-preview__visual--other
      "
    >
      <div
        class="media-preview__other-icon"
        aria-hidden="true"
      >
        📦
      </div>

      <p>
        No existe una vista previa
        disponible para este tipo de archivo.
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

function renderPreviewContent(
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

function renderMetadataValue(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'No disponible';
  }

  return escapeHtml(
    value
  );
}

function renderMediaMetadata(
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
      class="media-preview__metadata"
    >
      <div>
        <dt>
          Tipo
        </dt>

        <dd>
          ${renderMetadataValue(
            media.type
          )}
        </dd>
      </div>

      <div>
        <dt>
          Categoría
        </dt>

        <dd>
          ${renderMetadataValue(
            media.category
          )}
        </dd>
      </div>

      <div>
        <dt>
          Formato
        </dt>

        <dd>
          ${renderMetadataValue(
            media.extension
          )}
        </dd>
      </div>

      <div>
        <dt>
          Tipo MIME
        </dt>

        <dd>
          ${renderMetadataValue(
            media.mimeType
          )}
        </dd>
      </div>

      <div>
        <dt>
          Ruta
        </dt>

        <dd>
          <code>
            ${renderMetadataValue(
              media.path
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
                ${renderMetadataValue(
                  metadata.duration
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
          ${renderMetadataValue(
            metadata.fileSize
          )}
        </dd>
      </div>
    </dl>
  `;
}

export default function renderMediaPreview({
  media = null,
  selectable = true
} = {}) {
  if (!media) {
    return `
      <section
        class="
          media-preview
          media-preview--empty
        "
        data-media-preview-panel
      >
        <div
          class="media-preview__empty"
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
            No fue posible cargar la
            información del recurso.
          </p>

          <button
            type="button"
            data-media-preview-close
          >
            Cerrar
          </button>
        </div>
      </section>
    `;
  }

  return `
    <section
      class="media-preview"
      data-media-preview-panel
      data-media-preview-id="${escapeHtml(
        media.id
      )}"
    >
      <header
        class="media-preview__header"
      >
        <div>
          <p
            class="admin-section__eyebrow"
          >
            VISTA PREVIA
          </p>

          <h2>
            ${escapeHtml(
              media.name ||
              'Archivo sin nombre'
            )}
          </h2>

          ${
            media.description
              ? `
                <p>
                  ${escapeHtml(
                    media.description
                  )}
                </p>
              `
              : ''
          }
        </div>

        <button
          type="button"
          class="media-preview__close"
          aria-label="Cerrar vista previa"
          title="Cerrar"
          data-media-preview-close
        >
          ×
        </button>
      </header>

      <div
        class="media-preview__body"
      >
        ${renderPreviewContent(
          media
        )}

        <aside
          class="media-preview__details"
        >
          <h3>
            Información del archivo
          </h3>

          ${renderMediaMetadata(
            media
          )}

          ${
            Array.isArray(
              media.tags
            ) &&
            media.tags.length
              ? `
                <div
                  class="media-preview__tags"
                >
                  <h3>
                    Etiquetas
                  </h3>

                  <div>
                    ${media.tags
                      .map(tag => `
                        <span>
                          ${escapeHtml(
                            tag
                          )}
                        </span>
                      `)
                      .join('')}
                  </div>
                </div>
              `
              : ''
          }
        </aside>
      </div>

      <footer
        class="media-preview__footer"
      >
        <button
          type="button"
          data-media-preview-close
        >
          Cerrar
        </button>

        ${
          selectable
            ? `
              <button
                type="button"
                class="media-preview__select"
                data-media-preview-select="${escapeHtml(
                  media.id
                )}"
              >
                Seleccionar archivo
              </button>
            `
            : ''
        }
      </footer>
    </section>
  `;
}

export {
  escapeHtml,
  renderImagePreview,
  renderAudioPreview,
  renderVideoPreview,
  renderDocumentPreview,
  renderOtherPreview,
  renderPreviewContent,
  renderMediaMetadata
};
