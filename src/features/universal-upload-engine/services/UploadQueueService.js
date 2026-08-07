import {
  uploadState
} from '../state/uploadState.js';

import {
  UPLOAD_STATUS
} from '../constants/uploadStatus.js';

import {
  uploadEventBus
} from '../events/UploadEventBus.js';

import {
  ProgressService
} from './ProgressService.js';

export class UploadQueueService {

  constructor() {
    this.progressService =
      new ProgressService();
  }

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

    this.progressService.sync();

    uploadEventBus.emit(
      'upload:added',
      item
    );

    uploadEventBus.emit(
      'queue:changed',
      this.getAll()
    );

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

    this.progressService.sync();

    uploadEventBus.emit(
      'upload:removed',
      removedItem
    );

    uploadEventBus.emit(
      'queue:changed',
      this.getAll()
    );

    return removedItem || null;
  }

  clear() {
    uploadState.queue.length = 0;

    this.progressService.reset();

    uploadEventBus.emit(
      'queue:cleared'
    );

    uploadEventBus.emit(
      'queue:changed',
      []
    );
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

  this.progressService.sync();

  uploadEventBus.emit(
    'upload:updated',
    item
  );

  uploadEventBus.emit(
    'queue:changed',
    this.getAll()
  );

  return item;
}

updateStatus(id, status) {
  const item =
    this.update(
      id,
      { status }
    );

  if (!item) {
    return null;
  }

  if (
    status ===
    UPLOAD_STATUS.UPLOADING
  ) {
    uploadEventBus.emit(
      'upload:started',
      item
    );
  }

  if (
    status ===
    UPLOAD_STATUS.COMPLETED
  ) {
    uploadEventBus.emit(
      'upload:completed',
      item
    );
  }

  if (
    status ===
    UPLOAD_STATUS.FAILED
  ) {
    uploadEventBus.emit(
      'upload:failed',
      item
    );
  }

  if (
    status ===
    UPLOAD_STATUS.CANCELLED
  ) {
    uploadEventBus.emit(
      'upload:cancelled',
      item
    );
  }

  return item;
}

cancel(id) {
  const item =
    this.getById(id);

  if (!item) {
    return null;
  }

  item.status =
    UPLOAD_STATUS.CANCELLED;

  this.progressService.sync();

  uploadEventBus.emit(
    'upload:cancelled',
    item
  );

  uploadEventBus.emit(
    'upload:updated',
    item
  );

  uploadEventBus.emit(
    'queue:changed',
    this.getAll()
  );

  return item;
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

    const item =
      this.update(
        id,
        {
          progress:
            normalizedProgress
        }
      );

    if (!item) {
      return null;
    }

    uploadEventBus.emit(
      'upload:progress',
      {
        id: item.id,
        progress: item.progress,
        item
      }
    );

    return item;
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
