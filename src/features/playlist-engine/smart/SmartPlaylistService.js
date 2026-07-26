/**
 * V9.1.0 Smart Playlists
 * SmartPlaylistService
 *
 * Genera playlists automáticas mediante reglas,
 * sin modificar las playlists manuales del usuario.
 */

const SMART_PLAYLIST_TYPES = Object.freeze({
  FAVORITES: 'favorites',
  RECENT: 'recent',
  MOST_PLAYED: 'most-played',
  CATEGORY: 'category',
  AUTHOR: 'author',
  YEAR: 'year',
  KEYWORD: 'keyword'
});

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .trim();
}

function normalizeItems(items = []) {
  return Array.isArray(items)
    ? items.filter(Boolean)
    : [];
}

function getNumericValue(item, fields = []) {
  for (const field of fields) {
    const value = Number(item?.[field]);

    if (Number.isFinite(value)) {
      return value;
    }
  }

  return 0;
}

function getDateValue(item) {
  const possibleDates = [
    item?.publishedAt,
    item?.releaseDate,
    item?.createdAt,
    item?.updatedAt,
    item?.date
  ];

  for (const value of possibleDates) {
    const timestamp = Date.parse(value);

    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  return 0;
}

function getSearchableText(item = {}) {
  const tags = Array.isArray(item.tags)
    ? item.tags.join(' ')
    : item.tags || '';

  return normalizeText([
    item.title,
    item.author,
    item.album,
    item.category,
    item.description,
    item.scripture,
    tags
  ].filter(Boolean).join(' '));
}

function limitResults(items, limit) {
  const numericLimit = Number(limit);

  if (!Number.isInteger(numericLimit) || numericLimit <= 0) {
    return items;
  }

  return items.slice(0, numericLimit);
}

function createPlaylistResult({
  id,
  name,
  description = '',
  type,
  rule = {},
  hymns = []
}) {
  return {
    id,
    name,
    description,
    type,
    rule,
    hymnIds: hymns
      .map(hymn => hymn?.id)
      .filter(Boolean),
    hymns,
    automatic: true,
    generatedAt: new Date().toISOString()
  };
}

function generateFavorites(items, rule = {}) {
  const favoriteIds = new Set(
    Array.isArray(rule.favoriteIds)
      ? rule.favoriteIds
      : []
  );

  return items.filter(item =>
    favoriteIds.has(item.id)
  );
}

function generateRecent(items, rule = {}) {
  const sortedItems = [...items].sort(
    (first, second) =>
      getDateValue(second) -
      getDateValue(first)
  );

  return limitResults(
    sortedItems,
    rule.limit || 10
  );
}

function generateMostPlayed(items, rule = {}) {
  const sortedItems = [...items].sort(
    (first, second) =>
      getNumericValue(
        second,
        ['playCount', 'plays', 'reproductions']
      ) -
      getNumericValue(
        first,
        ['playCount', 'plays', 'reproductions']
      )
  );

  return limitResults(
    sortedItems,
    rule.limit || 10
  );
}

function generateByField(
  items,
  field,
  expectedValue
) {
  const normalizedExpected =
    normalizeText(expectedValue);

  if (!normalizedExpected) {
    return [];
  }

  return items.filter(item =>
    normalizeText(item?.[field]) ===
    normalizedExpected
  );
}

function generateByYear(items, expectedYear) {
  const normalizedYear =
    Number(expectedYear);

  if (!Number.isFinite(normalizedYear)) {
    return [];
  }

  return items.filter(item =>
    Number(item?.year) === normalizedYear
  );
}

function generateByKeyword(items, keyword) {
  const normalizedKeyword =
    normalizeText(keyword);

  if (!normalizedKeyword) {
    return [];
  }

  return items.filter(item =>
    getSearchableText(item).includes(
      normalizedKeyword
    )
  );
}

function generateHymns(items, type, rule = {}) {
  switch (type) {
    case SMART_PLAYLIST_TYPES.FAVORITES:
      return generateFavorites(items, rule);

    case SMART_PLAYLIST_TYPES.RECENT:
      return generateRecent(items, rule);

    case SMART_PLAYLIST_TYPES.MOST_PLAYED:
      return generateMostPlayed(items, rule);

    case SMART_PLAYLIST_TYPES.CATEGORY:
      return generateByField(
        items,
        'category',
        rule.value
      );

    case SMART_PLAYLIST_TYPES.AUTHOR:
      return generateByField(
        items,
        'author',
        rule.value
      );

    case SMART_PLAYLIST_TYPES.YEAR:
      return generateByYear(
        items,
        rule.value
      );

    case SMART_PLAYLIST_TYPES.KEYWORD:
      return generateByKeyword(
        items,
        rule.value
      );

    default:
      return [];
  }
}

export const SmartPlaylistService = {
  TYPES: SMART_PLAYLIST_TYPES,

  /**
   * Genera una playlist inteligente.
   */
  generate({
    id,
    name,
    description = '',
    type,
    rule = {},
    hymns = []
  } = {}) {
    const normalizedHymns =
      normalizeItems(hymns);

    if (!type || !this.isValidType(type)) {
      console.warn(
        '[SmartPlaylistService] Tipo de playlist no válido.'
      );

      return null;
    }

    const generatedHymns =
      generateHymns(
        normalizedHymns,
        type,
        rule
      );

    return createPlaylistResult({
      id:
        id ||
        `smart-${type}-${normalizeText(name || type)
          .replace(/\s+/g, '-')}`,
      name: name || 'Playlist inteligente',
      description,
      type,
      rule,
      hymns: generatedHymns
    });
  },

  /**
   * Genera varias playlists inteligentes.
   */
  generateAll(
    definitions = [],
    hymns = []
  ) {
    if (!Array.isArray(definitions)) {
      return [];
    }

    return definitions
      .map(definition =>
        this.generate({
          ...definition,
          hymns
        })
      )
      .filter(Boolean);
  },

  /**
   * Devuelve los tipos disponibles.
   */
  getTypes() {
    return {
      ...SMART_PLAYLIST_TYPES
    };
  },

  /**
   * Comprueba si el tipo está permitido.
   */
  isValidType(type) {
    return Object.values(
      SMART_PLAYLIST_TYPES
    ).includes(type);
  }
};

export default SmartPlaylistService;
