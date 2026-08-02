/**
 * Cántico de Fe Music
 * V10.7 Modal Service
 */

import {
  renderModal
} from '../components/renderModal.js';

let previousBodyOverflow = '';
let keydownHandler = null;

class ModalService {
  static open(options = {}) {
    this.close();

    previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

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
      this.close();
      return null;
    }

    keydownHandler = event => {
      if (event.key === 'Escape') {
        this.close();
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

  static close() {
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
  }

  static confirm({
    title = 'Confirmar',
    message = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    destructive = false
  } = {}) {
    return new Promise(resolve => {
      const backdrop = this.open({
        title,
        message,

        actions: `
          <button
            type="button"
            data-modal-cancel
          >
            ${cancelText}
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
            ${confirmText}
          </button>
        `
      });

      if (!backdrop) {
        resolve(false);
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

      const finish = result => {
        this.close();
        resolve(result);
      };

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
}

export default ModalService;
