function formatFileSize(bytes = 0) {
  if (!bytes) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB'
  ];

  let size = Number(bytes);
  let unitIndex = 0;

  while (
    size >= 1024 &&
    unitIndex < units.length - 1
  ) {
    size /= 1024;
    unitIndex += 1;
  }

  const decimals =
    unitIndex === 0
      ? 0
      : 1;

  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}

function getCategoryLabel(category) {
  const labels = {
    image: 'Imagen',
    audio: 'Audio',
    video: 'Video',
    document: 'Documento'
  };

  return labels[category] || 'Archivo';
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    uploading: 'Subiendo',
    completed: 'Completado',
    failed: 'Error',
    cancelled: 'Cancelado'
  };

  return labels[status] || status;
}

function renderProgress({
  id,
  status,
  progress
}) {
  if (
    status === 'cancelled'
  ) {
    return '';
  }

  const normalizedProgress =
    Math.min(
      100,
      Math.max(
        0,
        Number(progress) || 0
      )
    );

  return `
    <div
      class="universal-upload-item__progress"
    >

      <div
        class="universal-upload-item__progress-track"
      >

        <div
          class="universal-upload-item__progress-bar"
          data-upload-progress-bar="${id}"
          style="width: ${normalizedProgress}%"
        ></div>

      </div>

      <span
        class="universal-upload-item__progress-value"
        data-upload-progress-value="${id}"
      >
        ${normalizedProgress}%
      </span>

    </div>
  `;
}

function renderActions({
  id,
  status
}) {
  const canCancel =
    status === 'pending' ||
    status === 'uploading';

  return `
    <div
      class="universal-upload-item__actions"
    >

      ${
        canCancel
          ? `
            <button
              type="button"
              data-upload-cancel="${id}"
            >
              Cancelar
            </button>
          `
          : ''
      }

      <button
        type="button"
        data-upload-remove="${id}"
      >
        Eliminar
      </button>

    </div>
  `;
}

export function renderUploadItem(item) {
  if (!item) {
    return '';
  }

  const {
    id,
    name,
    category,
    size,
    status = 'pending',
    progress = 0
  } = item;

  return `
    <article
      class="
        universal-upload-item
        universal-upload-item--${status}
      "
      data-upload-item="${id}"
      data-upload-item-status="${status}"
    >

      <div
        class="universal-upload-item__info"
      >

        <div
          class="universal-upload-item__name"
        >
          ${name}
        </div>

        <div
          class="universal-upload-item__meta"
        >
          ${getCategoryLabel(category)}
          ·
          ${formatFileSize(size)}
        </div>

      </div>

      <div
        class="
          universal-upload-item__status
          universal-upload-item__status--${status}
        "
        data-upload-status="${id}"
      >
        ${getStatusLabel(status)}
      </div>

      ${renderProgress({
        id,
        status,
        progress
      })}

      ${renderActions({
        id,
        status
      })}

    </article>
  `;
}
