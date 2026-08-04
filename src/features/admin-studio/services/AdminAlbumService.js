/**
 * Cántico de Fe Music
 * V12.6 — Admin Album Service
 */

import { albumsData }
  from '../../albums-engine/data/albumsData.js';

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function createAdminData() {
  return {
    status: 'draft',
    published: false,
    createdAt:
      new Date().toISOString(),
    updatedAt:
      new Date().toISOString()
  };
}

function normalizeAlbum(
  album = {}
) {
  return {
    id:
      String(album.id || '')
        .trim(),

    title:
      String(album.title || '')
        .trim(),

    description:
      String(
        album.description || ''
      ).trim(),

    year:
      Number(
        album.year ||
        new Date().getFullYear()
      ),

    cover:
      String(
        album.cover || ''
      ).trim(),

    hymnIds:
      Array.isArray(
        album.hymnIds
      )
        ? [...album.hymnIds]
        : [],

    credits: {
      author:
        album.credits?.author ||
        'Cántico de Fe Music',

      composer:
        album.credits?.composer ||
        'Cántico de Fe Music',

      arranger:
        album.credits?.arranger ||
        'Cántico de Fe Music',

      performer:
        album.credits?.performer ||
        'Cántico de Fe Music'
    },

    admin:
      album.admin ||
      createAdminData()
  };
}

let albums =
  albumsData.map(
    normalizeAlbum
  );

const AdminAlbumService = {

  list() {
    return clone(albums);
  },

  findById(id) {
    return clone(
      albums.find(
        album =>
          album.id === id
      ) || null
    );
  },

  exists(id) {
    return albums.some(
      album =>
        album.id === id
    );
  },

  save(album) {
    const normalized =
      normalizeAlbum(album);

    const index =
      albums.findIndex(
        item =>
          item.id ===
          normalized.id
      );

    if (index >= 0) {
      normalized.admin.createdAt =
        albums[index]
          .admin.createdAt;

      normalized.admin.updatedAt =
        new Date()
          .toISOString();

      albums[index] =
        normalized;

      return clone(
        normalized
      );
    }

    albums.push(
      normalized
    );

    return clone(
      normalized
    );
  },

  remove(id) {
    albums =
      albums.filter(
        album =>
          album.id !== id
      );
  },

  duplicate(id) {

    const album =
      this.findById(id);

    if (!album) {
      return null;
    }

    let suffix = 2;

    let newId =
      `${album.id}-${suffix}`;

    while (
      this.exists(newId)
    ) {
      suffix++;

      newId =
        `${album.id}-${suffix}`;
    }

    const copy = {
      ...album,

      id: newId,

      title:
        `${album.title} (Copia)`,

      admin:
        createAdminData()
    };

    this.save(copy);

    return copy;
  }

};

export default AdminAlbumService;
