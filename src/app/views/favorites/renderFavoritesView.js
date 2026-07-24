import {
  HymnLibraryService,
  renderHymnCard,
  initHymnLibrary
} from '../../../features/hymn-library-engine/index.js';

import {
  getFavorites
} from '../../../features/favorites-engine/services/favoritesService.js';

const service = new HymnLibraryService();

function getFavoriteHymns() {
  const favoriteIds = new Set(getFavorites());

  return service
    .list()
    .filter(hymn => favoriteIds.has(hymn.id));
}

function renderFavoritesContent() {
  const favoriteHymns = getFavoriteHymns();

  if (!favoriteHymns.length) {
    return `
      <div class="hymn-library__empty">
        <h2>Aún no tienes himnos favoritos</h2>
        <p>
          Marca la estrella de cualquier himno para encontrarlo aquí.
        </p>
        <a href="/?page=himnos">Explorar himnos</a>
      </div>
    `;
  }

  return favoriteHymns
    .map(hymn => renderHymnCard(hymn))
    .join('');
}

export function renderFavoritesView() {
  return `
    <section class="hymn-library">
      <div class="hymn-library__header">
        <p class="hymn-library__kicker">Tu colección personal</p>
        <h1>Favoritos</h1>
        <p>
          Aquí encontrarás los himnos que has marcado con la estrella.
        </p>
      </div>

      <div
        class="hymn-library__grid"
        id="favoritesGrid"
      >
        ${renderFavoritesContent()}
      </div>
    </section>
  `;
}

export function initFavoritesView({ onPlay } = {}) {
  const grid = document.getElementById('favoritesGrid');

  if (!grid) {
    return;
  }

  const refreshFavorites = () => {
    grid.innerHTML = renderFavoritesContent();

    initHymnLibrary({
      onPlay
    });
  };

  window.addEventListener(
    'cantico:favorites-changed',
    refreshFavorites
  );
}
