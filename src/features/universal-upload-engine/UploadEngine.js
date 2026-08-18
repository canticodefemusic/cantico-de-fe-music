import {
  UploadService
} from './services/UploadService.js';

import {
  DragDropService
} from './services/DragDropService.js';

export class UploadEngine {

  constructor() {
    this.service =
      new UploadService();

    this.dragDropService = null;
  }

  add(file) {
    return this.service.add(file);
  }

  addMany(files) {
    return this.service.addMany(files);
  }

  start(id) {
    return this.service.start(id);
  }

  startAll() {
    return this.service.startAll();
  }

  remove(id) {
    return this.service.remove(id);
  }

  cancel(id) {
    return this.service.cancel(id);
  }

  clear() {
    this.service.clear();
  }

  getQueue() {
    return this.service.getQueue();
  }

  getById(id) {
    return this.service.getById(id);
  }

  getPending() {
    return this.service.getPending();
  }

  getUploading() {
    return this.service.getUploading();
  }

  getCompleted() {
    return this.service.getCompleted();
  }

  getFailed() {
    return this.service.getFailed();
  }

  getCancelled() {
    return this.service.getCancelled();
  }

  getQueueSize() {
    return this.service.getQueueSize();
  }

  updateStatus(id, status) {
    return this.service.updateStatus(
      id,
      status
    );
  }

  updateProgress(id, progress) {
    return this.service.updateProgress(
      id,
      progress
    );
  }

  on(eventName, callback) {
    return this.service.on(
      eventName,
      callback
    );
  }

  once(eventName, callback) {
    return this.service.once(
      eventName,
      callback
    );
  }

  off(eventName, callback) {
    return this.service.off(
      eventName,
      callback
    );
  }

  enableDragDrop({
    dropZone,
    onFiles = null,
    onDragEnter = null,
    onDragLeave = null
  } = {}) {

    this.disableDragDrop();

    this.dragDropService =
      new DragDropService({
        dropZone,

        onFiles: files => {
          const result =
            this.addMany(files);

          onFiles?.(
            files,
            result
          );
        },

        onDragEnter,

        onDragLeave
      });

    this.dragDropService.init();

    return this.dragDropService;
  }

  disableDragDrop() {
    if (!this.dragDropService) {
      return;
    }

    this.dragDropService.destroy();

    this.dragDropService = null;
  }

  destroy() {
    this.disableDragDrop();
  }

}
