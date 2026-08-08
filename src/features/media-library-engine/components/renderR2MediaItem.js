/**
 * Cántico de Fe Music
 * V13.3.1 — Render R2 Media Item
 */

function formatFileSize(bytes = 0) {
  const size =
    Number(bytes) || 0;

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
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
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
}

function formatDate(
  value
) {
  if (!value) {
    return '';
  }

  const date =
    new Date(value);

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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  ).format(date);
}

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
    image: '🖼️',
    audio: '🎵',
    video: '🎬',
    document: '📄',
    file: '📦'
  };

  return (
    icons[type] ||
    icons.file
  );
}

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

export function renderR2MediaItem(
  object
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

  return `
    <article
      class="
        media-library-item
        media-library-item--${mediaType}
      "
      data-media-key="${safeKey}"
      data-media-type="${mediaType}"
    >

      <div
        class="media-library-item__preview"
      >
        <span
          class="media-library-item__icon"
          aria-hidden="true"
        >
          ${getMediaIcon(
            mediaType
          )}
        </span>
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

        <div
          class="media-library-item__actions"
        >

          <button
            type="button"
            data-media-preview="${safeKey}"
          >
            Ver
          </button>

          <button
            type="button"
            data-media-copy="${safeKey}"
          >
            Copiar enlace
          </button>

          <button
            type="button"
            data-media-delete="${safeKey}"
          >
            Eliminar
          </button>

        </div>

      </div>

    </article>
  `;
}
