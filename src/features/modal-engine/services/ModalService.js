/**
 * Cántico de Fe Music
 * V10.7.1 — Modal Service
 */

import {
  renderModal
} from '../components/renderModal.js';

let previousBodyOverflow = '';
let keydownHandler = null;
let dismissHandler = null;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

class ModalService {
  static open(
    options = {},
    {
      onDismiss = null
    } = {}
  ) {
    this.close(false);

    previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    dismissHandler =
      typeof onDismiss === 'function'
        ? onDismiss
        : null;

    document.body.insertAdjacentHTML(
      'beforeend',
      renderModal(options)
    );

    const backdrop =
      document.querySelector(
        '.cantico-modal-backdrop'
      );

    const modal =
      backdrop?.querySelector(
        '.cantico-modal'
      );

    if (!backdrop || !modal) {
      this.close(false);
      return null;
    }

    keydownHandler = event => {
  if (event.key === 'Escape') {
    this.close();
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements =
    Array.from(
      modal.querySelectorAll(
        `
          a[href],
          button:not([disabled]),
          input:not([disabled]),
          select:not([disabled]),
          textarea:not([disabled]),
          [tabindex]:not([tabindex="-1"])
        `
      )
    )
      .filter(element =>
        !element.hasAttribute('hidden') &&
        element.getAttribute('aria-hidden') !== 'true' &&
        element.offsetParent !== null
      );

  if (!focusableElements.length) {
    event.preventDefault();
    modal.focus?.();
    return;
  }

  const firstElement =
    focusableElements[0];

  const lastElement =
    focusableElements[
      focusableElements.length - 1
    ];

  const activeElement =
    document.activeElement;

  if (event.shiftKey) {
    if (
      activeElement === firstElement ||
      !modal.contains(activeElement)
    ) {
      event.preventDefault();
      lastElement.focus();
    }

    return;
  }

  if (
    activeElement === lastElement ||
    !modal.contains(activeElement)
  ) {
    event.preventDefault();
    firstElement.focus();
  }
};

    document.addEventListener(
      'keydown',
      keydownHandler
    );

    backdrop.addEventListener(
      'click',
      event => {
        if (event.target === backdrop) {
          this.close();
        }
      }
    );

    modal.addEventListener(
      'click',
      event => {
        event.stopPropagation();
      }
    );

    return backdrop;
  }

  static close(notifyDismiss = true) {
    document
      .querySelector(
        '.cantico-modal-backdrop'
      )
      ?.remove();

    if (keydownHandler) {
      document.removeEventListener(
        'keydown',
        keydownHandler
      );

      keydownHandler = null;
    }

    document.body.style.overflow =
      previousBodyOverflow;

    const handler = dismissHandler;

    dismissHandler = null;

    if (
      notifyDismiss &&
      typeof handler === 'function'
    ) {
      handler();
    }
  }

  static confirm({
    title = 'Confirmar',
    message = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    destructive = false
  } = {}) {
    return new Promise(resolve => {
      let finished = false;

      const finish = result => {
        if (finished) {
          return;
        }

        finished = true;

        this.close(false);
        resolve(result);
      };

      const backdrop = this.open(
        {
          title,
          message,

          actions: `
            <button
              type="button"
              data-modal-cancel
            >
              ${escapeHtml(cancelText)}
            </button>

            <button
              type="button"
              data-modal-confirm
              ${
                destructive
                  ? 'data-modal-destructive'
                  : ''
              }
            >
              ${escapeHtml(confirmText)}
            </button>
          `
        },
        {
          onDismiss: () => {
            finish(false);
          }
        }
      );

      if (!backdrop) {
        finish(false);
        return;
      }

      const cancelButton =
        backdrop.querySelector(
          '[data-modal-cancel]'
        );

      const confirmButton =
        backdrop.querySelector(
          '[data-modal-confirm]'
        );

      cancelButton?.addEventListener(
        'click',
        () => finish(false),
        {
          once: true
        }
      );

      confirmButton?.addEventListener(
        'click',
        () => finish(true),
        {
          once: true
        }
      );

      window.setTimeout(() => {
        confirmButton?.focus();
      }, 0);
    });
  }

  static prompt({
    title = 'Escribe un valor',
    message = '',
    value = '',
    placeholder = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    maxLength = 80
  } = {}) {
    return new Promise(resolve => {
      let finished = false;

      const finish = result => {
        if (finished) {
          return;
        }

        finished = true;

        this.close(false);
        resolve(result);
      };

      const safeMaxLength =
        Number.isFinite(Number(maxLength))
          ? Math.max(1, Number(maxLength))
          : 80;

      const backdrop = this.open(
        {
          title,

          message: `
            ${
              message
                ? `
                  <p>
                    ${escapeHtml(message)}
                  </p>
                `
                : ''
            }

            <input
              type="text"
              data-modal-prompt-input
              value="${escapeHtml(value)}"
              placeholder="${escapeHtml(
                placeholder
              )}"
              maxlength="${safeMaxLength}"
              autocomplete="off"
            >
          `,

          actions: `
            <button
              type="button"
              data-modal-cancel
            >
              ${escapeHtml(cancelText)}
            </button>

            <button
              type="button"
              data-modal-confirm
            >
              ${escapeHtml(confirmText)}
            </button>
          `
        },
        {
          onDismiss: () => {
            finish(null);
          }
        }
      );

      if (!backdrop) {
        finish(null);
        return;
      }

      const input =
        backdrop.querySelector(
          '[data-modal-prompt-input]'
        );

      const cancelButton =
        backdrop.querySelector(
          '[data-modal-cancel]'
        );

      const confirmButton =
        backdrop.querySelector(
          '[data-modal-confirm]'
        );

      const submit = () => {
        const result =
          input?.value.trim() || '';

        if (!result) {
          input?.focus();
          return;
        }

        finish(result);
      };

      cancelButton?.addEventListener(
        'click',
        () => finish(null),
        {
          once: true
        }
      );

      confirmButton?.addEventListener(
        'click',
        submit,
        {
          once: true
        }
      );

      input?.addEventListener(
        'keydown',
        event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            submit();
          }
        }
      );

      window.setTimeout(() => {
        input?.focus();
        input?.select();
      }, 0);
    });
  }
  static alert({
    title = 'Mensaje',
    message = '',
    buttonText = 'Aceptar'
  } = {}) {
    return new Promise(resolve => {
      let finished = false;

      const finish = () => {
        if (finished) {
          return;
        }

        finished = true;

        this.close(false);
        resolve();
      };

      const backdrop = this.open(
        {
          title,

          message: `
            <p>
              ${escapeHtml(message)}
            </p>
          `,

          actions: `
            <button
              type="button"
              data-modal-alert
            >
              ${escapeHtml(buttonText)}
            </button>
          `
        },
        {
          onDismiss: finish
        }
      );

      if (!backdrop) {
        finish();
        return;
      }

      const button =
        backdrop.querySelector(
          '[data-modal-alert]'
        );

      button?.addEventListener(
        'click',
        finish,
        {
          once: true
        }
      );

      window.setTimeout(() => {
        button?.focus();
      }, 0);
    });
  }
}

export default ModalService;
