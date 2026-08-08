/**
 * Cántico de Fe Music
 * V13.3.1 — R2 Media Library Controller
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
  }

  init() {
    if (!this.root) {
      return false;
    }

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
    this.root = null;

    this.objects = [];

    this.loading = false;

    this.error = null;
  }

}
