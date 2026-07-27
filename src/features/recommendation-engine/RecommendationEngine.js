import RecommendationService from './services/RecommendationService.js';

const RecommendationEngine = {
  getRecommendations(hymns = [], data = {}, limit = 8) {
    if (!Array.isArray(hymns)) {
      return [];
    }

    const recommendations = RecommendationService.recommend(hymns, data);

    return recommendations
      .filter(hymn => hymn.recommendationScore > 0)
      .slice(0, limit);
  },

  getRecommendationScore(hymn, data = {}) {
    return RecommendationService.score(hymn, data);
  }
};

export default RecommendationEngine;
