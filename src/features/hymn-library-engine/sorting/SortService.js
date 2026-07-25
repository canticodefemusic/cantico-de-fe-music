/**
 * V9.0.5 Sort Engine
 * SortService
 *
 * Ordena himnos y colecciones sin modificar
 * los arreglos originales.
 */

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .trim();
}

function getNumericValue(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function getDateValue(item = {}) {
  const rawDate =
    item.createdAt ||
    item.publishedAt ||
    item.releaseDate ||
    item.date ||
    '';

  const date = new Date(rawDate);

  return Number.isNaN(date.getTime())
    ? 0
    : date.getTime();
}

function getTitle(item = {}) {
  return normalizeText(
    item.title ||
    item.name ||
    ''
  );
}

function getAuthor(item = {}) {
  return normalizeText(
    item.author ||
    ''
  );
}

function getAlbum(item = {}) {
  return normalizeText(
    item.album ||
    ''
  );
}

function getCategory(item = {}) {
  return normalizeText(
    item.category ||
    ''
  );
}

function getYear(item = {}) {
  return getNumericValue(
    item.year,
    0
  );
}

function getDuration(item = {}) {
  return getNumericValue(
    item.durationSeconds ??
    item.duration ??
    0,
    0
  );
}

function getPlayCount(item = {}) {
  return getNumericValue(
    item.playCount ??
    item.plays ??
    item.statistics?.plays ??
    item.stats?.plays ??
    0,
    0
  );
}

function getViewCount(item = {}) {
  return getNumericValue(
    item.viewCount ??
    item.views ??
    item.statistics?.views ??
    item.stats?.views ??
    0,
    0
  );
}

function getShareCount(item = {}) {
  return getNumericValue(
    item.shareCount ??
    item.shares ??
    item.statistics?.shares ??
    item.stats?.shares ??
    0,
    0
  );
}

function getDownloadCount(item = {}) {
  return getNumericValue(
    item.downloadCount ??
    item.downloads ??
    item.statistics?.downloads ??
    item.stats?.downloads ??
    0,
    0
  );
}

function compareText(valueA, valueB) {
  return valueA.localeCompare(
    valueB,
    'es',
    {
      sensitivity: 'base'
    }
  );
}

function shuffle(items = []) {
  const shuffledItems = [...items];

  for (
    let index = shuffledItems.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [
      shuffledItems[index],
      shuffledItems[randomIndex]
    ] = [
      shuffledItems[randomIndex],
      shuffledItems[index]
    ];
  }

  return shuffledItems;
}

const sortStrategies = {
  'title-asc': (a, b) =>
    compareText(getTitle(a), getTitle(b)),

  'title-desc': (a, b) =>
    compareText(getTitle(b), getTitle(a)),

  'author-asc': (a, b) =>
    compareText(getAuthor(a), getAuthor(b)),

  'author-desc': (a, b) =>
    compareText(getAuthor(b), getAuthor(a)),

  'album-asc': (a, b) =>
    compareText(getAlbum(a), getAlbum(b)),

  'album-desc': (a, b) =>
    compareText(getAlbum(b), getAlbum(a)),

  'category-asc': (a, b) =>
    compareText(
      getCategory(a),
      getCategory(b)
    ),

  'category-desc': (a, b) =>
    compareText(
      getCategory(b),
      getCategory(a)
    ),

  'year-desc': (a, b) =>
    getYear(b) - getYear(a),

  'year-asc': (a, b) =>
    getYear(a) - getYear(b),

  'date-desc': (a, b) =>
    getDateValue(b) - getDateValue(a),

  'date-asc': (a, b) =>
    getDateValue(a) - getDateValue(b),

  'plays-desc': (a, b) =>
    getPlayCount(b) - getPlayCount(a),

  'plays-asc': (a, b) =>
    getPlayCount(a) - getPlayCount(b),

  'views-desc': (a, b) =>
    getViewCount(b) - getViewCount(a),

  'views-asc': (a, b) =>
    getViewCount(a) - getViewCount(b),

  'shares-desc': (a, b) =>
    getShareCount(b) - getShareCount(a),

  'shares-asc': (a, b) =>
    getShareCount(a) - getShareCount(b),

  'downloads-desc': (a, b) =>
    getDownloadCount(b) - getDownloadCount(a),

  'downloads-asc': (a, b) =>
    getDownloadCount(a) - getDownloadCount(b),

  'duration-desc': (a, b) =>
    getDuration(b) - getDuration(a),

  'duration-asc': (a, b) =>
    getDuration(a) - getDuration(b)
};

export const SortService = {
  /**
   * Devuelve una lista ordenada.
   */
  sort(items = [], mode = 'title-asc') {
    if (!Array.isArray(items)) {
      console.warn(
        '[SortService] Se esperaba un arreglo.'
      );

      return [];
    }

    if (mode === 'random') {
      return shuffle(items);
    }

    const strategy = sortStrategies[mode];

    if (!strategy) {
      console.warn(
        `[SortService] Modo de orden no reconocido: ${mode}`
      );

      return [...items];
    }

    return [...items].sort(strategy);
  },

  /**
   * Devuelve los modos disponibles.
   */
  getModes() {
    return [
      'title-asc',
      'title-desc',
      'author-asc',
      'author-desc',
      'album-asc',
      'album-desc',
      'category-asc',
      'category-desc',
      'year-desc',
      'year-asc',
      'date-desc',
      'date-asc',
      'plays-desc',
      'plays-asc',
      'views-desc',
      'views-asc',
      'shares-desc',
      'shares-asc',
      'downloads-desc',
      'downloads-asc',
      'duration-desc',
      'duration-asc',
      'random'
    ];
  },

  /**
   * Verifica si un modo de orden existe.
   */
  isValidMode(mode = '') {
    return (
      mode === 'random' ||
      Object.prototype.hasOwnProperty.call(
        sortStrategies,
        mode
      )
    );
  },

  /**
   * Ordena los himnos internos de una colección.
   */
  sortCollection(
    collection = {},
    mode = 'title-asc'
  ) {
    return {
      ...collection,
      hymns: this.sort(
        collection.hymns || [],
        mode
      )
    };
  },

  /**
   * Ordena varias colecciones y también,
   * opcionalmente, sus himnos internos.
   */
  sortCollections(
    collections = [],
    {
      collectionMode = 'title-asc',
      hymnMode = null
    } = {}
  ) {
    const sortedCollections = this.sort(
      collections,
      collectionMode
    );

    if (!hymnMode) {
      return sortedCollections;
    }

    return sortedCollections.map(collection =>
      this.sortCollection(
        collection,
        hymnMode
      )
    );
  }
};

export default SortService;
