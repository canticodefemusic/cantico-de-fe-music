import {
  renderUploadPanel,
  UploadUIController
} from '../../../features/universal-upload-engine/index.js';

import {
  R2MediaLibraryController
} from '../../../features/media-library-engine/index.js';

let uploadController = null;
let mediaLibraryController = null;

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

      <section
        class="upload-view__uploader"
      >
        <div
          class="upload-view__content"
          data-upload-root
        >
          ${renderUploadPanel()}
        </div>
      </section>

      <section
        class="upload-view__library"
        aria-label="Archivos almacenados"
      >
        <div
          data-r2-media-root
        ></div>
      </section>

    </main>
  `;
}

export function initUploadView() {
  const uploadRoot =
    document.querySelector(
      '[data-upload-root]'
    );

  const mediaRoot =
    document.querySelector(
      '[data-r2-media-root]'
    );

  if (uploadController) {
    uploadController.destroy?.();
    uploadController = null;
  }

  if (mediaLibraryController) {
    mediaLibraryController.destroy?.();
    mediaLibraryController = null;
  }

  if (uploadRoot) {
    uploadController =
      new UploadUIController({
        root: uploadRoot
      });

    uploadController.init();
  }

  if (mediaRoot) {
    mediaLibraryController =
      new R2MediaLibraryController({
        root: mediaRoot
      });

    mediaLibraryController.init();
  }

  return {
    uploadController,
    mediaLibraryController
  };
}
