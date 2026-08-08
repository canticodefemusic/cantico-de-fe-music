import {
  renderUploadPanel,
  UploadUIController
} from '../../../features/universal-upload-engine/index.js';

import {
  R2MediaLibraryController
} from '../../../features/media-library-engine/index.js';

let uploadController = null;
let mediaLibraryController = null;
let unsubscribeUploadCompleted = null;

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

function cleanupControllers() {
  if (
    typeof unsubscribeUploadCompleted ===
    'function'
  ) {
    unsubscribeUploadCompleted();

    unsubscribeUploadCompleted = null;
  }

  if (uploadController) {
    uploadController.destroy?.();

    uploadController = null;
  }

  if (mediaLibraryController) {
    mediaLibraryController.destroy?.();

    mediaLibraryController = null;
  }
}

function connectUploadRefresh() {
  if (
    !uploadController?.engine ||
    !mediaLibraryController
  ) {
    return;
  }

  unsubscribeUploadCompleted =
    uploadController.engine.on(
      'upload:completed',
      async () => {
        try {
          await mediaLibraryController.refresh();
        } catch (error) {
          console.error(
            '[UploadView] Unable to refresh media library:',
            error
          );
        }
      }
    );
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

  cleanupControllers();

  if (uploadRoot) {
    uploadController =
      new UploadUIController({
        root:
          uploadRoot
      });

    uploadController.init();
  }

  if (mediaRoot) {
    mediaLibraryController =
      new R2MediaLibraryController({
        root:
          mediaRoot
      });

    mediaLibraryController.init();
  }

  connectUploadRefresh();

  return {
    uploadController,
    mediaLibraryController
  };
}
