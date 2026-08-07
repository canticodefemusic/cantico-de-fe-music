import {
  uploadState
} from '../state/uploadState.js';

import {
  UPLOAD_STATUS
} from '../constants/uploadStatus.js';

export class UploadQueueService {

  getAll() {
    return [...uploadState.queue];
  }

  getById(id) {
    return (
      uploadState.queue.find(
        item => item.id === id
      ) || null
    );
  }

  add(item) {
    uploadState.queue.push(item);

    return item;
  }

  remove(id) {
    const index =
      uploadState.queue.findIndex(
        item => item.id === id
      );

    if (index === -1) {
      return null;
    }

    const [removedItem] =
      uploadState.queue.splice(
        index,
        1
      );

    return removedItem || null;
  }

  clear() {
    uploadState.queue.length = 0;
  }

  getPending() {
    return uploadState.queue.filter(
      item =>
        item.status ===
        UPLOAD_STATUS.PENDING
    );
  }

  getUploading() {
    return uploadState.queue.filter(
      item =>
        item.status ===
        UPLOAD_STATUS.UPLOADING
    );
  }

  getCompleted() {
    return uploadState.queue.filter(
      item =>
        item.status ===
        UPLOAD_STATUS.COMPLETED
    );
  }

  getFailed() {
    return uploadState.queue.filter(
      item =>
        item.status ===
        UPLOAD_STATUS.FAILED
    );
  }

  getCancelled() {
    return uploadState.queue.filter(
      item =>
        item.status ===
        UPLOAD_STATUS.CANCELLED
    );
  }

  update(id, updates = {}) {
    const item =
      this.getById(id);

    if (!item) {
      return null;
    }

    Object.assign(
      item,
      updates
    );

    return item;
  }

  updateStatus(id, status) {
    return this.update(
      id,
      { status }
    );
  }

  updateProgress(id, progress) {
    const normalizedProgress =
      Math.min(
        100,
        Math.max(
          0,
          Number(progress) || 0
        )
      );

    return this.update(
      id,
      {
        progress:
          normalizedProgress
      }
    );
  }

  count() {
    return uploadState.queue.length;
  }

  has(id) {
    return Boolean(
      this.getById(id)
    );
  }

}
