/**
 * Cántico de Fe Music
 * V13.5.1 — R2 Media Library Controller
 *
 * Funciones:
 * - Cargar biblioteca R2
 * - Refrescar biblioteca
 * - Copiar enlace
 * - Eliminar archivo de R2
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

    const deleteButton =
      event.target.closest(
        '[data-media-delete]'
      );

    if (deleteButton) {
      await this.deleteMedia(
        deleteButton
      );
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

    const originalText =
      button.textContent;

    try {
      await navigator.clipboard.writeText(
        absoluteUrl
      );

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
            originalText;
        },
        1800
      );

      return false;
    }
  }

  async deleteMedia(
    button
  ) {
    const key =
      button.getAttribute(
        'data-media-delete'
      );

    if (!key) {
      return false;
    }

    const object =
      this.objects.find(
        item =>
          item.key === key
      );

    const originalName =
      object
        ?.customMetadata
        ?.originalName ||
      key
        .split('/')
        .pop() ||
      'este archivo';

    const confirmed =
      window.confirm(
        `¿Eliminar "${originalName}" permanentemente?`
      );

    if (!confirmed) {
      return false;
    }

    const originalText =
      button.textContent;

    button.disabled =
      true;

    button.textContent =
      'Eliminando...';

    try {
      const response =
        await fetch(
          '/api/media/delete',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json'
            },

            body:
              JSON.stringify({
                key
              })
          }
        );

      let data = null;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          'La API de eliminación devolvió una respuesta inválida.'
        );
      }

      if (
        !response.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.error ||
          `No se pudo eliminar el archivo. HTTP ${response.status}`
        );
      }

      this.objects =
        this.objects.filter(
          item =>
            item.key !== key
        );

      this.render();

      return true;

    } catch (error) {
      console.error(
        '[R2MediaLibraryController] Delete failed:',
        error
      );

      if (
        button.isConnected
      ) {
        button.disabled =
          false;

        button.textContent =
          'Error al eliminar';

        window.setTimeout(
          () => {
            if (
              !button.isConnected
            ) {
              return;
            }

            button.textContent =
              originalText;
          },
          2000
        );
      }

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
