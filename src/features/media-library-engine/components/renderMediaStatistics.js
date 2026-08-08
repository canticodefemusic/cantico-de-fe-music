/**
 * Cántico de Fe Music
 * V13.6.5 — Media Statistics
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
  ).toFixed(2)} GB`;
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

function getLatestUpload(
  objects
) {
  const uploadedObjects =
    objects
      .filter(
        object =>
          object?.uploaded
      )
      .sort(
        (a, b) =>
          new Date(
            b.uploaded
          ).getTime() -
          new Date(
            a.uploaded
          ).getTime()
      );

  return (
    uploadedObjects[0] ||
    null
  );
}

function formatDateTime(
  value
) {
  if (!value) {
    return 'Sin datos';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Sin datos';
  }

  return new Intl.DateTimeFormat(
    'es-US',
    {
      dateStyle:
        'medium',

      timeStyle:
        'short'
    }
  ).format(date);
}

function calculateStatistics(
  objects = []
) {
  const statistics = {
    total: 0,

    image: 0,
    audio: 0,
    video: 0,
    document: 0,
    file: 0,

    totalSize: 0,

    latestUpload: null
  };

  const safeObjects =
    Array.isArray(
      objects
    )
      ? objects
      : [];

  statistics.total =
    safeObjects.length;

  safeObjects.forEach(
    object => {
      const type =
        getMediaType(
          object
        );

      if (
        Object.prototype
          .hasOwnProperty.call(
            statistics,
            type
          )
      ) {
        statistics[
          type
        ] += 1;
      }

      statistics.totalSize +=
        Number(
          object?.size
        ) || 0;
    }
  );

  statistics.latestUpload =
    getLatestUpload(
      safeObjects
    );

  return statistics;
}

function renderStatCard({
  icon,
  label,
  value
}) {
  return `
    <article
      class="media-statistics__card"
    >
      <span
        class="media-statistics__icon"
        aria-hidden="true"
      >
        ${icon}
      </span>

      <div>
        <strong
          class="media-statistics__value"
        >
          ${value}
        </strong>

        <span
          class="media-statistics__label"
        >
          ${label}
        </span>
      </div>
    </article>
  `;
}

export function renderMediaStatistics({
  objects = []
} = {}) {
  const stats =
    calculateStatistics(
      objects
    );

  return `
    <section
      class="media-statistics"
      aria-label="Estadísticas de la biblioteca multimedia"
    >

      <div
        class="media-statistics__header"
      >
        <div>
          <h2>
            Resumen multimedia
          </h2>

          <p>
            Estadísticas actuales de los archivos almacenados.
          </p>
        </div>

        <div
          class="media-statistics__storage"
        >
          <span>
            Espacio utilizado
          </span>

          <strong>
            ${formatFileSize(
              stats.totalSize
            )}
          </strong>
        </div>
      </div>

      <div
        class="media-statistics__grid"
      >

        ${renderStatCard({
          icon: '📦',
          label:
            'Total de archivos',
          value:
            stats.total
        })}

        ${renderStatCard({
          icon: '🖼️',
          label:
            'Imágenes',
          value:
            stats.image
        })}

        ${renderStatCard({
          icon: '🎵',
          label:
            'Audios',
          value:
            stats.audio
        })}

        ${renderStatCard({
          icon: '🎬',
          label:
            'Videos',
          value:
            stats.video
        })}

        ${renderStatCard({
          icon: '📄',
          label:
            'PDF',
          value:
            stats.document
        })}

        ${renderStatCard({
          icon: '📁',
          label:
            'Otros',
          value:
            stats.file
        })}

      </div>

      <div
        class="media-statistics__latest"
      >
        <span>
          Última subida
        </span>

        <strong>
          ${formatDateTime(
            stats
              .latestUpload
              ?.uploaded
          )}
        </strong>
      </div>

    </section>
  `;
}
