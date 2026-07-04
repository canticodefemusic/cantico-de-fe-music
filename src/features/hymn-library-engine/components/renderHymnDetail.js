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
          <button type="button" onclick="navigator.clipboard.writeText(window.location.href)">Copiar enlace</button>
          <button type="button" onclick="window.print()">Imprimir</button>
        </div>

        <div class="hymn-detail__meta">
          <div><strong>Artista</strong><span>${hymn.artist || 'Cántico de Fe Music'}</span></div>
          <div><strong>Categoría</strong><span>${hymn.category || 'Himno'}</span></div>
          <div><strong>Referencia</strong><span>${hymn.scripture || 'Sin referencia'}</span></div>
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
