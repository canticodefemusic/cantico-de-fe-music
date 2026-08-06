/**
 * Cántico de Fe Music
 * V12.8.3 — Media Grid
 */

import renderMediaCard
  from './renderMediaCard.js';

export default function renderMediaGrid(
  mediaItems = []
) {
  if (!mediaItems.length) {
    return `
      <section
        class="media-grid media-grid--empty"
      >
        <p>
          No se encontraron archivos.
        </p>
      </section>
    `;
  }

  return `
    <section
      class="media-grid"
    >
      ${mediaItems
        .map(renderMediaCard)
        .join('')}
    </section>
  `;
}
