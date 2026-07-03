import { HymnLibraryService } from '../services/HymnLibraryService.js';
import { renderHymnCard } from './renderHymnCard.js';

const service = new HymnLibraryService();

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
        <input id="hymnLibrarySearch" type="search" placeholder="Buscar himno, tema o referencia bíblica..." autocomplete="off">
      </div>

      <div class="hymn-library__grid" id="hymnLibraryGrid">
        ${hymns.map(renderHymnCard).join('')}
      </div>
    </section>
  `;
}

export function initHymnLibrary({ onPlay } = {}) {
  const search = document.getElementById('hymnLibrarySearch');
  const grid = document.getElementById('hymnLibraryGrid');

  if (search && grid) {
    search.addEventListener('input', event => {
      const results = service.search(event.target.value);
      grid.innerHTML = results.length
        ? results.map(renderHymnCard).join('')
        : '<p class="hymn-library__empty">No se encontraron himnos.</p>';
      bindPlayButtons(onPlay);
    });
  }

  bindPlayButtons(onPlay);
}

function bindPlayButtons(onPlay) {
  document.querySelectorAll('[data-hymn-play]').forEach(button => {
    button.addEventListener('click', () => {
      const hymn = service.findById(button.dataset.hymnPlay);
      if (typeof onPlay === 'function') {
        onPlay(hymn);
      } else {
        window.dispatchEvent(new CustomEvent('cantico:hymn-play', { detail: hymn }));
      }
    });
  });
}
