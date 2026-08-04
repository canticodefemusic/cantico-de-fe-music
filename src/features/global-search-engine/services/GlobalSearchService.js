/**
 * Cántico de Fe Music
 * V11.1 — Global Search Service
 */

import {
  searchGroups
} from '../../smart-search-engine/index.js';

import {
  hymnCatalog
} from '../../hymn-library-engine/data/hymnCatalog.js';

import {
  getPlaylists
} from '../../playlist-engine/index.js';

import {
  getFavorites
} from '../../favorites-engine/index.js';

import {
  HistoryService
} from '../../history-engine/index.js';

import {
  RecommendationEngine
} from '../../recommendation-engine/index.js';

import {
  devotionals
} from '../../../app/data/devotionalsData.js';

function findHymnById(hymnId) {
  return hymnCatalog.find(
    hymn => hymn.id === hymnId
  ) || null;
}

function normalizeHymnResult(
  hymn,
  source = 'himnos'
) {
  if (!hymn?.id) {
    return null;
  }

  return {
    ...hymn,
    resultType: 'hymn',
    source,
    href:
      `/?page=himnos&id=${encodeURIComponent(
        hymn.id
      )}`
  };
}

function getHymnResults() {
  return hymnCatalog
    .map(hymn =>
      normalizeHymnResult(
        hymn,
        'himnos'
      )
    )
    .filter(Boolean);
}

function getPlaylistResults() {
  return getPlaylists()
    .filter(playlist => playlist?.id)
    .map(playlist => ({
      ...playlist,
      title:
        playlist.name ||
        'Playlist sin nombre',
      description:
        'Playlist personal de himnos.',
      category: 'playlist',
      resultType: 'playlist',
      source: 'playlists',
      href:
        `/?page=playlists&id=${encodeURIComponent(
          playlist.id
        )}`
    }));
}

function getFavoriteResults() {
  return getFavorites()
    .map(hymnId =>
      findHymnById(hymnId)
    )
    .filter(Boolean)
    .map(hymn =>
      normalizeHymnResult(
        hymn,
        'favoritos'
      )
    );
}

function getHistoryResults() {
  return HistoryService
    .getHistory()
    .map(historyItem => {
      const hymn =
        findHymnById(
          historyItem.id
        );

      if (!hymn) {
        return null;
      }

      return {
        ...normalizeHymnResult(
          hymn,
          'historial'
        ),

        playCount:
          Number(
            historyItem.playCount
          ) || 0,

        lastPlayed:
          historyItem.lastPlayed || null
      };
    })
    .filter(Boolean);
}

function getRecommendationResults() {
  return RecommendationEngine
    .getRecommendations(20)
    .map(hymn =>
      normalizeHymnResult(
        hymn,
        'recomendados'
      )
    )
    .filter(Boolean);
}

function getDevotionalResults() {
  return devotionals
    .filter(devotional => devotional?.id)
    .map(devotional => ({
      ...devotional,
      description:
        devotional.content || '',
      category: 'devocional',
      resultType: 'devotional',
      source: 'devocionales',
      href:
        `/?page=devocionales&id=${encodeURIComponent(
          devotional.id
        )}`
    }));
}

function createSearchGroups() {
  return {
    hymns:
      getHymnResults(),

    playlists:
      getPlaylistResults(),

    favorites:
      getFavoriteResults(),

    history:
      getHistoryResults(),

    recommendations:
      getRecommendationResults(),

    devotionals:
      getDevotionalResults()
  };
}

const GlobalSearchService = {
  getGroups() {
    return createSearchGroups();
  },

  search(
    query = '',
    {
      limitPerGroup = 6,
      includeEmpty = false
    } = {}
  ) {
    const cleanQuery =
      String(query || '').trim();

    if (!cleanQuery) {
      return {};
    }

    return searchGroups(
      createSearchGroups(),
      cleanQuery,
      {
        limitPerGroup,
        includeEmpty
      }
    );
  },

  hasResults(results = {}) {
    return Object
      .values(results)
      .some(
        items =>
          Array.isArray(items) &&
          items.length > 0
      );
  },

  getResultCount(results = {}) {
    return Object
      .values(results)
      .reduce(
        (total, items) =>
          total +
          (
            Array.isArray(items)
              ? items.length
              : 0
          ),
        0
      );
  }
};

export default GlobalSearchService;
