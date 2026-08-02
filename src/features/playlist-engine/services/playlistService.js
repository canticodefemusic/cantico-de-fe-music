const STORAGE_KEY = 'cantico:playlists';

function createId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return [
    'playlist',
    Date.now(),
    Math.random()
      .toString(16)
      .slice(2)
  ].join('-');
}

function normalizeHymnIds(hymnIds = []) {
  if (!Array.isArray(hymnIds)) {
    return [];
  }

  return [
    ...new Set(
      hymnIds.filter(
        hymnId =>
          typeof hymnId === 'string' &&
          hymnId.trim()
      )
    )
  ];
}

function normalizePlaylist(playlist = {}) {
  const createdAt =
    playlist.createdAt ||
    new Date().toISOString();

  return {
    id:
      typeof playlist.id === 'string' &&
      playlist.id
        ? playlist.id
        : createId(),

    name:
      typeof playlist.name === 'string' &&
      playlist.name.trim()
        ? playlist.name.trim()
        : 'Playlist sin nombre',

    hymnIds:
      normalizeHymnIds(
        playlist.hymnIds
      ),

    createdAt,

    updatedAt:
      playlist.updatedAt ||
      createdAt
  };
}

function normalizePlaylists(playlists = []) {
  if (!Array.isArray(playlists)) {
    return [];
  }

  return playlists.map(
    normalizePlaylist
  );
}

function savePlaylists(playlists) {
  const normalizedPlaylists =
    normalizePlaylists(playlists);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizedPlaylists)
  );

  return normalizedPlaylists;
}

export function getPlaylists() {
  try {
    const savedPlaylists =
      localStorage.getItem(STORAGE_KEY);

    if (!savedPlaylists) {
      return [];
    }

    const playlists =
      JSON.parse(savedPlaylists);

    return normalizePlaylists(playlists);
  } catch (error) {
    console.error(
      'No se pudieron cargar las playlists:',
      error
    );

    return [];
  }
}

export function createPlaylist(name) {
  const cleanName =
    String(name || '').trim();

  if (!cleanName) {
    return null;
  }

  const playlists =
    getPlaylists();

  const now =
    new Date().toISOString();

  const newPlaylist = {
    id: createId(),
    name: cleanName,
    hymnIds: [],
    createdAt: now,
    updatedAt: now
  };

  playlists.push(newPlaylist);
  savePlaylists(playlists);

  return newPlaylist;
}

export function renamePlaylist(
  playlistId,
  newName
) {
  const cleanName =
    String(newName || '').trim();

  if (!cleanName) {
    return null;
  }

  const now =
    new Date().toISOString();

  const playlists =
    getPlaylists();

  const updatedPlaylists =
    playlists.map(playlist => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      return {
        ...playlist,
        name: cleanName,
        updatedAt: now
      };
    });

  return savePlaylists(
    updatedPlaylists
  );
}

export function deletePlaylist(
  playlistId
) {
  const playlists =
    getPlaylists();

  const updatedPlaylists =
    playlists.filter(
      playlist =>
        playlist.id !== playlistId
    );

  return savePlaylists(
    updatedPlaylists
  );
}

export function addHymnToPlaylist(
  playlistId,
  hymnId
) {
  if (!hymnId) {
    return getPlaylists();
  }

  const now =
    new Date().toISOString();

  const playlists =
    getPlaylists();

  const updatedPlaylists =
    playlists.map(playlist => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      if (
        playlist.hymnIds.includes(hymnId)
      ) {
        return playlist;
      }

      return {
        ...playlist,
        hymnIds: [
          ...playlist.hymnIds,
          hymnId
        ],
        updatedAt: now
      };
    });

  return savePlaylists(
    updatedPlaylists
  );
}

export function removeHymnFromPlaylist(
  playlistId,
  hymnId
) {
  const now =
    new Date().toISOString();

  const playlists =
    getPlaylists();

  const updatedPlaylists =
    playlists.map(playlist => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      return {
        ...playlist,
        hymnIds:
          playlist.hymnIds.filter(
            id => id !== hymnId
          ),
        updatedAt: now
      };
    });

  return savePlaylists(
    updatedPlaylists
  );
}

export function isHymnInPlaylist(
  playlistId,
  hymnId
) {
  const playlist =
    getPlaylists().find(
      item => item.id === playlistId
    );

  if (!playlist) {
    return false;
  }

  return playlist.hymnIds.includes(
    hymnId
  );
}

export function duplicatePlaylist(
  playlistId
) {
  const playlists =
    getPlaylists();

  const original =
    playlists.find(
      playlist =>
        playlist.id === playlistId
    );

  if (!original) {
    return null;
  }

  const now =
    new Date().toISOString();

  const duplicate = {
    ...original,
    id: createId(),
    name: `${original.name} (copia)`,
    hymnIds: [...original.hymnIds],
    createdAt: now,
    updatedAt: now
  };

  playlists.push(duplicate);
  savePlaylists(playlists);

  return duplicate;
}

export function exportPlaylists() {
  const backup = {
    app: 'Cántico de Fe Music',
    version: 1,
    exportedAt:
      new Date().toISOString(),
    playlists: getPlaylists()
  };

  return JSON.stringify(
    backup,
    null,
    2
  );
}

export function importPlaylists(
  jsonText,
  {
    replace = false
  } = {}
) {
  try {
    const parsed =
      JSON.parse(jsonText);

    const importedPlaylists =
      Array.isArray(parsed)
        ? parsed
        : parsed?.playlists;

    if (
      !Array.isArray(importedPlaylists)
    ) {
      return {
        success: false,
        imported: 0,
        message:
          'El archivo no contiene playlists válidas.'
      };
    }

    const normalizedImports =
      normalizePlaylists(
        importedPlaylists
      ).map(playlist => ({
        ...playlist,
        id: createId(),
        updatedAt:
          new Date().toISOString()
      }));

    const currentPlaylists =
      replace
        ? []
        : getPlaylists();

    savePlaylists([
      ...currentPlaylists,
      ...normalizedImports
    ]);

    return {
      success: true,
      imported:
        normalizedImports.length,
      message:
        'Las playlists fueron importadas correctamente.'
    };
  } catch (error) {
    console.error(
      'No se pudieron importar las playlists:',
      error
    );

    return {
      success: false,
      imported: 0,
      message:
        'El archivo seleccionado no es válido.'
    };
  }
}
