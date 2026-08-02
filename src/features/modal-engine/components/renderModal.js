export function renderModal(modal) {
  if (!modal) {
    return '';
  }

  return `
    <div
      class="cantico-modal-overlay"
      data-modal-overlay
    >
      <div
        class="cantico-modal ${modal.destructive ? 'cantico-modal--danger' : ''}"
        role="dialog"
        aria-modal="true"
      >
        <header class="cantico-modal__header">
          <h2>
            ${modal.title || ''}
          </h2>
        </header>

        <div class="cantico-modal__body">
          ${
            modal.message
              ? `<p>${modal.message}</p>`
              : ''
          }

          ${
            modal.type === 'prompt'
              ? `
                <input
                  id="canticoModalInput"
                  type="text"
                  value="${modal.value || ''}"
                  placeholder="${modal.placeholder || ''}"
                >
              `
              : ''
          }
        </div>

        <footer class="cantico-modal__footer">
          <button
            type="button"
            data-modal-cancel
          >
            ${modal.cancelText}
          </button>

          <button
            type="button"
            data-modal-confirm
          >
            ${modal.confirmText}
          </button>
        </footer>
      </div>
    </div>
  `;
}
