/**
 * Cántico de Fe Music
 * V13.7.5 — R2 Media Lightbox Controller
 *
 * Funciones:
 * - Abrir imágenes dentro del Modal Engine
 * - Usar nombre original mostrado en la tarjeta
 * - Navegar entre imágenes cargadas
 * - Botones Anterior / Siguiente
 * - Navegación con teclas ← y →
 * - Cerrar con Escape
 * - Cerrar al hacer clic fuera
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
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

    this.images = [];
    this.currentIndex = -1;

    this.lightboxKeydownHandler =
      null;

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

    event.preventDefault();

    this.collectImages();

    const index =
      this.images.findIndex(
        image =>
          image.key === key
      );

    this.currentIndex =
      index >= 0
        ? index
        : 0;

    this.openCurrentImage();
  }

  collectImages() {
    if (!this.root) {
      this.images = [];

      return;
    }

    const cards =
      [
        ...this.root.querySelectorAll(
          '[data-media-key][data-media-type="image"]'
        )
      ];

    this.images =
      cards
        .map(
          card => {
            const key =
              card.getAttribute(
                'data-media-key'
              );

            if (!key) {
              return null;
            }

            return {
              key,

              name:
                getOriginalNameFromCard(
                  card,
                  key
                )
            };
          }
        )
        .filter(
          Boolean
        );
  }

  openCurrentImage() {
    const item =
      this.images[
        this.currentIndex
      ];

    if (!item) {
      return null;
    }

    return this.openImage({
      key:
        item.key,

      name:
        item.name
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

    const total =
      this.images.length;

    const position =
      this.currentIndex + 1;

    const hasPrevious =
      this.currentIndex > 0;

    const hasNext =
      this.currentIndex <
      total - 1;

    this.removeLightboxKeyboard();

    const backdrop =
      ModalService.open(
        {
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

                ${
                  hasPrevious
                    ? `
                      <button
                        type="button"
                        class="
                          media-lightbox__nav
                          media-lightbox__nav--previous
                        "
                        data-media-lightbox-previous
                        aria-label="Imagen anterior"
                        title="Anterior"
                      >
                        ‹
                      </button>
                    `
                    : ''
                }

                <img
                  class="media-lightbox__image"
                  src="${safeUrl}"
                  alt="${safeName}"
                  decoding="async"
                >

                ${
                  hasNext
                    ? `
                      <button
                        type="button"
                        class="
                          media-lightbox__nav
                          media-lightbox__nav--next
                        "
                        data-media-lightbox-next
                        aria-label="Imagen siguiente"
                        title="Siguiente"
                      >
                        ›
                      </button>
                    `
                    : ''
                }

              </div>

              <div
                class="media-lightbox__details"
              >

                <span
                  class="media-lightbox__name"
                >
                  ${safeName}
                </span>

                ${
                  total > 1
                    ? `
                      <span
                        class="media-lightbox__position"
                        aria-label="Posición de la imagen"
                      >
                        ${position}
                        de
                        ${total}
                      </span>
                    `
                    : ''
                }

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
        },
        {
          onDismiss: () => {
            this.removeLightboxKeyboard();
          }
        }
      );

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
          this.removeLightboxKeyboard();

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

    const previousButton =
      backdrop.querySelector(
        '[data-media-lightbox-previous]'
      );

    previousButton
      ?.addEventListener(
        'click',
        () => {
          this.showPrevious();
        }
      );

    const nextButton =
      backdrop.querySelector(
        '[data-media-lightbox-next]'
      );

    nextButton
      ?.addEventListener(
        'click',
        () => {
          this.showNext();
        }
      );

    this.installLightboxKeyboard();

    window.requestAnimationFrame(
      () => {
        closeButton?.focus();
      }
    );

    return backdrop;
  }

  showPrevious() {
    if (
      this.currentIndex <= 0
    ) {
      return false;
    }

    this.currentIndex -= 1;

    this.openCurrentImage();

    return true;
  }

  showNext() {
    if (
      this.currentIndex >=
      this.images.length - 1
    ) {
      return false;
    }

    this.currentIndex += 1;

    this.openCurrentImage();

    return true;
  }

  installLightboxKeyboard() {
    this.removeLightboxKeyboard();

    this.lightboxKeydownHandler =
      event => {
        if (
          event.key ===
          'ArrowLeft'
        ) {
          event.preventDefault();

          this.showPrevious();

          return;
        }

        if (
          event.key ===
          'ArrowRight'
        ) {
          event.preventDefault();

          this.showNext();
        }
      };

    document.addEventListener(
      'keydown',
      this.lightboxKeydownHandler
    );
  }

  removeLightboxKeyboard() {
    if (
      !this.lightboxKeydownHandler
    ) {
      return;
    }

    document.removeEventListener(
      'keydown',
      this.lightboxKeydownHandler
    );

    this.lightboxKeydownHandler =
      null;
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
    this.removeLightboxKeyboard();

    ModalService.close(
      false
    );

    if (
      this.root
    ) {
      this.root.removeEventListener(
        'click',
        this.handleClick
      );
    }

    this.images = [];
    this.currentIndex = -1;

    this.root =
      null;

    this.initialized =
      false;
  }

}

export default
  R2MediaLightboxController;
