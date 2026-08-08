/**
 * Cántico de Fe Music
 * V13.4.5 — R2 Media Library Controller
 */

import r2MediaService
  from '../services/R2MediaService.js';

import {
  renderR2MediaLibrary
} from '../components/renderR2MediaLibrary.js';

export class R2MediaLibraryController {

  constructor({
    root,
    service = r2MediaService,
    prefix = ''
  } = {}) {
    this.root = root;
    this.service = service;
    this.prefix = prefix;

    this.objects = [];
    this.loading = false;
    this.error = null;

    this.handleClick =
      this.handleClick.bind(this);
  }

  init() {
    if (!this.root) {
      return false;
    }

    this.root.addEventListener(
      'click',
      this.handleClick
    );

    this.load();

    return true;
  }

  async load() {
    if (!this.root) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.render();

    try {
      this.objects =
        await this.service.listAll({
          prefix:
            this.prefix
        });

      this.error = null;

    } catch (error) {
      console.error(
        '[R2MediaLibraryController]',
        error
      );

      this.objects = [];

      this.error =
        error?.message ||
        'No se pudo cargar la biblioteca multimedia.';
    } finally {
      this.loading = false;

      this.render();
    }
  }

  async refresh() {
    return this.load();
  }

  setPrefix(
    prefix = ''
  ) {
    this.prefix =
      String(prefix);

    return this.load();
  }

  async handleClick(
    event
  ) {
    const copyButton =
      event.target.closest(
        '[data-media-copy]'
      );

    if (copyButton) {
      await this.copyMediaLink(
        copyButton
      );

      return;
    }
  }

  async copyMediaLink(
    button
  ) {
    const mediaUrl =
      button.getAttribute(
        'data-media-url'
      );

    if (!mediaUrl) {
      return false;
    }

    const absoluteUrl =
      new URL(
        mediaUrl,
        window.location.origin
      ).href;

    try {
      await navigator.clipboard.writeText(
        absoluteUrl
      );

      const originalText =
        button.textContent;

      button.textContent =
        '✓ Copiado';

      button.disabled =
        true;

      window.setTimeout(
        () => {
          if (!button.isConnected) {
            return;
          }

          button.textContent =
            originalText;

          button.disabled =
            false;
        },
        1800
      );

      return true;

    } catch (error) {
      console.error(
        '[R2MediaLibraryController] Copy failed:',
        error
      );

      button.textContent =
        'No se pudo copiar';

      window.setTimeout(
        () => {
          if (!button.isConnected) {
            return;
          }

          button.textContent =
            'Copiar enlace';
        },
        1800
      );

      return false;
    }
  }

  render() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML =
      renderR2MediaLibrary({
        objects:
          this.objects,

        loading:
          this.loading,

        error:
          this.error
      });
  }

  getObjects() {
    return [
      ...this.objects
    ];
  }

  destroy() {
    if (this.root) {
      this.root.removeEventListener(
        'click',
        this.handleClick
      );
    }

    this.root = null;

    this.objects = [];

    this.loading = false;

    this.error = null;
  }

}
