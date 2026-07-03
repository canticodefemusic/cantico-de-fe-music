import { HymnLibraryService } from '../services/HymnLibraryService.js';

const service = new HymnLibraryService();

export function renderHymnDetail(id) {
  const hymn = service.findById(id);

  if (!hymn) {
    return `
      <section class="hymn-detail">
        <a href="/?page=himnos">← Volver a himnos</a>
        <h1>Himno no encontrado</h1>
        <p>No pudimos encontrar el himno solicitado.</p>
      </section>
    `;
  }

  return `
    <section class="hymn-detail">
      <a href="/?page=himnos">← Volver a himnos</a>
      <article class="hymn-detail__card">
        <p class="hymn-detail__category">${hymn.category}</p>
        <h1>${hymn.title}</h1>
        <p class="hymn-detail__scripture">${hymn.scripture}</p>
        <p>${hymn.description}</p>
        <button type="button" data-hymn-play="${hymn.id}">▶ Escuchar</button>
        <hr>
        <h2>Letra</h2>
        <div class="hymn-detail__lyrics">
          ${hymn.lyrics.map(line => line ? `<p>${line}</p>` : '<br>').join('')}
        </div>
      </article>
    </section>
  `;
}
