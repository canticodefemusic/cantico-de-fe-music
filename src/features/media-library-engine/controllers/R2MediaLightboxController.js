/**
 * Cántico de Fe Music
 * V13.7.4.1 — R2 Media Lightbox Controller
 *
 * Funciones:
 * - Abrir imágenes dentro del Modal Engine
 * - Usar el nombre original mostrado en la tarjeta
 * - Cerrar con Escape
 * - Cerrar al hacer clic fuera
 * - Mostrar imagen grande
 * - Descargar imagen
 * - Copiar enlace
 */

import {
  ModalService
} from '../../modal-engine/index.js';

function escapeHtml(
  value = ''
) {
  return String(value)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );
}

function getMediaUrl(
  key
) {
  if (!key) {
    return '';
  }

  return (
    '/api/media/file?key=' +
    encodeURIComponent(
      key
    )
  );
}

function getFileName(
  key = ''
) {
  const parts =
    String(key)
      .split('/');

  return (
    parts[
      parts.length - 1
    ] || 'Imagen'
  );
}

function getOriginalNameFromCard(
  card,
  key
) {
  if (!card) {
    return getFileName(
      key
    );
  }

  const nameElement =
    card.querySelector(
      '.media-library-item__name'
    );

  const originalName =
    nameElement
      ?.textContent
      ?.trim();

  return (
    originalName ||
    getFileName(
      key
    )
  );
}

export class R2MediaLightboxController {

  constructor({
    root = null
  } = {}) {
    this.root =
      root;

    this.initialized =
      false;

    this.handleClick =
      this.handleClick.bind(
        this
      );
  }

  init() {
    if (
      !this.root ||
      this.initialized
    ) {
      return false;
    }

    this.root.addEventListener(
      'click',
      this.handleClick
    );

    this.initialized =
      true;

    return true;
  }

  handleClick(
    event
  ) {
    const target =
      event.target;

    if (
      !(target instanceof Element)
    ) {
      return;
    }

    const previewLink =
      target.closest(
        '[data-media-preview]'
      );

    if (!previewLink) {
      return;
    }

    const card =
      previewLink.closest(
        '[data-media-key]'
      );

    if (!card) {
      return;
    }

    const mediaType =
      card.getAttribute(
        'data-media-type'
      );

    /*
     * V13.7.4.1
     *
     * Por ahora el Lightbox se usa
     * únicamente para imágenes.
     */
    if (
      mediaType !== 'image'
    ) {
      return;
    }

    const key =
      previewLink.getAttribute(
        'data-media-preview'
      );

    if (!key) {
      return;
    }

    const originalName =
      getOriginalNameFromCard(
        card,
        key
      );

    event.preventDefault();

    this.openImage({
      key,
      name:
        originalName
    });
  }

  openImage({
    key,
    name = ''
  } = {}) {
    if (!key) {
      return null;
    }

    const mediaUrl =
      getMediaUrl(
        key
      );

    const fileName =
      String(
        name
      ).trim() ||
      getFileName(
        key
      );

    const safeName =
      escapeHtml(
        fileName
      );

    const safeUrl =
      escapeHtml(
        mediaUrl
      );

    const backdrop =
      ModalService.open({
        title:
          safeName,

        message: `
          <div
            class="media-lightbox"
            data-media-lightbox
          >

            <div
              class="media-lightbox__viewer"
            >
              <img
                class="media-lightbox__image"
                src="${safeUrl}"
                alt="${safeName}"
                decoding="async"
              >
            </div>

            <div
              class="media-lightbox__details"
            >
              <span
                class="media-lightbox__name"
              >
                ${safeName}
              </span>
            </div>

          </div>
        `,

        actions: `
          <button
            type="button"
            data-media-lightbox-copy
            data-media-url="${safeUrl}"
          >
            Copiar enlace
          </button>

          <a
            href="${safeUrl}"
            download="${safeName}"
            class="media-lightbox__download"
          >
            Descargar
          </a>

          <button
            type="button"
            data-media-lightbox-close
          >
            Cerrar
          </button>
        `
      });

    if (!backdrop) {
      return null;
    }

    const modal =
      backdrop.querySelector(
        '.cantico-modal'
      );

    modal?.classList.add(
      'cantico-modal--media-lightbox'
    );

    const closeButton =
      backdrop.querySelector(
        '[data-media-lightbox-close]'
      );

    closeButton
      ?.addEventListener(
        'click',
        () => {
          ModalService.close();
        },
        {
          once:
            true
        }
      );

    const copyButton =
      backdrop.querySelector(
        '[data-media-lightbox-copy]'
      );

    copyButton
      ?.addEventListener(
        'click',
        async () => {
          await this.copyLink(
            copyButton,
            mediaUrl
          );
        }
      );

    window.requestAnimationFrame(
      () => {
        closeButton?.focus();
      }
    );

    return backdrop;
  }

  async copyLink(
    button,
    mediaUrl
  ) {
    if (
      !button ||
      !mediaUrl
    ) {
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
      await navigator
        .clipboard
        .writeText(
          absoluteUrl
        );

      button.textContent =
        '✓ Enlace copiado';

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
        1600
      );

      return true;

    } catch (error) {
      console.error(
        '[R2MediaLightboxController] Copy failed:',
        error
      );

      button.textContent =
        'No se pudo copiar';

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
        1600
      );

      return false;
    }
  }

  destroy() {
    if (
      !this.initialized
    ) {
      return;
    }

    if (this.root) {
      this.root.removeEventListener(
        'click',
        this.handleClick
      );
    }

    this.root =
      null;

    this.initialized =
      false;
  }

}

export default
  R2MediaLightboxController;
