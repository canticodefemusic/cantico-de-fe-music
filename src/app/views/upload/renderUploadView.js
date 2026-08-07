import {
  renderUploadPanel,
  UploadUIController
} from '../../../features/universal-upload-engine/index.js';

export function renderUploadView() {
  return `
    <main
      class="upload-view"
      data-upload-view
    >

      <header
        class="upload-view__header"
      >
        <h1>
          Biblioteca multimedia
        </h1>

        <p>
          Sube imágenes, audio, video y documentos.
        </p>
      </header>

      <div
        class="upload-view__content"
        data-upload-root
      >
        ${renderUploadPanel()}
      </div>

    </main>
  `;
}

export function initUploadView() {
  const root =
    document.querySelector(
      '[data-upload-root]'
    );

  if (!root) {
    return null;
  }

  const controller =
    new UploadUIController({
      root
    });

  controller.init();

  return controller;
}
