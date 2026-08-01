const DEFAULT_LIMIT = 12;

function toSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function normalizeTags(tags) {
  return toSafeArray(tags)
    .map(tag => normalizeText(tag))
    .filter(Boolean);
}

function getHistoryPlayCount(historyItem) {
  const value =
    historyItem?.playCount ??
    historyItem?.plays ??
    historyItem?.count ??
    0;

  const count = Number(value);

  return Number.isFinite(count) && count > 0
    ? count
    : 0;
}

function getPlaylistHymnIds(playlist) {
  if (Array.isArray(playlist?.hymnIds)) {
    return playlist.hymnIds;
  }

  if (Array.isArray(playlist?.hymns)) {
    return playlist.hymns
      .map(hymn =>
        typeof hymn === 'string'
          ? hymn
          : hymn?.id
      )
      .filter(Boolean);
  }

  return [];
}

function countSharedTags(hymn, currentHymn) {
  const hymnTags =
    new Set(normalizeTags(hymn?.tags));

  const currentTags =
    normalizeTags(currentHymn?.tags);

  return currentTags.reduce(
    (count, tag) =>
      hymnTags.has(tag)
        ? count + 1
        : count,
    0
  );
}

const RecommendationService = {
  score(
    hymn,
    {
      favorites = [],
      history = [],
      playlists = [],
      currentHymn = null
    } = {}
  ) {
    if (!hymn?.id) {
      return 0;
    }

    let points = 0;

    const id = hymn.id;

    const safeFavorites =
      toSafeArray(favorites);

    const safeHistory =
      toSafeArray(history);

    const safePlaylists =
      toSafeArray(playlists);

    /*
     * Favoritos:
     * Son una señal fuerte de preferencia.
     */
    if (safeFavorites.includes(id)) {
      points += 20;
    }

    /*
     * Historial:
     * Cada reproducción agrega puntos,
     * pero se limita para evitar que un solo
     * himno domine siempre las recomendaciones.
     */
    const historyItem =
      safeHistory.find(item => item?.id === id);

    const playCount =
      getHistoryPlayCount(historyItem);

    points += Math.min(playCount, 20) * 3;

    /*
     * Playlists:
     * Un himno presente en varias playlists
     * recibe una puntuación adicional.
     */
    const playlistUses =
      safePlaylists.reduce(
        (count, playlist) => {
          const hymnIds =
            getPlaylistHymnIds(playlist);

          return hymnIds.includes(id)
            ? count + 1
            : count;
        },
        0
      );

    points += playlistUses * 8;

    /*
     * Similitud con el himno actual.
     * Solo se aplica cuando la vista proporciona
     * currentHymn.
     */
    if (
      currentHymn?.id &&
      currentHymn.id !== id
    ) {
      const hymnAlbum =
        normalizeText(hymn.album);

      const currentAlbum =
        normalizeText(currentHymn.album);

      if (
        hymnAlbum &&
        hymnAlbum === currentAlbum
      ) {
        points += 8;
      }

      const hymnCategory =
        normalizeText(hymn.category);

      const currentCategory =
        normalizeText(currentHymn.category);

      if (
        hymnCategory &&
        hymnCategory === currentCategory
      ) {
        points += 12;
      }

      const hymnArtist =
        normalizeText(hymn.artist);

      const currentArtist =
        normalizeText(currentHymn.artist);

      if (
        hymnArtist &&
        hymnArtist === currentArtist
      ) {
        points += 4;
      }

      const sharedTags =
        countSharedTags(hymn, currentHymn);

      points += sharedTags * 6;
    }

    return points;
  },

  recommend(
    hymns = [],
    data = {},
    options = {}
  ) {
    const safeHymns =
      toSafeArray(hymns);

    const limit =
      Number.isFinite(Number(options.limit))
        ? Math.max(1, Number(options.limit))
        : DEFAULT_LIMIT;

    const currentHymnId =
      options.currentHymnId ??
      data?.currentHymn?.id ??
      null;

    return safeHymns
      .map((hymn, originalIndex) => ({
        ...hymn,
        recommendationScore:
          this.score(hymn, data),
        recommendationOrder:
          originalIndex
      }))
      .filter(
        hymn =>
          !currentHymnId ||
          hymn.id !== currentHymnId
      )
      .sort((a, b) => {
        const scoreDifference =
          b.recommendationScore -
          a.recommendationScore;

        if (scoreDifference !== 0) {
          return scoreDifference;
        }

        return (
          a.recommendationOrder -
          b.recommendationOrder
        );
      })
      .slice(0, limit)
      .map(
        ({
          recommendationOrder,
          ...hymn
        }) => hymn
      );
  }
};

export default RecommendationService;
