/**
 * Cántico de Fe Music
 * V13.8.3 — R2 Media List Row
 *
 * Funciones:
 * - Fila compacta para vista Lista
 * - Miniatura / icono
 * - Nombre original
 * - Tipo
 * - Tamaño
 * - Fecha
 * - Selección múltiple
 * - Menú ⋮
 * - Ver
 * - Copiar enlace
 * - Descargar
 * - Eliminar
 * - Compatible con Lightbox
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
/* Archivo                                                            */
/* ------------------------------------------------------------------ */

function getFileName(
  key = ''
) {
  const parts =
    String(key)
      .split('/');

  return (
    parts[
      parts.length - 1
    ] || ''
  );
}

function getOriginalName(
  object
) {
  return (
    object
      ?.customMetadata
      ?.originalName ||
    getFileName(
      object?.key
    )
  );
}

/* ------------------------------------------------------------------ */
/* Content Type                                                       */
/* ------------------------------------------------------------------ */

function getContentType(
  object
) {
  return (
    object
      ?.httpMetadata
      ?.contentType ||
    'application/octet-stream'
  );
}

function getMediaType(
  object
) {
  const contentType =
    getContentType(
      object
    );

  if (
    contentType.startsWith(
      'image/'
    )
  ) {
    return 'image';
  }

  if (
    contentType.startsWith(
      'audio/'
    )
  ) {
    return 'audio';
  }

  if (
    contentType.startsWith(
      'video/'
    )
  ) {
    return 'video';
  }

  if (
    contentType ===
    'application/pdf'
  ) {
    return 'document';
  }

  return 'file';
}

/* ------------------------------------------------------------------ */
/* Etiquetas                                                          */
/* ------------------------------------------------------------------ */

function getTypeLabel(
  mediaType
) {
  const labels = {
    image:
      'Imagen',

    audio:
      'Audio',

    video:
      'Video',

    document:
      'PDF',

    file:
      'Otros'
  };

  return (
    labels[
      mediaType
    ] ||
    labels.file
  );
}

function getMediaIcon(
  mediaType
) {
  const icons = {
    image:
      '🖼️',

    audio:
      '🎵',

    video:
      '🎬',

    document:
      '📄',

    file:
      '📦'
  };

  return (
    icons[
      mediaType
    ] ||
    icons.file
  );
}

/* ------------------------------------------------------------------ */
/* Tamaño                                                             */
/* ------------------------------------------------------------------ */

