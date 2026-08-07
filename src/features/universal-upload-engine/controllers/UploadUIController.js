import {
  UploadEngine
} from '../UploadEngine.js';

import {
  uploadState
} from '../state/uploadState.js';

import {
  renderUploadQueue
} from '../components/renderUploadQueue.js';

import {
  renderUploadProgress
} from '../components/renderUploadProgress.js';

export class UploadUIController {
  constructor({
    root,
    engine = null
  } = {}) {
    this.root = root;

    this.engine =
      engine || new UploadEngine();

    this.dropZone = null;
    this.fileInput = null;
    this.selectButton = null;
    this.queueContainer = null;
    this.progressContainer = null;

    this.unsubscribe = [];

    this.handleFileInput =
      this.handleFileInput.bind(this);
  }

  init() {
    if (!this.root) {
      return false;
    }

    this.dropZone =
      this.root.querySelector(
        '[data-upload-drop-zone]'
      );

    this.fileInput =
      this.root.querySelector(
        '[data-upload-file-input]'
      );

    this.selectButton =
      this.root.querySelector(
        '[data-upload-select-button]'
      );

    this.queueContainer =
      this.root.querySelector(
        '[data-upload-queue-container]'
      );

    this.progressContainer =
      this.root.querySelector(
        '[data-upload-progress-container]'
      );

    this.bindFileSelector();

    this.bindDragDrop();

    this.bindEvents();

    this.render();

    return true;
  }

  bindFileSelector() {
    if (
      !this.fileInput ||
      !this.selectButton
    ) {
      return;
    }

    this.selectButton.addEventListener(
      'click',
      () => {
        this.fileInput.click();
      }
    );

    this.fileInput.addEventListener(
      'change',
      this.handleFileInput
    );
  }

  handleFileInput(event) {
    const files =
      Array.from(
        event.target?.files || []
      );

    if (!files.length) {
      return;
    }

    this.engine.addMany(files);

    this.fileInput.value = '';
  }

  bindDragDrop() {
    if (!this.dropZone) {
      return;
    }

    this.engine.enableDragDrop({
      dropZone: this.dropZone,

      onDragEnter: () => {
        this.dropZone.classList.add(
          'is-dragging'
        );
      },

      onDragLeave: () => {
        this.dropZone.classList.remove(
          'is-dragging'
        );
      }
    });
  }

  bindEvents() {
    const events = [
      'upload:added',
      'upload:removed',
      'upload:updated',
      'upload:progress',
      'upload:started',
      'upload:completed',
      'upload:failed',
      'upload:cancelled',
      'queue:changed',
      'queue:cleared'
    ];

    events.forEach(eventName => {
      const unsubscribe =
        this.engine.on(
          eventName,
          () => {
            this.render();
          }
        );

      this.unsubscribe.push(
        unsubscribe
      );
    });
  }

  render() {
    if (this.queueContainer) {
      this.queueContainer.innerHTML =
        renderUploadQueue(
          this.engine.getQueue()
        );
    }

    if (this.progressContainer) {
      this.progressContainer.innerHTML =
        renderUploadProgress({
          totalProgress:
            uploadState.totalProgress,

          activeUploads:
            uploadState.activeUploads,

          uploading:
            uploadState.uploading
        });
    }
  }

  destroy() {
    if (this.fileInput) {
      this.fileInput.removeEventListener(
        'change',
        this.handleFileInput
      );
    }

    this.unsubscribe.forEach(
      unsubscribe => {
        unsubscribe?.();
      }
    );

    this.unsubscribe = [];

    this.engine.disableDragDrop();

    this.dropZone = null;
    this.fileInput = null;
    this.selectButton = null;
    this.queueContainer = null;
    this.progressContainer = null;
  }
}
