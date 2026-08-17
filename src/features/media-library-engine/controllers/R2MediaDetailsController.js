/**
 * Cántico de Fe Music
 * V13.4.5 — R2 Media Details Controller
 */

import adaptR2MediaObject
  from '../services/R2MediaMetadataAdapter.js';

import renderR2MediaDetails
  from '../components/renderR2MediaDetails.js';

export class R2MediaDetailsController {

  constructor({
    root = null,
    host = null,
    libraryController = null
  } = {}) {
    this.root =
      root;

    this.host =
      host;

    this.libraryController =
      libraryController;

    this.handleClick =
      this.handleClick.bind(
        this
      );

    this.handleKeyDown =
      this.handleKeyDown.bind(
        this
      );
  }

  init() {
    if (
      !this.root ||
      !this.host
    ) {
      return false;
    }

    this.root.addEventListener(
      'click',
      this.handleClick
    );

    this.host.addEventListener(
      'click',
      this.handleClick
    );

    document.addEventListener(
      'keydown',
      this.handleKeyDown
    );

    return true;
  }

  getObjects() {
    const controller =
      this.libraryController;

    if (!controller) {
      return [];
    }

    if (
      typeof controller.getObjects ===
      'function'
    ) {
      const objects =
        controller.getObjects();

      return Array.isArray(objects)
        ? objects
        : [];
    }

    if (
      Array.isArray(
        controller.objects
      )
    ) {
      return controller.objects;
    }

    if (
      Array.isArray(
        controller.state?.objects
      )
    ) {
      return controller.state.objects;
    }

    return [];
  }

  getObjectByKey(
    key = ''
  ) {
    const cleanKey =
      String(
        key || ''
      ).trim();

    if (!cleanKey) {
      return null;
    }

    return (
      this.getObjects()
        .find(
          object =>
            object?.key ===
            cleanKey
        ) ||
      null
    );
  }

  open(
    key = ''
  ) {
    const object =
      this.getObjectByKey(
        key
      );

    if (!object) {
      console.error(
        '[R2MediaDetailsController] No se encontró el objeto R2:',
        key
      );

      return false;
    }

    const media =
      adaptR2MediaObject(
        object
      );

    if (!media) {
      console.error(
        '[R2MediaDetailsController] No se pudo adaptar el objeto R2:',
        key
      );

      return false;
    }

    this.host.innerHTML =
      renderR2MediaDetails({
        media
      });

    document.body
      .classList
      .add(
        'has-r2-media-details'
      );

    return true;
  }

  close() {
    if (this.host) {
      this.host.innerHTML =
        '';
    }

    document.body
      .classList
      .remove(
        'has-r2-media-details'
      );

    return true;
  }

  async copyLink(
    button
  ) {
    const mediaUrl =
      button?.getAttribute(
        'data-r2-media-url'
      ) || '';

    if (!mediaUrl) {
      return false;
    }

    const absoluteUrl =
      new URL(
        mediaUrl,
        window.location.origin
      ).href;

    try {
      await navigator
        .clipboard
        .writeText(
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
          if (
            !button.isConnected
          ) {
            return;
          }

          button.textContent =
            originalText;

          button.disabled =
            false;
        },
        1500
      );

      return true;

    } catch (error) {
      console.error(
        '[R2MediaDetailsController] No se pudo copiar el enlace:',
        error
      );

      return false;
    }
  }

  async handleClick(
    event
  ) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return;
    }

    const detailsButton =
      target.closest(
        '[data-media-details]'
      );

    if (detailsButton) {
      event.preventDefault();
      event.stopPropagation();

      const key =
        detailsButton.getAttribute(
          'data-media-details'
        );

      const menu =
        detailsButton.closest(
          'details'
        );

      if (menu) {
        menu.open =
          false;
      }

      this.open(
        key
      );

      return;
    }

    const closeButton =
      target.closest(
        '[data-r2-media-details-close]'
      );

    if (closeButton) {
      event.preventDefault();

      this.close();

      return;
    }

    const copyButton =
      target.closest(
        '[data-r2-media-details-copy]'
      );

    if (copyButton) {
      event.preventDefault();

      await this.copyLink(
        copyButton
      );
    }
  }

  handleKeyDown(
    event
  ) {
    if (
      event.key !==
      'Escape'
    ) {
      return;
    }

    if (
      !this.host?.querySelector(
        '[data-r2-media-details]'
      )
    ) {
      return;
    }

    event.preventDefault();

    this.close();
  }

  destroy() {
    if (this.root) {
      this.root.removeEventListener(
        'click',
        this.handleClick
      );
    }

    if (this.host) {
      this.host.removeEventListener(
        'click',
        this.handleClick
      );
    }

    document.removeEventListener(
      'keydown',
      this.handleKeyDown
    );

    this.close();

    this.root =
      null;

    this.host =
      null;

    this.libraryController =
      null;
  }

}

export default
  R2MediaDetailsController;
