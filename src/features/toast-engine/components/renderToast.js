/**
 * Cántico de Fe Music
 * V10.9 — Toast Renderer
 */

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderToast(toast = {}) {
  return `
    <article
      class="
        cantico-toast
        cantico-toast--${escapeHtml(toast.type)}
      "
      data-toast-id="${escapeHtml(toast.id)}"
    >
      ${
        toast.title
          ? `
            <h4 class="cantico-toast__title">
              ${escapeHtml(toast.title)}
            </h4>
          `
          : ''
      }

      <p class="cantico-toast__message">
        ${escapeHtml(toast.message)}
      </p>
    </article>
  `;
}

export default renderToast;
