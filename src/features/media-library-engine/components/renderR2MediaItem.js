/**
 * Cántico de Fe Music
 * V13.7.2 — Render R2 Media Item
 *
 * Funciones:
 * - Vista previa real
 * - Imagen / audio / video / PDF
 * - Selección múltiple
 * - Menú profesional de acciones
 * - Ver archivo
 * - Copiar enlace
 * - Descargar
 * - Eliminar
 */

function formatFileSize(
  bytes = 0
) {
  const size =
    Number(bytes) || 0;

  if (size < 1024) {
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
    1024 * 1024 * 1024
  ) {
    return `${(
      size /
      (1024 * 1024)
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

function getFileName(
  key = ''
) {
  const parts =
    String(
      key
    ).split('/');

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

function getMediaIcon(
  type
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
    icons[type] ||
    icons.file
  );
}

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

function escapeHtml(
  value = ''
) {
  return String(
    value
  )
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
/* Preview                                                            */
/* ------------------------------------------------------------------ */

function renderPreview({
  mediaType,
  mediaUrl,
  safeName,
  safeContentType
}) {

  if (
    mediaType ===
    'image'
  ) {
    return `
      <img
        class="media-library-item__image"
        src="${mediaUrl}"
        alt="${safeName}"
        loading="lazy"
        decoding="async"
      />
    `;
  }

  if (
    mediaType ===
    'audio'
  ) {
    return `
      <div
        class="
          media-library-item__media
          media-library-item__media--audio
        "
      >

        <span
          class="media-library-item__icon"
          aria-hidden="true"
        >
          🎵
        </span>

        <audio
          class="media-library-item__audio"
          controls
          preload="metadata"
        >
          <source
            src="${mediaUrl}"
            type="${safeContentType}"
          />

          Tu navegador no puede reproducir este audio.
        </audio>

      </div>
    `;
  }

  if (
    mediaType ===
    'video'
  ) {
    return `
      <video
        class="media-library-item__video"
        controls
        preload="metadata"
      >
        <source
          src="${mediaUrl}"
          type="${safeContentType}"
        />

        Tu navegador no puede reproducir este video.
      </video>
    `;
  }

  if (
    mediaType ===
    'document'
  ) {
    return `
      <div
        class="
          media-library-item__media
          media-library-item__media--document
        "
      >

        <span
          class="media-library-item__icon"
          aria-hidden="true"
        >
          📄
        </span>

        <span
          class="media-library-item__media-label"
        >
          PDF
        </span>

      </div>
    `;
  }

  return `
    <div
      class="
        media-library-item__media
        media-library-item__media--file
      "
    >

      <span
        class="media-library-item__icon"
        aria-hidden="true"
      >
        ${getMediaIcon(
          mediaType
        )}
      </span>

      <span
        class="media-library-item__media-label"
      >
        Archivo
      </span>

    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Menú de acciones                                                   */
/* ------------------------------------------------------------------ */

function renderActionMenu({
  safeKey,
  safeName,
  safeMediaUrl
}) {
  return `
    <details
      class="media-library-item__menu"
      data-media-menu
    >

      <summary
        class="media-library-item__menu-trigger"
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
        class="media-library-item__menu-panel"
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

export function renderR2MediaItem(
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

  const mediaType =
    getMediaType(
      object
    );

  const name =
    getOriginalName(
      object
    );

  const contentType =
    getContentType(
      object
    );

  const uploaded =
    formatDate(
      object.uploaded
    );

  const size =
    formatFileSize(
      object.size
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

  const safeContentType =
    escapeHtml(
      contentType
    );

  const safeMediaUrl =
    escapeHtml(
      mediaUrl
    );

  return `
    <article
      class="
        media-library-item
        media-library-item--${mediaType}
        ${
          selected
            ? 'is-selected'
            : ''
        }
      "
      data-media-key="${safeKey}"
      data-media-type="${mediaType}"
      data-media-selected="${
        selected
          ? 'true'
          : 'false'
      }"
    >

      <div
        class="media-library-item__topbar"
      >

        <label
          class="media-library-item__selector"
          title="Seleccionar ${safeName}"
        >
          <input
            type="checkbox"
            class="media-library-item__checkbox"
            data-media-select="${safeKey}"
            ${
              selected
                ? 'checked'
                : ''
            }
          />

          <span
            class="media-library-item__selector-box"
            aria-hidden="true"
          ></span>

          <span
            class="media-library-item__selector-label"
          >
            Seleccionar
          </span>
        </label>

        ${renderActionMenu({
          safeKey,
          safeName,
          safeMediaUrl
        })}

      </div>

      <div
        class="media-library-item__preview"
      >
        ${renderPreview({
          mediaType,

          mediaUrl:
            safeMediaUrl,

          safeName,

          safeContentType
        })}
      </div>

      <div
        class="media-library-item__content"
      >

        <h3
          class="media-library-item__name"
          title="${safeName}"
        >
          ${safeName}
        </h3>

        <div
          class="media-library-item__meta"
        >

          <span>
            ${safeContentType}
          </span>

          <span>
            ${size}
          </span>

          ${
            uploaded
              ? `
                <span>
                  ${uploaded}
                </span>
              `
              : ''
          }

        </div>

      </div>

    </article>
  `;
}
