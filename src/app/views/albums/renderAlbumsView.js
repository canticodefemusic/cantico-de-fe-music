import { getAlbums } from '../../../features/albums-engine/services/albumsService.js';
import { renderCards } from '../../components/cards/renderCards.js';

export function renderAlbumsView() {
  const albums = getAlbums();
  
  return `
    <section class="cantico-section">
      <h1>Álbumes</h1>
      <p>Colecciones musicales de Cántico de Fe Music.</p>
      ${renderCards(albums, album => `
        <article class="cantico-card album-card">
  <img
    src="${album.cover}"
    alt="Portada de ${album.title}"
    loading="lazy"
  >

  <div class="album-card__content">
    <h3>${album.title}</h3>

    <p>${album.description}</p>

    <p>
      <strong>Año:</strong>
      ${album.year}
    </p>

    <p>
      ${album.hymnIds.length}
      ${album.hymnIds.length === 1 ? 'himno' : 'himnos'}
    </p>

    <a href="/?page=albums&id=${encodeURIComponent(album.id)}">
      Abrir álbum
    </a>
  </div>
</article>
      `)}
    </section>
  `;
}
