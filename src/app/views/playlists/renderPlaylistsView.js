import {
  getPlaylists
} from '../../../features/playlist-engine/services/playlistService.js';

import {
  getFavorites
} from '../../../features/favorites-engine/services/favoritesService.js';

import {
  SmartPlaylistEngine
} from '../../../features/playlist-engine/smart/SmartPlaylistEngine.js';

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

function getSmartPlaylists() {
  const hymns = hymnService.list();
  const favoriteIds = getFavorites();

  const definitions = SmartPlaylistEngine
    .definitions()
    .map(definition => {
      if (definition.type !== 'favorites') {
        return definition;
      }

      return {
        ...definition,
        rule: {
          ...definition.rule,
          favoriteIds
        }
      };
    });

  return SmartPlaylistEngine.generate(
    hymns,
    {
      definitions
    }
  );
}

function renderPlaylistDetail(playlist) {
  const hymns = Array.isArray(playlist.hymns)
    ? playlist.hymns
    : playlist.hymnIds
        .map(hymnId =>
          hymnService.findById(hymnId)
        )
        .filter(Boolean);

  const isSmartPlaylist =
    playlist.automatic === true;

  return `
    <section class="cantico-section">
      <a href="/?page=playlists">
        ← Volver a playlists
      </a>

      <h1>${escapeHtml(playlist.name)}</h1>

      ${
        playlist.description
          ? `
            <p>
              ${escapeHtml(playlist.description)}
            </p>
          `
          : ''
      }

      <p>
        ${hymns.length}
        himno${hymns.length === 1 ? '' : 's'}
      </p>

      ${
        isSmartPlaylist
          ? `
            <p>
              Esta playlist se actualiza automáticamente.
            </p>
          `
          : ''
      }

      ${
        hymns.length
          ? `
            <div class="cantico-grid">
              ${hymns
                .map(hymn => `
                  <article class="cantico-card">
                    <h3>
                      ${escapeHtml(hymn.title)}
                    </h3>

                    <p>
                      ${escapeHtml(
                        hymn.description || ''
                      )}
                    </p>

                    <a
                      href="/?page=himnos&id=${encodeURIComponent(hymn.id)}"
                    >
                      Ver letra
                    </a>

                    <button
                      type="button"
                      data-hymn-play="${escapeHtml(hymn.id)}"
                    >
                      ▶ Escuchar
                    </button>

                    ${
                      isSmartPlaylist
                        ? ''
                        : `
                          <button
                            type="button"
                            data-playlist-remove-hymn="${escapeHtml(hymn.id)}"
                            data-playlist-id="${escapeHtml(playlist.id)}"
                          >
                            Quitar de la playlist
                          </button>
                        `
                    }
                  </article>
                `)
                .join('')}
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

function renderSmartPlaylistCard(playlist) {
  return `
    <article class="cantico-card">
      <p>
        Playlist inteligente
      </p>

      <h3>
        ${escapeHtml(playlist.name)}
      </h3>

      <p>
        ${escapeHtml(playlist.description || '')}
      </p>

      <p>
        ${playlist.hymnIds.length}
        himno${playlist.hymnIds.length === 1 ? '' : 's'}
      </p>

      <a
        href="/?page=playlists&id=${encodeURIComponent(playlist.id)}"
      >
        Abrir playlist
      </a>
    </article>
  `;
}

function renderManualPlaylistCard(playlist) {
  return `
    <article class="cantico-card">
      <h3>
        ${escapeHtml(playlist.name)}
      </h3>

      <p>
        ${playlist.hymnIds.length}
        himno${playlist.hymnIds.length === 1 ? '' : 's'}
      </p>

      <a
        href="/?page=playlists&id=${encodeURIComponent(playlist.id)}"
      >
        Abrir playlist
      </a>

      <button
        type="button"
        data-playlist-rename="${escapeHtml(playlist.id)}"
        data-playlist-name="${escapeHtml(playlist.name)}"
      >
        Renombrar playlist
      </button>

      <button
        type="button"
        data-playlist-delete="${escapeHtml(playlist.id)}"
      >
        Eliminar playlist
      </button>
    </article>
  `;
}

export function renderPlaylistsView(route = {}) {
  const manualPlaylists = getPlaylists();
  const smartPlaylists = getSmartPlaylists();

  const allPlaylists = [
    ...smartPlaylists,
    ...manualPlaylists
  ];

  if (route.id) {
    const selectedPlaylist =
      allPlaylists.find(
        playlist => playlist.id === route.id
      );

    if (!selectedPlaylist) {
      return `
        <section class="cantico-section">
          <h1>
            Playlist no encontrada
          </h1>

          <p>
            La playlist solicitada no existe
            o fue eliminada.
          </p>

          <a href="/?page=playlists">
            ← Volver a playlists
          </a>
        </section>
      `;
    }

    return renderPlaylistDetail(
      selectedPlaylist
    );
  }

  return `
    <section class="cantico-section">
      <h1>Playlists</h1>

      <button id="create-playlist-button">
        Nueva playlist
      </button>

      <h2>
        Playlists inteligentes
      </h2>

      <div class="cantico-grid">
        ${smartPlaylists.length
          ? smartPlaylists
              .map(renderSmartPlaylistCard)
              .join('')
          : `
            <p>
              No hay playlists inteligentes disponibles.
            </p>
          `
        }
      </div>

      <h2>
        Mis playlists
      </h2>

      ${
        manualPlaylists.length
          ? `
            <div class="cantico-grid">
              ${manualPlaylists
                .map(renderManualPlaylistCard)
                .join('')}
            </div>
          `
          : `
            <p>
              Aún no has creado ninguna playlist.
            </p>
          `
      }
    </section>
  `;
}
