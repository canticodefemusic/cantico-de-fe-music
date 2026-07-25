import {
  createPlaylist,
  deletePlaylist,
  removeHymnFromPlaylist
} from '../../../features/playlist-engine/services/playlistService.js';

export function initPlaylistsView() {
  bindCreatePlaylistButton();
  bindRemoveHymnButtons();
  bindDeletePlaylistButtons();
}

function bindCreatePlaylistButton() {
  const button = document.querySelector('#create-playlist-button');

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    const name = window.prompt('Nombre de la nueva playlist');

    if (!name) {
      return;
    }

    createPlaylist(name);

    window.location.reload();
  });
}

function bindRemoveHymnButtons() {
  document
    .querySelectorAll('[data-playlist-remove-hymn]')
    .forEach(button => {
      button.addEventListener('click', () => {
        const hymnId = button.dataset.playlistRemoveHymn;
        const playlistId = button.dataset.playlistId;

        const confirmed = window.confirm(
          '¿Deseas quitar este himno de la playlist?'
        );

        if (!confirmed) {
          return;
        }

        removeHymnFromPlaylist(playlistId, hymnId);

        window.location.reload();
      });
    });
}

function bindDeletePlaylistButtons() {
  document
    .querySelectorAll('[data-playlist-delete]')
    .forEach(button => {
      button.addEventListener('click', () => {
        const playlistId = button.dataset.playlistDelete;

        const confirmed = window.confirm(
          '¿Deseas eliminar esta playlist? Esta acción no se puede deshacer.'
        );

        if (!confirmed) {
          return;
        }

        deletePlaylist(playlistId);

        window.location.reload();
      });
    });
}
