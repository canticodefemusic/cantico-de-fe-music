const RecommendationService = {
  score(hymn, { favorites = [], history = [], playlists = [] } = {}) {
    let points = 0;

    const id = hymn.id;

    // Favoritos
    if (favorites.includes(id)) {
      points += 5;
    }

    // Historial
    const historyItem = history.find(item => item.id === id);

    if (historyItem) {
      points += historyItem.playCount * 3;
    }

    // Playlists
    const playlistUses = playlists.reduce((count, playlist) => {
      if (playlist.hymns?.includes(id)) {
        return count + 1;
      }

      return count;
    }, 0);

    points += playlistUses * 2;

    return points;
  },

  recommend(hymns, data) {
    return [...hymns]
      .map(hymn => ({
        ...hymn,
        recommendationScore: this.score(hymn, data)
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  }
};

export default RecommendationService;
