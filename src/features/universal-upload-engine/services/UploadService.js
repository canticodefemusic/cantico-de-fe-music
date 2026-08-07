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
  uploadEventBus
} from '../events/UploadEventBus.js';

export class UploadService {

  constructor() {
    this.queue =
      new UploadQueueService();
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

  remove(id) {
    return this.queue.remove(id);
  }

  clear() {
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
