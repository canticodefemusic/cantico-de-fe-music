import {
  getPlaylists
} from '../../../features/playlist-engine/services/playlistService.js';

import {
  HymnLibraryService
} from '../../../features/hymn-library-engine/services/HymnLibraryService.js';

const hymnService = new HymnLibraryService();

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderPlaylistDetail(playlist) {
  const hymns = playlist.hymnIds
    .map(hymnId => hymnService.findById(hymnId))
    .filter(Boolean);

  return `
    <section class="cantico-section">
      <a href="/?page=playlists">
        ← Volver a playlists
      </a>

      <h1>${escapeHtml(playlist.name)}</h1>

      <p>
        ${hymns.length} himno${hymns.length === 1 ? '' : 's'}
      </p>

      ${
        hymns.length
          ? `
            <div class="cantico-grid">
              ${hymns.map(hymn => `
                <article class="cantico-card">
                  <h3>${escapeHtml(hymn.title)}</h3>

                  <p>${escapeHtml(hymn.description || '')}</p>

                  <a href="/?page=himnos&id=${encodeURIComponent(hymn.id)}">
                    Ver letra
                  </a>

                  <button
                    type="button"
                    data-hymn-play="${escapeHtml(hymn.id)}"
                  >
                    ▶ Escuchar
                  </button>
                </article>
              `).join('')}
            </div>
          `
          : `
            <p>
              Esta playlist todavía no contiene himnos.
            </p>
          `
      }
    </section>
  `;
}

export function renderPlaylistsView(route = {}) {
  const playlists = getPlaylists();

  if (route.id) {
    const selectedPlaylist = playlists.find(
      playlist => playlist.id === route.id
    );

    if (!selectedPlaylist) {
      return `
        <section class="cantico-section">
          <h1>Playlist no encontrada</h1>

          <p>
            La playlist solicitada no existe o fue eliminada.
          </p>

          <a href="/?page=playlists">
            ← Volver a playlists
          </a>
        </section>
      `;
    }

    return renderPlaylistDetail(selectedPlaylist);
  }

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
            <h3>${escapeHtml(playlist.name)}</h3>

            <p>
              ${playlist.hymnIds.length}
              himno${playlist.hymnIds.length === 1 ? '' : 's'}
            </p>

            <a href="/?page=playlists&id=${encodeURIComponent(playlist.id)}">
              Abrir playlist
            </a>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}
