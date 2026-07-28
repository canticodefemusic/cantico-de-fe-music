import RecommendationService from './services/RecommendationService.js';

import {
  hymnCatalog
} from '../hymn-library-engine/index.js';

import {
  getFavorites
} from '../favorites-engine/index.js';

import {
  HistoryService
} from '../history-engine/index.js';

import {
  getPlaylists
} from '../playlist-engine/services/playlistService.js';

const RecommendationEngine = {
  getRecommendations(limit = 8) {
    const data = {
      favorites: getFavorites(),
      history: HistoryService.getHistory(),
      playlists: getPlaylists()
    };

    const recommendations = RecommendationService.recommend(
      hymnCatalog,
      data
    );

    return recommendations
      .filter(hymn => hymn.recommendationScore > 0)
      .slice(0, limit);
  },

  getRecommendationScore(hymn) {
    const data = {
      favorites: getFavorites(),
      history: HistoryService.getHistory(),
      playlists: getPlaylists()
    };

    return RecommendationService.score(hymn, data);
  }
};

export default RecommendationEngine;
