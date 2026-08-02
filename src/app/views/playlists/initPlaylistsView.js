import {
  createPlaylist,
  renamePlaylist,
  deletePlaylist,
  removeHymnFromPlaylist,
  duplicatePlaylist,
  exportPlaylists,
  importPlaylists
} from '../../../features/playlist-engine/index.js';

import {
  ModalService
} from '../../../features/modal-engine/index.js';

export function initPlaylistsView() {
  bindCreatePlaylistButton();
  bindRemoveHymnButtons();
  bindRenamePlaylistButtons();
  bindDuplicatePlaylistButtons();
  bindDeletePlaylistButtons();
  bindExportPlaylistsButton();
  bindImportPlaylistsButton();
}

function bindCreatePlaylistButton() {
  const button = document.querySelector(
    '#create-playlist-button'
  );

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    ModalService.open({
      title: 'Nueva playlist',

      message: `
        <label for="newPlaylistName">
          Nombre de la playlist
        </label>

        <input
          id="newPlaylistName"
          type="text"
          maxlength="80"
          autocomplete="off"
          placeholder="Ejemplo: Himnos de esperanza"
        >
      `,

      actions: `
        <button
          type="button"
          data-modal-cancel
        >
          Cancelar
        </button>

        <button
          type="button"
          data-modal-create-playlist
        >
          Crear playlist
        </button>
      `
    });

    const input = document.querySelector(
      '#newPlaylistName'
    );

    const cancelButton = document.querySelector(
      '[data-modal-cancel]'
    );

    const createButton = document.querySelector(
      '[data-modal-create-playlist]'
    );

    if (!input || !cancelButton || !createButton) {
      ModalService.close();
      return;
    }

    const createNewPlaylist = () => {
      const name = input.value.trim();

      if (!name) {
        input.focus();
        return;
      }

      const playlist =
        createPlaylist(name);

      if (!playlist) {
        input.focus();
        return;
      }

      ModalService.close();
      window.location.reload();
    };

    cancelButton.addEventListener(
      'click',
      () => {
        ModalService.close();
      }
    );

    createButton.addEventListener(
      'click',
      createNewPlaylist
    );

    input.addEventListener(
      'keydown',
      event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          createNewPlaylist();
        }

        if (event.key === 'Escape') {
          ModalService.close();
        }
      }
    );

    window.setTimeout(() => {
      input.focus();
    }, 0);
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

function bindRenamePlaylistButtons() {
  document
    .querySelectorAll('[data-playlist-rename]')
    .forEach(button => {
      button.addEventListener('click', () => {
        const playlistId = button.dataset.playlistRename;
        const currentName = button.dataset.playlistName;

        const newName = window.prompt(
          'Nuevo nombre de la playlist:',
          currentName
        );

        if (!newName) {
          return;
        }

        renamePlaylist(playlistId, newName);

        window.location.reload();
      });
    });
}

function bindDuplicatePlaylistButtons() {
  document
    .querySelectorAll('[data-playlist-duplicate]')
    .forEach(button => {
      button.addEventListener('click', () => {
        const playlistId =
          button.dataset.playlistDuplicate;

        const duplicate =
          duplicatePlaylist(playlistId);

        if (!duplicate) {
          window.alert(
            'No se pudo duplicar la playlist.'
          );

          return;
        }

        window.alert(
          `"${duplicate.name}" fue creada correctamente.`
        );

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

function bindExportPlaylistsButton() {
  const button = document.querySelector(
    '#export-playlists-button'
  );

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    const jsonText =
      exportPlaylists();

    const blob = new Blob(
      [jsonText],
      {
        type: 'application/json'
      }
    );

    const downloadUrl =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    const date =
      new Date()
        .toISOString()
        .slice(0, 10);

    link.href = downloadUrl;
    link.download =
      `cantico-de-fe-playlists-${date}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
  });
}

function bindImportPlaylistsButton() {
  const button = document.querySelector(
    '#import-playlists-button'
  );

  const fileInput = document.querySelector(
    '#import-playlists-file'
  );

  if (!button || !fileInput) {
    return;
  }

  button.addEventListener('click', () => {
    fileInput.value = '';
    fileInput.click();
  });

  fileInput.addEventListener(
    'change',
    async event => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const jsonText =
          await file.text();

        const result =
          importPlaylists(jsonText);

        window.alert(result.message);

        if (result.success) {
          window.location.reload();
        }
      } catch (error) {
        console.error(
          'No se pudo leer el archivo de playlists:',
          error
        );

        window.alert(
          'No se pudo leer el archivo seleccionado.'
        );
      }
    }
  );
}
