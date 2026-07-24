import {
  createPlaylist
} from '../../../features/playlist-engine/services/playlistService.js';

export function initPlaylistsView() {
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
