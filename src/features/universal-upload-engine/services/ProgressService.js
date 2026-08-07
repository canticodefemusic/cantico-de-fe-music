import {
  uploadState
} from '../state/uploadState.js';

import {
  UPLOAD_STATUS
} from '../constants/uploadStatus.js';

export class ProgressService {

  calculateTotalProgress() {
    const queue =
      uploadState.queue;

    if (!queue.length) {
      uploadState.totalProgress = 0;

      return 0;
    }

    const total =
      queue.reduce(
        (sum, item) => {
          return (
            sum +
            (
              Number(item.progress) || 0
            )
          );
        },
        0
      );

    const progress =
      Math.round(
        total /
        queue.length
      );

    uploadState.totalProgress =
      progress;

    return progress;
  }

  updateActiveUploads() {
    const activeUploads =
      uploadState.queue.filter(
        item =>
          item.status ===
          UPLOAD_STATUS.UPLOADING
      ).length;

    uploadState.activeUploads =
      activeUploads;

    uploadState.uploading =
      activeUploads > 0;

    return activeUploads;
  }

  sync() {
    return {
      totalProgress:
        this.calculateTotalProgress(),

      activeUploads:
        this.updateActiveUploads(),

      uploading:
        uploadState.uploading
    };
  }

  reset() {
    uploadState.totalProgress = 0;
    uploadState.activeUploads = 0;
    uploadState.uploading = false;
  }

}
