export function renderHymnCard(hymn) {
  return `
    <article class="hymn-library-card" data-hymn-id="${hymn.id}">
      <div class="hymn-library-card__icon">♪</div>
      <div class="hymn-library-card__body">
        <p class="hymn-library-card__category">${hymn.category}</p>
        <h3>${hymn.title}</h3>
        <p class="hymn-library-card__scripture">${hymn.scripture}</p>
        <p>${hymn.description}</p>
        <div class="hymn-library-card__actions">
          <a href="/?page=himnos&id=${hymn.id}">Ver letra</a>
          <button type="button" data-hymn-play="${hymn.id}">▶ Escuchar</button>
        </div>
      </div>
    </article>
  `;
}
