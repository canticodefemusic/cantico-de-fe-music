export function renderUploadDropZone({
  title = 'Subir archivos',
  description =
    'Arrastra tus archivos aquí o selecciónalos desde tu dispositivo',
  multiple = true
} = {}) {

  return `
    <section
      class="universal-upload-drop-zone"
      data-upload-drop-zone
    >

      <div
        class="universal-upload-drop-zone__icon"
        aria-hidden="true"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 16V4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />

          <path
            d="M7 9L12 4L17 9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <path
            d="M5 20H19"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <h3
        class="universal-upload-drop-zone__title"
      >
        ${title}
      </h3>

      <p
        class="universal-upload-drop-zone__description"
      >
        ${description}
      </p>

      <button
        type="button"
        class="universal-upload-drop-zone__button"
        data-upload-select-button
      >
        Seleccionar archivos
      </button>

      <input
        type="file"
        class="universal-upload-drop-zone__input"
        data-upload-file-input
        ${multiple ? 'multiple' : ''}
        hidden
      >

    </section>
  `;
}
