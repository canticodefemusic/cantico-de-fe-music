import {
  UPLOAD_STATUS
} from '../constants/uploadStatus.js';

export class UploadTransportService {
  constructor({
    onProgress = null
  } = {}) {
    this.onProgress = onProgress;
    this.controllers = new Map();
  }

  async upload(item) {
    if (!item?.id || !item?.file) {
      throw new Error(
        'Invalid upload item'
      );
    }

    const controller =
      new AbortController();

    this.controllers.set(
      item.id,
      controller
    );

    try {
      return await this.simulateUpload(
        item,
        controller.signal
      );
    } finally {
      this.controllers.delete(
        item.id
      );
    }
  }

  async simulateUpload(
    item,
    signal
  ) {
    let progress =
      Number(item.progress) || 0;

    while (progress < 100) {
      if (signal.aborted) {
        const error =
          new Error(
            'Upload cancelled'
          );

        error.name =
          'AbortError';

        throw error;
      }

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            150
          )
      );

      progress =
        Math.min(
          100,
          progress + 10
        );

      this.onProgress?.(
        item.id,
        progress
      );
    }

    return {
      id: item.id,
      status:
        UPLOAD_STATUS.COMPLETED,
      uploadedAt:
        new Date().toISOString()
    };
  }

  cancel(id) {
    const controller =
      this.controllers.get(id);

    if (!controller) {
      return false;
    }

    controller.abort();

    this.controllers.delete(id);

    return true;
  }

  cancelAll() {
    this.controllers.forEach(
      controller => {
        controller.abort();
      }
    );

    this.controllers.clear();
  }
}
