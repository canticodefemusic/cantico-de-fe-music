export class DragDropService {
  constructor({
    dropZone,
    onFiles = null,
    onDragEnter = null,
    onDragLeave = null
  } = {}) {
    this.dropZone = dropZone;

    this.onFiles = onFiles;
    this.onDragEnter = onDragEnter;
    this.onDragLeave = onDragLeave;

    this.dragDepth = 0;

    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  init() {
    if (!this.dropZone) return;

    this.dropZone.addEventListener(
      'dragenter',
      this.handleDragEnter
    );

    this.dropZone.addEventListener(
      'dragover',
      this.handleDragOver
    );

    this.dropZone.addEventListener(
      'dragleave',
      this.handleDragLeave
    );

    this.dropZone.addEventListener(
      'drop',
      this.handleDrop
    );
  }

  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dragDepth++;

    if (this.dragDepth === 1) {
      this.onDragEnter?.();
    }
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dragDepth--;

    if (this.dragDepth <= 0) {
      this.dragDepth = 0;
      this.onDragLeave?.();
    }
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dragDepth = 0;

    this.onDragLeave?.();

    const files = Array.from(
      event.dataTransfer?.files || []
    );

    if (!files.length) return;

    this.onFiles?.(files);
  }

  destroy() {
    if (!this.dropZone) return;

    this.dropZone.removeEventListener(
      'dragenter',
      this.handleDragEnter
    );

    this.dropZone.removeEventListener(
      'dragover',
      this.handleDragOver
    );

    this.dropZone.removeEventListener(
      'dragleave',
      this.handleDragLeave
    );

    this.dropZone.removeEventListener(
      'drop',
      this.handleDrop
    );

    this.dragDepth = 0;
  }
}
