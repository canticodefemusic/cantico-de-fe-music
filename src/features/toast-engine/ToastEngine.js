/**
 * Cántico de Fe Music
 * V10.9 — Toast Engine
 */

import {
  renderToast
} from './components/renderToast.js';

class ToastEngine {
  constructor() {
    this.container = null;
    this.timers = new Map();
  }

  init() {
    if (this.container) {
      return;
    }

    this.container =
      document.createElement('section');

    this.container.className =
      'cantico-toast-container';

    document.body.appendChild(
      this.container
    );

    window.addEventListener(
      'cantico:toast-show',
      event => {
        this.show(event.detail);
      }
    );

    window.addEventListener(
      'cantico:toast-dismiss',
      event => {
        this.dismiss(
          event.detail.toastId
        );
      }
    );

    window.addEventListener(
      'cantico:toast-clear',
      () => {
        this.clear();
      }
    );
  }

  show(toast) {
    if (!this.container || !toast) {
      return;
    }

    this.container.insertAdjacentHTML(
      'beforeend',
      renderToast(toast)
    );

    const element =
      this.container.querySelector(
        `[data-toast-id="${toast.id}"]`
      );

    if (!element) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration);

    this.timers.set(
      toast.id,
      timer
    );
  }

  dismiss(toastId) {
    const element =
      this.container?.querySelector(
        `[data-toast-id="${toastId}"]`
      );

    if (!element) {
      return;
    }

    element.remove();

    const timer =
      this.timers.get(toastId);

    if (timer) {
      clearTimeout(timer);
      this.timers.delete(toastId);
    }
  }

  clear() {
    this.container?.replaceChildren();

    this.timers.forEach(timer => {
      clearTimeout(timer);
    });

    this.timers.clear();
  }
}

export default new ToastEngine();
