import { HymnLibraryService } from '../services/HymnLibraryService.js';

const service = new HymnLibraryService();

export function renderHymnDetail(id) {
  const hymn = service.findById(id);

  if (!hymn) {
    return `
      <section class="hymn-detail">
        <a class="hymn-detail__back" href="/?page=himnos">← Volver a himnos</a>
        <article class="hymn-detail__card">
          <h1>Himno no encontrado</h1>
          <p>No pudimos encontrar el himno solicitado.</p>
        </article>
      </section>
    `;
  }

  const lyrics = Array.isArray(hymn.lyrics)
    ? hymn.lyrics.map(line => line ? `<p>${line}</p>` : '<br>').join('')
    : '';

  return `
    <section class="hymn-detail" data-hymn-id="${hymn.id}">
      <a class="hymn-detail__back" href="/?page=himnos">← Volver a himnos</a>

      <article class="hymn-detail__card">
        <p class="hymn-detail__category">${hymn.category || 'Himno'}</p>
        <h1>${hymn.title}</h1>

        <p class="hymn-detail__scripture">${hymn.scripture || ''}</p>
        <p class="hymn-detail__description">${hymn.description || ''}</p>

        <div class="hymn-detail__actions">
  <button type="button" data-hymn-play="${hymn.id}">▶ Escuchar</button>

  <button type="button" data-hymn-copy-link="${hymn.id}">
    📋 Copiar enlace
  </button>

  <button
    type="button"
    data-share-whatsapp="${hymn.id}">
    🟢 WhatsApp
  </button>

  <button
    type="button"
    data-share-facebook="${hymn.id}">
    🔵 Facebook
  </button>

  <button
    type="button"
    data-share-x="${hymn.id}">
    ⚫ X
  </button>

  <button
    type="button"
    data-share-email="${hymn.id}">
    ✉️ Email
  </button>

  <button type="button" onclick="window.print()">
    🖨 Imprimir
  </button>
</div>

        <div class="hymn-detail__print-meta">

  <div class="print-row">
    <span class="label">Artista:</span>
    <span>${hymn.artist || 'Cántico de Fe Music'}</span>
  </div>

  <div class="print-row">
    <span class="label">Categoría:</span>
    <span>${hymn.category || 'Himno'}</span>
  </div>

  <div class="print-row">
    <span class="label">Referencia:</span>
    <span>${hymn.scripture || 'Sin referencia'}</span>
  </div>

</div>

        <hr>

        <section class="hymn-detail__lyrics-section">
          <h2>Letra</h2>
          <div class="hymn-detail__lyrics">
            ${lyrics}
          </div>
        </section>
      </article>
    </section>
  `;
}
