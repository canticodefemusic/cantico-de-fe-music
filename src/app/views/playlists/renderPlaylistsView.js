import { getPlaylists } from '../../../features/playlist-engine/services/playlistService.js';

export function renderPlaylistsView() {
  const playlists = getPlaylists();

  if (playlists.length === 0) {
    return `
      <section class="cantico-section">
        <h1>Playlists</h1>

        <p>
          Aún no has creado ninguna playlist.
        </p>

        <button id="create-playlist-button">
          Crear playlist
        </button>
      </section>
    `;
  }

  return `
    <section class="cantico-section">
      <h1>Playlists</h1>

      <button id="create-playlist-button">
        Nueva playlist
      </button>

      <div class="cantico-grid">
        ${playlists.map(playlist => `
          <article class="cantico-card">
            <h3>${playlist.name}</h3>

            <p>
              ${playlist.hymnIds.length} himno${playlist.hymnIds.length === 1 ? '' : 's'}
            </p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}
