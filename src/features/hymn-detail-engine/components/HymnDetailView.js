export function renderHymnDetailView(hymn) {
  if (!hymn) {
    return `
      <section class="hymn-detail">
        <a class="hymn-detail__back" href="/?page=himnos">← Volver a himnos</a>

        <div class="hymn-detail__card">
          <h1>Himno no encontrado</h1>
          <p>No pudimos encontrar el himno solicitado.</p>
        </div>
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

        <p class="hymn-detail__scripture">
          ${hymn.scripture || ''}
        </p>

        <p class="hymn-detail__description">
          ${hymn.description || ''}
        </p>

        <div class="hymn-detail__actions">
          <button type="button" data-hymn-play="${hymn.id}">
            ▶ Escuchar
          </button>

          <button type="button" data-hymn-share="${hymn.id}">
            Compartir
          </button>

          <button type="button" data-hymn-print="${hymn.id}">
            Imprimir
          </button>
        </div>
        
<table class="hymn-detail__meta-table">

  <tr>
    <th scope="row">Artista:</th>
    <td>${hymn.artist || 'Cántico de Fe Music'}</td>
  </tr>

  <tr>
    <th scope="row">Categoría:</th>
    <td>${hymn.category}</td>
  </tr>

  <tr>
    <th scope="row">Referencia:</th>
    <td>${hymn.scripture}</td>
  </tr>

</table>

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
