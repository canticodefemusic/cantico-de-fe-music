/**
 * Cántico de Fe Music
 * V10.7 Modal Renderer
 */

export function renderModal({
  title = '',
  message = '',
  actions = ''
} = {}) {
  return `
    <div class="cantico-modal-backdrop">
      <div
        class="cantico-modal"
        role="dialog"
        aria-modal="true"
      >
        <header class="cantico-modal__header">
          <h2>${title}</h2>
        </header>

        <div class="cantico-modal__content">
          ${message}
        </div>

        <footer class="cantico-modal__actions">
          ${actions}
        </footer>
      </div>
    </div>
  `;
}
