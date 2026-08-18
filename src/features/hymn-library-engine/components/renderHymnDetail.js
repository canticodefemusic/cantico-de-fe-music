/**
 * Cántico de Fe Music
 * V13.4.41 — Hymn Detail Modal
 *
 * Funciones:
 * - Usar la biblioteca compartida
 * - Mostrar himnos base y dinámicos R2
 * - Modal centrado
 * - Cerrar con X
 * - Cerrar haciendo clic fuera
 * - Cerrar con Escape
 * - Mantener reproducción, compartir e impresión
 */

import hymnLibraryService
  from '../services/hymnLibraryServiceInstance.js';

import {
  updateSeo
} from '../services/seoService.js';

import {
  updateStructuredData
} from '../services/structuredDataService.js';

let hymnDetailKeyHandler =
  null;

function escapeHtml(
  value = ''
) {
  return String(
    value ?? ''
  )
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderLyrics(
  hymn
) {
  const lyrics =
    Array.isArray(
      hymn?.lyrics
    )
      ? hymn.lyrics
      : [];

  if (!lyrics.length) {
    return `
      <p
        class="hymn-detail__empty-lyrics"
      >
        La letra de este himno todavía no está disponible.
      </p>
    `;
  }

  return lyrics
    .map(
      line =>
        line
          ? `<p>${escapeHtml(line)}</p>`
          : '<br>'
    )
    .join('');
}

function closeHymnDetail() {
  const modal =
    document.querySelector(
      '[data-hymn-detail-modal]'
    );

  if (modal) {
    modal.remove();
  }

  window.history.replaceState(
    {},
    '',
    '/?page=himnos'
  );
}

export function renderHymnDetail(
  id
) {
  const hymn =
    hymnLibraryService
      .findById(
        id
      );

  if (!hymn) {
    return `
      <section
        class="hymn-detail"
      >
        <div
          class="hymn-detail__backdrop"
          data-hymn-detail-modal
        >
          <article
            class="hymn-detail__card"
            data-hymn-detail-dialog
          >
            <a
              class="hymn-detail__close"
              href="/?page=himnos"
              aria-label="Cerrar"
              title="Cerrar"
            >
              ×
            </a>

            <h1>
              Himno no encontrado
            </h1>

            <p>
              No pudimos encontrar el himno solicitado.
            </p>
          </article>
        </div>
      </section>
    `;
  }

  updateSeo({
    title:
      hymn.title,

    description:
      hymn.description,

    url:
      window.location.href,

    image:
      hymn.cover
  });

  updateStructuredData({
    title:
      hymn.title,

    description:
      hymn.description,

    url:
      window.location.href,

    image:
      hymn.cover,

    artist:
      hymn.artist ||
      'Cántico de Fe Music',

    category:
      hymn.category ||
      'Himno cristiano',

    scripture:
      hymn.scripture ||
      ''
  });

  const safeId =
    escapeHtml(
      hymn.id
    );

  const safeTitle =
    escapeHtml(
      hymn.title
    );

  const safeCategory =
    escapeHtml(
      hymn.category ||
      'Himno'
    );

  const safeScripture =
    escapeHtml(
      hymn.scripture ||
      ''
    );

  const safeDescription =
    escapeHtml(
      hymn.description ||
      ''
    );

  const safeArtist =
    escapeHtml(
      hymn.artist ||
      'Cántico de Fe Music'
    );

  const safeCover =
    escapeHtml(
      hymn.cover ||
      ''
    );

  return `
    <section
      class="hymn-detail"
      data-hymn-id="${safeId}"
    >
      <div
        class="hymn-detail__backdrop"
        data-hymn-detail-modal
      >
        <article
          class="hymn-detail__card"
          data-hymn-detail-dialog
          role="dialog"
          aria-modal="true"
          aria-labelledby="hymnDetailTitle"
        >
          <button
            type="button"
            class="hymn-detail__close"
            data-hymn-detail-close
            aria-label="Cerrar"
            title="Cerrar"
          >
            ×
          </button>

          <div
            class="hymn-detail__content"
          >
            ${
              safeCover
                ? `
                    <div
                      class="hymn-detail__cover"
                    >
                      <img
                        src="${safeCover}"
                        alt="${safeTitle}"
                        loading="eager"
                        decoding="async"
                      >
                    </div>
                  `
                : ''
            }

            <div
              class="hymn-detail__main"
            >
              <p
                class="hymn-detail__category"
              >
                ${safeCategory}
              </p>

              <h1
                id="hymnDetailTitle"
              >
                ${safeTitle}
              </h1>

              ${
                safeScripture
                  ? `
                      <p
                        class="hymn-detail__scripture"
                      >
                        ${safeScripture}
                      </p>
                    `
                  : ''
              }

              ${
                safeDescription
                  ? `
                      <p
                        class="hymn-detail__description"
                      >
                        ${safeDescription}
                      </p>
                    `
                  : ''
              }

              <div
                class="hymn-detail__actions"
              >
                <button
                  type="button"
                  data-hymn-play="${safeId}"
                >
                  ▶ Escuchar
                </button>

                <button
                  type="button"
                  data-hymn-copy-link="${safeId}"
                >
                  📋 Copiar enlace
                </button>

                <button
                  type="button"
                  data-share-whatsapp="${safeId}"
                >
                  🟢 WhatsApp
                </button>

                <button
                  type="button"
                  data-share-facebook="${safeId}"
                >
                  🔵 Facebook
                </button>

                <button
                  type="button"
                  data-share-x="${safeId}"
                >
                  ⚫ X
                </button>

                <button
                  type="button"
                  data-share-email="${safeId}"
                >
                  ✉️ Email
                </button>

                <button
                  type="button"
                  data-share-native="${safeId}"
                  hidden
                >
                  📤 Compartir
                </button>

                <button
                  type="button"
                  onclick="window.print()"
                >
                  🖨 Imprimir
                </button>
              </div>
            </div>
          </div>

          <div
            class="hymn-detail__print-meta"
          >
            <div
              class="print-row"
            >
              <span
                class="label"
              >
                Artista:
              </span>

              <span>
                ${safeArtist}
              </span>
            </div>

            <div
              class="print-row"
            >
              <span
                class="label"
              >
                Categoría:
              </span>

              <span>
                ${safeCategory}
              </span>
            </div>

            <div
              class="print-row"
            >
              <span
                class="label"
              >
                Referencia:
              </span>

              <span>
                ${
                  safeScripture ||
                  'Sin referencia'
                }
              </span>
            </div>
          </div>

          <section
            class="hymn-detail__lyrics-section"
          >
            <h2>
              Letra
            </h2>

            <div
              class="hymn-detail__lyrics"
            >
              ${renderLyrics(
                hymn
              )}
            </div>
          </section>
        </article>
      </div>
    </section>
  `;
}

export function initHymnDetail() {
  const modal =
    document.querySelector(
      '[data-hymn-detail-modal]'
    );

  if (!modal) {
    return false;
  }

  const closeButton =
    modal.querySelector(
      '[data-hymn-detail-close]'
    );

  closeButton
    ?.addEventListener(
      'click',
      event => {
        event.preventDefault();

        closeHymnDetail();
      }
    );

  modal.addEventListener(
    'click',
    event => {
      if (
        event.target !==
        modal
      ) {
        return;
      }

      closeHymnDetail();
    }
  );

  if (
    hymnDetailKeyHandler
  ) {
    document.removeEventListener(
      'keydown',
      hymnDetailKeyHandler
    );
  }

  hymnDetailKeyHandler =
    event => {
      if (
        event.key !==
        'Escape'
      ) {
        return;
      }

      event.preventDefault();

      closeHymnDetail();
    };

  document.addEventListener(
    'keydown',
    hymnDetailKeyHandler
  );

  closeButton?.focus();

  return true;
}

export {
  escapeHtml,
  renderLyrics,
  closeHymnDetail
};
