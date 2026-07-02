import { playlists } from '../../data/siteData.js';
import { renderCards } from '../../components/cards/renderCards.js';

export function renderPlaylistsView() {
  return `
    <section class="cantico-section">
      <h1>Playlists</h1>
      <p>Listas de reproducción para escuchar himnos y alabanzas.</p>
      ${renderCards(playlists, playlist => `
        <article class="cantico-card">
          <h3>${playlist.title}</h3>
          <p>${playlist.description}</p>
        </article>
      `)}
    </section>
  `;
}
