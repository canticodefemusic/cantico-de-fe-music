/**
 * Cántico de Fe Music
 * V13.4.36 — Shared Hymn Detail
 *
 * Funciones:
 * - Usar la instancia compartida de HymnLibraryService
 * - Renderizar himnos base y dinámicos R2
 * - Mantener SEO
 * - Mantener datos estructurados
 * - Mantener acciones de compartir
 * - Mostrar estado correcto cuando no hay letra
 */

import hymnLibraryService
  from '../services/hymnLibraryServiceInstance.js';

import {
  updateSeo
} from '../services/seoService.js';

import {
  updateStructuredData
} from '../services/structuredDataService.js';

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
        <a
          class="hymn-detail__back"
          href="/?page=himnos"
        >
          ← Volver a himnos
        </a>

        <article
          class="hymn-detail__card"
        >
          <h1>
            Himno no encontrado
          </h1>

          <p>
            No pudimos encontrar el himno solicitado.
          </p>
        </article>
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
      <a
        class="hymn-detail__back"
        href="/?page=himnos"
      >
        ← Volver a himnos
      </a>

      <article
        class="hymn-detail__card"
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
                    loading="lazy"
                    decoding="async"
                  >
                </div>
              `
            : ''
        }

        <p
          class="hymn-detail__category"
        >
          ${safeCategory}
        </p>

        <h1>
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

        <hr>

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
    </section>
  `;
}

export {
  escapeHtml,
  renderLyrics
};
