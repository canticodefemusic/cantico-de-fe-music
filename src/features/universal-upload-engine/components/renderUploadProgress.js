export function renderUploadProgress({
  totalProgress = 0,
  activeUploads = 0,
  uploading = false
} = {}) {

  const progress =
    Math.min(
      100,
      Math.max(
        0,
        Number(totalProgress) || 0
      )
    );

  return `
    <section
      class="universal-upload-progress"
      data-upload-total-progress
    >

      <div
        class="universal-upload-progress__header"
      >

        <span
          class="universal-upload-progress__label"
        >
          Progreso total
        </span>

        <span
          class="universal-upload-progress__value"
          data-upload-total-progress-value
        >
          ${progress}%
        </span>

      </div>

      <div
        class="universal-upload-progress__track"
      >
        <div
          class="universal-upload-progress__bar"
          data-upload-total-progress-bar
          style="width: ${progress}%"
        ></div>
      </div>

      <div
        class="universal-upload-progress__meta"
      >
        ${
          uploading
            ? `${activeUploads} carga${activeUploads === 1 ? '' : 's'} activa${activeUploads === 1 ? '' : 's'}`
            : 'Sin cargas activas'
        }
      </div>

    </section>
  `;
}
