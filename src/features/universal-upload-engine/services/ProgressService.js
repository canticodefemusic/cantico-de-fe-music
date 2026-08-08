import {
  uploadState
} from '../state/uploadState.js';

import {
  UPLOAD_STATUS
} from '../constants/uploadStatus.js';

export class ProgressService {

  sync() {

    const queue =
      uploadState.queue;

    const uploading =
      queue.filter(item =>
        item.status ===
        UPLOAD_STATUS.UPLOADING
      );

    uploadState.activeUploads =
      uploading.length;

    uploadState.uploading =
      uploading.length > 0;

    // Si ya no hay subidas activas,
    // el progreso global vuelve a cero.
    if (!uploading.length) {

      uploadState.totalProgress = 0;

      return;
    }

    const total =
      uploading.reduce(
        (sum, item) =>
          sum +
          (item.progress || 0),
        0
      );

    uploadState.totalProgress =
      Math.round(
        total /
        uploading.length
      );
  }

  reset() {

    uploadState.totalProgress = 0;

    uploadState.activeUploads = 0;

    uploadState.uploading = false;
  }

}