function formatFileSize(
  bytes = 0
) {
  const size =
    Number(bytes) || 0;

  if (
    size < 1024
  ) {
    return `${size} B`;
  }

  if (
    size <
    1024 * 1024
  ) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`;
  }

  if (
    size <
    1024 *
    1024 *
    1024
  ) {
    return `${(
      size /
      (
        1024 *
        1024
      )
    ).toFixed(1)} MB`;
  }

  return `${(
    size /
    (
      1024 *
      1024 *
      1024
    )
  ).toFixed(1)} GB`;
}

/* ------------------------------------------------------------------ */
/* Fecha                                                              */
/* ------------------------------------------------------------------ */

function formatDate(
  value
) {
  if (!value) {
    return '';
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
    return '';
  }

  return new Intl.DateTimeFormat(
    'es-US',
    {
      year:
        'numeric',

      month:
        'short',

      day:
        'numeric'
    }
  ).format(
    date
  );
}

/* ------------------------------------------------------------------ */
/* URL                                                                */
/* ------------------------------------------------------------------ */

function getMediaUrl(
  object
) {
  if (
    !object?.key
  ) {
    return '';
  }

  return (
    '/api/media/file?key=' +
    encodeURIComponent(
      object.key
    )
  );
}

/* ------------------------------------------------------------------ */
/* Miniatura                                                          */
/* ------------------------------------------------------------------ */

function renderThumbnail({
  mediaType,
  mediaUrl,
  safeName
}) {

  if (
    mediaType ===
    'image'
  ) {
    return `
      <img
        class="media-list-row__thumbnail-image"
        src="${mediaUrl}"
        alt=""
        loading="lazy"
        decoding="async"
      >
    `;
  }

  return `
    <span
      class="
        media-list-row__file-icon
        media-list-row__file-icon--${mediaType}
      "
      aria-hidden="true"
    >
      ${getMediaIcon(
        mediaType
      )}
    </span>
  `;
}

/* ------------------------------------------------------------------ */
/* Menú                                                               */
/* ------------------------------------------------------------------ */

function renderActionMenu({
  safeKey,
  safeName,
  safeMediaUrl
}) {
  return `
    <details
      class="
        media-library-item__menu
        media-list-row__menu
      "
      data-media-menu
    >

      <summary
        class="
          media-library-item__menu-trigger
          media-list-row__menu-trigger
        "
        aria-label="Acciones para ${safeName}"
        title="Más acciones"
      >
        <span
          aria-hidden="true"
        >
          ⋮
        </span>
      </summary>

      <div
        class="
          media-library-item__menu-panel
          media-list-row__menu-panel
        "
      >

        <a
          href="${safeMediaUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="media-library-item__menu-action"
          data-media-preview="${safeKey}"
        >
          <span
            aria-hidden="true"
          >
            👁
          </span>

          <span>
            Ver
          </span>
        </a>

        <button
          type="button"
          class="media-library-item__menu-action"
          data-media-copy="${safeKey}"
          data-media-url="${safeMediaUrl}"
        >
          <span
            aria-hidden="true"
          >
            🔗
          </span>

          <span>
            Copiar enlace
          </span>
        </button>

        <a
          href="${safeMediaUrl}"
          download="${safeName}"
          class="media-library-item__menu-action"
          data-media-download="${safeKey}"
        >
          <span
            aria-hidden="true"
          >
            ↓
          </span>

          <span>
            Descargar
          </span>
        </a>

        <div
          class="media-library-item__menu-separator"
          aria-hidden="true"
        ></div>

        <button
          type="button"
          class="
            media-library-item__menu-action
            media-library-item__menu-action--danger
          "
          data-media-delete="${safeKey}"
        >
          <span
            aria-hidden="true"
          >
            🗑
          </span>

          <span>
            Eliminar
          </span>
        </button>

      </div>

    </details>
  `;
}

/* ------------------------------------------------------------------ */
/* Render principal                                                   */
/* ------------------------------------------------------------------ */

export function renderR2MediaListRow(
  object,
  {
    selected = false
  } = {}
) {
  if (
    !object ||
    !object.key
  ) {
    return '';
  }

  const name =
    getOriginalName(
      object
    );

  const mediaType =
    getMediaType(
      object
    );

  const typeLabel =
    getTypeLabel(
      mediaType
    );

  const size =
    formatFileSize(
      object.size
    );

  const uploaded =
    formatDate(
      object.uploaded
    );

  const mediaUrl =
    getMediaUrl(
      object
    );

  const safeKey =
    escapeHtml(
      object.key
    );

  const safeName =
    escapeHtml(
      name
    );

  const safeTypeLabel =
    escapeHtml(
      typeLabel
    );

  const safeSize =
    escapeHtml(
      size
    );

  const safeUploaded =
    escapeHtml(
      uploaded
    );

  const safeMediaUrl =
    escapeHtml(
      mediaUrl
    );

  return `
    <div
      class="
        media-list-row
        media-list-row--${mediaType}
        ${
          selected
            ? 'is-selected'
            : ''
        }
      "
      role="row"
      data-media-key="${safeKey}"
      data-media-type="${mediaType}"
      data-media-selected="${
        selected
          ? 'true'
          : 'false'
      }"
    >

      <div
        class="
          media-list-row__cell
          media-list-row__cell--select
        "
        role="cell"
      >
        <label
          class="media-list-row__selector"
          title="Seleccionar ${safeName}"
        >
          <input
            type="checkbox"
            class="media-list-row__checkbox"
            data-media-select="${safeKey}"
            ${
              selected
                ? 'checked'
                : ''
            }
          >

          <span
            class="media-list-row__selector-label"
          >
            Seleccionar ${safeName}
          </span>
        </label>
      </div>

      <div
        class="
          media-list-row__cell
          media-list-row__cell--name
        "
        role="cell"
      >

        <div
          class="media-list-row__thumbnail"
        >
          ${renderThumbnail({
            mediaType,

            mediaUrl:
              safeMediaUrl,

            safeName
          })}
        </div>

        <span
          class="media-list-row__name"
          title="${safeName}"
        >
          ${safeName}
        </span>

      </div>

      <div
        class="
          media-list-row__cell
          media-list-row__cell--type
        "
        role="cell"
      >
        <span
          class="
            media-list-row__type
            media-list-row__type--${mediaType}
          "
        >
          ${safeTypeLabel}
        </span>
      </div>

      <div
        class="
          media-list-row__cell
          media-list-row__cell--size
        "
        role="cell"
      >
        ${safeSize}
      </div>

      <div
        class="
          media-list-row__cell
          media-list-row__cell--date
        "
        role="cell"
      >
        ${safeUploaded}
      </div>

      <div
        class="
          media-list-row__cell
          media-list-row__cell--actions
        "
        role="cell"
      >
        ${renderActionMenu({
          safeKey,
          safeName,
          safeMediaUrl
        })}
      </div>

    </div>
  `;
}

export default
  renderR2MediaListRow;
