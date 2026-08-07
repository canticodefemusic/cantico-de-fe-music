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

  remove(index) {

    return this.service.remove(index);

  }

  clear() {

    this.service.clear();

  }

  getQueue() {

    return this.service.getQueue();

  }

  getQueueSize() {

    return this.service.getQueueSize();

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
