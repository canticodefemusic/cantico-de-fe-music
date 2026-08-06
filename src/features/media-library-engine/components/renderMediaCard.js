/**
 * Cántico de Fe Music
 * V13.0.6 — Media Card with Actions Menu
 */

import renderMediaCardMenu
  from './renderMediaCardMenu.js';

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderType(type = '') {
  switch (type) {
    case 'image':
      return '🖼️';

    case 'audio':
      return '🎵';

    case 'video':
      return '🎥';

    case 'document':
      return '📄';

    default:
      return '📦';
  }
}

function getTypeLabel(type = '') {
  const labels = {
    image: 'Imagen',
    audio: 'Audio',
    video: 'Video',
    document: 'Documento',
    other: 'Otro'
  };

  return (
    labels[type] ||
    'Archivo'
  );
}

function renderImageThumbnail(
  media = {}
) {
  if (
    media.type !== 'image' ||
    !media.path
  ) {
    return '';
  }

  return `
    <div
      class="media-card__thumbnail"
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
    </div>
  `;
}

function renderDescription(
  media = {}
) {
  if (!media.description) {
    return `
      <p
        class="media-card__description media-card__description--empty"
      >
        Sin descripción.
      </p>
    `;
  }

  return `
    <p
      class="media-card__description"
    >
      ${escapeHtml(
        media.description
      )}
    </p>
  `;
}

function renderMetadataStatus(
  media = {}
) {
  if (!media.metadataOverride) {
    return '';
  }

  return `
    <span
      class="media-card__status"
      title="Este archivo tiene metadatos personalizados"
    >
      Modificado
    </span>
  `;
}

export default function renderMediaCard(
  media = {}
) {
  if (
    !media ||
    !media.id
  ) {
    return '';
  }

  return `
    <article
      class="
        media-card
        ${
          media.metadataOverride
            ? 'has-metadata-override'
            : ''
        }
      "
      data-media-id="${escapeHtml(
        media.id
      )}"
      data-media-type="${escapeHtml(
        media.type
      )}"
      data-media-category="${escapeHtml(
        media.category
      )}"
    >
      <header
        class="media-card__header"
      >
        <div
          class="media-card__heading"
        >
          <span
            class="media-card__type"
            aria-hidden="true"
          >
            ${renderType(
              media.type
            )}
          </span>

          <div
            class="media-card__title-group"
          >
            <strong>
              ${escapeHtml(
                media.name ||
                'Archivo sin nombre'
              )}
            </strong>

            ${renderMetadataStatus(
              media
            )}
          </div>
        </div>

        ${renderMediaCardMenu({
          media,
          selectable: true,
          allowMetadata: true,
          allowCopy: true,
          allowDownload: true
        })}
      </header>

      ${renderImageThumbnail(
        media
      )}

      <div
        class="media-card__body"
      >
        ${renderDescription(
          media
        )}

        <dl
          class="media-card__details"
        >
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
              Categoría
            </dt>

            <dd>
              ${escapeHtml(
                media.category ||
                'Sin categoría'
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
        </dl>
      </div>

      <footer
        class="media-card__footer"
      >
        <code
          title="${escapeHtml(
            media.path ||
            ''
          )}"
        >
          ${escapeHtml(
            media.path ||
            'Ruta no disponible'
          )}
        </code>
      </footer>
    </article>
  `;
}

export {
  escapeHtml,
  renderType,
  getTypeLabel,
  renderImageThumbnail,
  renderDescription,
  renderMetadataStatus
};
