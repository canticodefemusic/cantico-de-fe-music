import {
  renderUploadItem
} from './renderUploadItem.js';

export function renderUploadQueue(items = []) {

  if (!Array.isArray(items)) {
    return '';
  }

  if (!items.length) {
    return `
      <section
        class="universal-upload-queue universal-upload-queue--empty"
        data-upload-queue
      >
        <p>
          No hay archivos en la cola.
        </p>
      </section>
    `;
  }

  const content =
    items
      .map(item =>
        renderUploadItem(item)
      )
      .join('');

  return `
    <section
      class="universal-upload-queue"
      data-upload-queue
    >
      ${content}
    </section>
  `;
}
