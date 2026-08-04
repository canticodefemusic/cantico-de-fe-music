/**
 * Cántico de Fe Music
 * V12.6 — Admin Official Playlist Service
 */

import {
  officialPlaylistsData
} from '../../playlist-engine/data/officialPlaylistsData.js';

import createAdminContentService
  from '../core/createAdminContentService.js';

function normalizeText(value = '') {
  return String(
    value ?? ''
  ).trim();
}

function normalizeHymnIds(
  hymnIds = []
) {
  if (!Array.isArray(hymnIds)) {
    return [];
  }

  return [
    ...new Set(
      hymnIds
        .map(hymnId =>
          normalizeText(
            hymnId
          )
        )
        .filter(Boolean)
    )
  ];
}

function normalizeOrder(value) {
  const parsed =
    Number.parseInt(
      value,
      10
    );

  if (
    Number.isNaN(parsed) ||
    parsed < 0
  ) {
    return 0;
  }

  return parsed;
}

function normalizeOfficialPlaylist(
  playlist = {}
) {
  return {
    id:
      normalizeText(
        playlist.id
      ),

    title:
      normalizeText(
        playlist.title ||
        playlist.name
      ),

    description:
      normalizeText(
        playlist.description
      ),

    cover:
      normalizeText(
        playlist.cover ||
        '/assets/images/default-social-cover.png'
      ),

    hymnIds:
      normalizeHymnIds(
        playlist.hymnIds
      ),

    featured:
      Boolean(
        playlist.featured
      ),

    order:
      normalizeOrder(
        playlist.order
      ),

    admin:
      playlist.admin
  };
}

function createPlaylistDefaults() {
  return {
    title: '',
    description: '',
    cover:
      '/assets/images/default-social-cover.png',
    hymnIds: [],
    featured: false,
    order: 0
  };
}

const AdminOfficialPlaylistService =
  createAdminContentService({
    module:
      'official-playlists',

    catalog:
      officialPlaylistsData,

    normalizeItem:
      normalizeOfficialPlaylist,

    createDefaults:
      createPlaylistDefaults,

    searchFields: [
      'title',
      'description',
      'hymnIds'
    ],

    titleField:
      'title',

    sortField:
      'title',

    fallbackPrefix:
      'playlist',

    duplicateLabel:
      'Copia'
  });

export {
  normalizeOfficialPlaylist,
  createPlaylistDefaults
};

export default AdminOfficialPlaylistService;
