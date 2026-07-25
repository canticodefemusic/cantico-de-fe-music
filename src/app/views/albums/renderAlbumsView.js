import { getAlbums } from '../../../features/albums-engine/services/albumsService.js';
import { renderCards } from '../../components/cards/renderCards.js';

export function renderAlbumsView() {
  const albums = getAlbums();
  
  return `
    <section class="cantico-section">
      <h1>Álbumes</h1>
      <p>Colecciones musicales de Cántico de Fe Music.</p>
      ${renderCards(albums, album => `
        <article class="cantico-card">
          <h3>${album.title}</h3>
          <p>${album.description}</p>
        </article>
      `)}
    </section>
  `;
}
