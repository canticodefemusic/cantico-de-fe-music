import {
  validateFile
} from '../utils/uploadValidator.js';

import {
  createUploadItem
} from '../utils/createUploadItem.js';

import {
  UploadQueueService
} from './UploadQueueService.js';

export class UploadService {

  constructor() {

    this.queue =
      new UploadQueueService();

  }

  add(file) {

    if (!validateFile(file)) {

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

  updateProgress(id, progress) {

    return this.queue.updateProgress(
      id,
      progress
    );

  }

}
