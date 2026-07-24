import { isFavorite } from '../../favorites-engine/services/favoritesService.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeForSearch(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n');
}

function highlightText(value = '', query = '') {
  const source = String(value);
  const normalizedQuery = normalizeForSearch(query).trim();

  if (!normalizedQuery) {
    return escapeHtml(source);
  }

  let normalizedSource = '';
  const startMap = [];
  const endMap = [];

  let sourceIndex = 0;

  for (const character of source) {
    const normalizedCharacter = normalizeForSearch(character);

    for (const normalizedPart of normalizedCharacter) {
      normalizedSource += normalizedPart;
      startMap.push(sourceIndex);
      endMap.push(sourceIndex + character.length);
    }

    sourceIndex += character.length;
  }

  const matchIndex = normalizedSource.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return escapeHtml(source);
  }

  const originalStart = startMap[matchIndex];
  const originalEnd = endMap[matchIndex + normalizedQuery.length - 1];

  return [
    escapeHtml(source.slice(0, originalStart)),
    `<mark class="hymn-library-card__highlight">${escapeHtml(
      source.slice(originalStart, originalEnd)
    )}</mark>`,
    escapeHtml(source.slice(originalEnd))
  ].join('');
}

export function renderHymnCard(hymn, query = '') {
  const favorite = isFavorite(hymn.id);
  const safeId = escapeHtml(hymn.id);
  const safeTitle = escapeHtml(hymn.title);

  return `
    <article class="hymn-library-card" data-hymn-id="${safeId}">
      <button
        type="button"
        class="hymn-library-card__favorite"
        data-hymn-favorite="${safeId}"
        aria-label="${
          favorite
            ? `Quitar ${safeTitle} de favoritos`
            : `Agregar ${safeTitle} a favoritos`
        }"
        aria-pressed="${favorite}"
        title="${favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
      >
        ${favorite ? '★' : '☆'}
      </button>

      <div class="hymn-library-card__icon">♪</div>

      <div class="hymn-library-card__body">
        <p class="hymn-library-card__category">
          ${highlightText(hymn.category, query)}
        </p>

        <h3>${highlightText(hymn.title, query)}</h3>

        <p class="hymn-library-card__scripture">
          ${highlightText(hymn.scripture, query)}
        </p>

        <p>${highlightText(hymn.description, query)}</p>

        <div class="hymn-library-card__actions">
          <a href="/?page=himnos&id=${encodeURIComponent(hymn.id)}">
            Ver letra
          </a>

          <button
            type="button"
            data-hymn-play="${safeId}"
          >
            ▶ Escuchar
          </button>
        </div>
      </div>
    </article>
  `;
}
