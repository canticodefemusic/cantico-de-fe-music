import {
  validateFile
} from '../utils/uploadValidator.js';

import {
  createUploadItem
} from '../utils/createUploadItem.js';

import {
  UploadQueueService
} from './UploadQueueService.js';

import {
  UploadTransportService
} from './UploadTransportService.js';

import {
  uploadEventBus
} from '../events/UploadEventBus.js';

import {
  UPLOAD_STATUS
} from '../constants/uploadStatus.js';

export class UploadService {

  constructor() {
    this.queue =
      new UploadQueueService();

    this.transport =
      new UploadTransportService({
        onProgress: (
          id,
          progress
        ) => {
          this.queue.updateProgress(
            id,
            progress
          );
        }
      });
  }

  add(file) {
    if (!validateFile(file)) {
      uploadEventBus.emit(
        'upload:rejected',
        file
      );

      return {
        success: false,
        file,
        item: null
      };
    }

    const item =
      createUploadItem(file);

    this.queue.add(item);

    return {
      success: true,
      file,
      item
    };
  }

  addMany(files = []) {
    const addedItems = [];
    const rejectedFiles = [];

    files.forEach(file => {
      const result =
        this.add(file);

      if (result.success) {
        addedItems.push(
          result.item
        );
      } else {
        rejectedFiles.push(
          file
        );
      }
    });

    return {
      addedItems,
      rejectedFiles
    };
  }

  async start(id) {
    const item =
      this.queue.getById(id);

    if (!item) {
      return null;
    }

    if (
      item.status ===
      UPLOAD_STATUS.CANCELLED
    ) {
      return null;
    }

    if (
      item.status ===
      UPLOAD_STATUS.UPLOADING
    ) {
      return null;
    }

    this.queue.updateStatus(
      id,
      UPLOAD_STATUS.UPLOADING
    );

    this.queue.update(
      id,
      {
        startedAt:
          new Date().toISOString(),

        completedAt: null,

        error: null,

        remote: null
      }
    );

    try {
      const result =
        await this.transport.upload(
          item
        );

      const remoteObject =
        result?.object || null;

      this.queue.updateProgress(
        id,
        100
      );

      const completedItem =
        this.queue.update(
          id,
          {
            status:
              UPLOAD_STATUS.COMPLETED,

            completedAt:
              new Date().toISOString(),

            error: null,

            remote:
              remoteObject,

            remoteKey:
              remoteObject?.key || null,

            remoteName:
              remoteObject?.name || null,

            remoteType:
              remoteObject?.type || null,

            remoteSize:
              remoteObject?.size || null,

            uploadedAt:
              remoteObject?.uploadedAt ||
              new Date().toISOString()
          }
        );

      uploadEventBus.emit(
        'upload:completed',
        completedItem
      );

      return {
        success: true,
        item: completedItem,
        response: result
      };

    } catch (error) {

      if (
        error?.name ===
        'AbortError'
      ) {
        this.queue.cancel(id);

        return {
          success: false,
          cancelled: true,
          item:
            this.queue.getById(id)
        };
      }

      const failedItem =
        this.queue.update(
          id,
          {
            status:
              UPLOAD_STATUS.FAILED,

            error:
              error?.message ||
              'Upload failed',

            completedAt: null
          }
        );

      uploadEventBus.emit(
        'upload:failed',
        failedItem
      );

      return {
        success: false,
        cancelled: false,
        error,
        item: failedItem
      };
    }
  }

  async startAll() {
    const pending =
      this.queue.getPending();

    if (!pending.length) {
      return [];
    }

    return Promise.all(
      pending.map(
        item =>
          this.start(item.id)
      )
    );
  }

  remove(id) {
    this.transport.cancel(id);

    return this.queue.remove(id);
  }

  clear() {
    this.transport.cancelAll();

    this.queue.clear();
  }

  getQueue() {
    return this.queue.getAll();
  }

  getById(id) {
    return this.queue.getById(id);
  }

  getPending() {
    return this.queue.getPending();
  }

  getUploading() {
    return this.queue.getUploading();
  }

  getCompleted() {
    return this.queue.getCompleted();
  }

  getFailed() {
    return this.queue.getFailed();
  }

  getCancelled() {
    return this.queue.getCancelled();
  }

  getQueueSize() {
    return this.queue.count();
  }

  updateStatus(id, status) {
    return this.queue.updateStatus(
      id,
      status
    );
  }

  cancel(id) {
    this.transport.cancel(id);

    return this.queue.cancel(id);
  }

  updateProgress(id, progress) {
    return this.queue.updateProgress(
      id,
      progress
    );
  }

  on(eventName, callback) {
    return uploadEventBus.on(
      eventName,
      callback
    );
  }

  once(eventName, callback) {
    return uploadEventBus.once(
      eventName,
      callback
    );
  }

  off(eventName, callback) {
    return uploadEventBus.off(
      eventName,
      callback
    );
  }

}
