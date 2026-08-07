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
    unitIndex === 0 ? 0 : 1;

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

export function renderUploadItem(item) {
  if (!item) {
    return '';
  }

  const {
    id,
    name,
    category,
    size,
    status,
    progress
  } = item;

  return `
    <article
      class="universal-upload-item"
      data-upload-item="${id}"
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
        class="universal-upload-item__status"
        data-upload-status="${id}"
      >
        ${status}
      </div>

      <div
        class="universal-upload-item__progress"
      >

        <div
          class="universal-upload-item__progress-track"
        >

          <div
            class="universal-upload-item__progress-bar"
            data-upload-progress-bar="${id}"
            style="width: ${progress || 0}%"
          ></div>

        </div>

        <span
          class="universal-upload-item__progress-value"
          data-upload-progress-value="${id}"
        >
          ${progress || 0}%
        </span>

      </div>

      <div
        class="universal-upload-item__actions"
      >

        <button
          type="button"
          data-upload-cancel="${id}"
        >
          Cancelar
        </button>

        <button
          type="button"
          data-upload-remove="${id}"
        >
          Eliminar
        </button>

      </div>

    </article>
  `;
}
