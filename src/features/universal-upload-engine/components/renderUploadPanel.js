import {
  renderUploadDropZone
} from './renderUploadDropZone.js';

import {
  renderUploadQueue
} from './renderUploadQueue.js';

import {
  renderUploadProgress
} from './renderUploadProgress.js';

export function renderUploadPanel({
  title = 'Subir archivos',
  description =
    'Arrastra tus archivos aquí o selecciónalos desde tu dispositivo',
  multiple = true,
  items = [],
  totalProgress = 0,
  activeUploads = 0,
  uploading = false
} = {}) {

  return `
    <section
      class="universal-upload-panel"
      data-universal-upload-panel
    >

      ${renderUploadDropZone({
        title,
        description,
        multiple
      })}

      <div
        class="universal-upload-panel__progress"
        data-upload-progress-container
      >
        ${renderUploadProgress({
          totalProgress,
          activeUploads,
          uploading
        })}
      </div>

      <div
        class="universal-upload-panel__queue"
        data-upload-queue-container
      >
        ${renderUploadQueue(items)}
      </div>

    </section>
  `;
}
