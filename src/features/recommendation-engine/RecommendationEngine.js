import RecommendationService from './services/RecommendationService.js';

import { hymnCatalog } from '../hymn-library-engine/data/hymnCatalog.js';
import { getFavorites } from '../favorites-engine/services/favoritesService.js';
import HistoryService from '../history-engine/services/HistoryService.js';
import { getPlaylists } from '../playlist-engine/services/playlistsService.js';

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
