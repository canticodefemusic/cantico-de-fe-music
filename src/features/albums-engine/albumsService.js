import { albumsData } from '../data/albumsData.js';

export function getAlbums() {
  return albumsData;
}

export function getAlbumById(albumId) {
  return albumsData.find(album => album.id === albumId) ?? null;
}

export function getAlbumHymns(albumId) {
  const album = getAlbumById(albumId);

  if (!album) {
    return [];
  }

  return album.hymnIds;
}
