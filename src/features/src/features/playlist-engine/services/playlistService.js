const STORAGE_KEY = 'cantico:playlists';

function savePlaylists(playlists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}

export function getPlaylists() {
  try {
    const savedPlaylists = localStorage.getItem(STORAGE_KEY);

    if (!savedPlaylists) {
      return [];
    }

    const playlists = JSON.parse(savedPlaylists);

    return Array.isArray(playlists) ? playlists : [];
  } catch (error) {
    console.error('No se pudieron cargar las playlists:', error);
    return [];
  }
}

export function createPlaylist(name) {
  const cleanName = name.trim();

  if (!cleanName) {
    return null;
  }

  const playlists = getPlaylists();

  const newPlaylist = {
    id: crypto.randomUUID(),
    name: cleanName,
    hymnIds: [],
    createdAt: new Date().toISOString()
  };

  playlists.push(newPlaylist);
  savePlaylists(playlists);

  return newPlaylist;
}

export function deletePlaylist(playlistId) {
  const playlists = getPlaylists();
  const updatedPlaylists = playlists.filter(
    playlist => playlist.id !== playlistId
  );

  savePlaylists(updatedPlaylists);

  return updatedPlaylists;
}

export function addHymnToPlaylist(playlistId, hymnId) {
  const playlists = getPlaylists();

  const updatedPlaylists = playlists.map(playlist => {
    if (playlist.id !== playlistId) {
      return playlist;
    }

    if (playlist.hymnIds.includes(hymnId)) {
      return playlist;
    }

    return {
      ...playlist,
      hymnIds: [...playlist.hymnIds, hymnId]
    };
  });

  savePlaylists(updatedPlaylists);

  return updatedPlaylists;
}

export function removeHymnFromPlaylist(playlistId, hymnId) {
  const playlists = getPlaylists();

  const updatedPlaylists = playlists.map(playlist => {
    if (playlist.id !== playlistId) {
      return playlist;
    }

    return {
      ...playlist,
      hymnIds: playlist.hymnIds.filter(id => id !== hymnId)
    };
  });

  savePlaylists(updatedPlaylists);

  return updatedPlaylists;
}

export function isHymnInPlaylist(playlistId, hymnId) {
  const playlist = getPlaylists().find(item => item.id === playlistId);

  if (!playlist) {
    return false;
  }

  return playlist.hymnIds.includes(hymnId);
}
