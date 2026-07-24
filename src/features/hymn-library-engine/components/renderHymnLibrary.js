import { HymnLibraryService } from '../services/HymnLibraryService.js';
import { renderHymnCard } from './renderHymnCard.js';
import {
  isFavorite,
  toggleFavorite
} from '../../favorites-engine/services/favoritesService.js';

const service = new HymnLibraryService();

function debounce(callback, delay = 200) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function renderHymnLibrary() {
  const hymns = service.list();

  return `
    <section class="hymn-library">
      <div class="hymn-library__header">
        <p class="hymn-library__kicker">Biblioteca de himnos</p>
        <h1>Himnos</h1>
        <p>Explora los himnos originales de Cántico de Fe Music.</p>
      </div>

      <div class="hymn-library__tools">
        <input
          id="hymnLibrarySearch"
          type="search"
          placeholder="Buscar himno, tema o referencia bíblica..."
          autocomplete="off"
        >
      </div>

      <div class="hymn-library__grid" id="hymnLibraryGrid">
        ${hymns.map(hymn => renderHymnCard(hymn)).join('')}
      </div>
    </section>
  `;
}

export function initHymnLibrary({ onPlay } = {}) {
  const search = document.getElementById('hymnLibrarySearch');
  const grid = document.getElementById('hymnLibraryGrid');

  if (search && grid) {
    const handleSearch = debounce(event => {
      const query = event.target.value;
      const results = service.search(query);

      grid.innerHTML = results.length
        ? results
            .map(hymn => renderHymnCard(hymn, query))
            .join('')
        : '<p class="hymn-library__empty">No se encontraron himnos.</p>';

      bindCardButtons(onPlay);
    }, 200);

    search.addEventListener('input', handleSearch);
  }

  bindCardButtons(onPlay);
}

function bindCardButtons(onPlay) {
  bindPlayButtons(onPlay);
  bindFavoriteButtons();
}

function bindFavoriteButtons() {
  document.querySelectorAll('[data-hymn-favorite]').forEach(button => {
    button.addEventListener('click', () => {
      const hymnId = button.dataset.hymnFavorite;
      const hymn = service.findById(hymnId);

      toggleFavorite(hymnId);

      const favorite = isFavorite(hymnId);
      const title = hymn?.title || 'este himno';

      button.textContent = favorite ? '★' : '☆';
      button.setAttribute('aria-pressed', String(favorite));
      button.setAttribute(
        'aria-label',
        favorite
          ? `Quitar ${title} de favoritos`
          : `Agregar ${title} a favoritos`
      );
      button.title = favorite
        ? 'Quitar de favoritos'
        : 'Agregar a favoritos';

      window.dispatchEvent(
        new CustomEvent('cantico:favorites-changed', {
          detail: {
            hymnId,
            favorite
          }
        })
      );
    });
  });
}

function bindPlayButtons(onPlay) {
  document.querySelectorAll('[data-hymn-play]').forEach(button => {
    button.addEventListener('click', () => {
      const hymn = service.findById(button.dataset.hymnPlay);

      if (typeof onPlay === 'function') {
        onPlay(hymn);
      } else {
        window.dispatchEvent(
          new CustomEvent('cantico:hymn-play', {
            detail: hymn
          })
        );
      }
    });
  });
}
