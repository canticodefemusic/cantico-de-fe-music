/**
 * V9.0.4 Collections Engine
 * CollectionService
 *
 * Convierte el catálogo de himnos en colecciones reutilizables.
 */

const DEFAULT_COVER = '/assets/images/default-social-cover.png';

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .trim();
}

function createSlug(value = '') {
  return normalizeText(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getHymnCover(hymn = {}) {
  return (
    hymn.cover ||
    hymn.image ||
    hymn.thumbnail ||
    hymn.socialImage ||
    DEFAULT_COVER
  );
}

function getHymnDate(hymn = {}) {
  const rawDate =
    hymn.createdAt ||
    hymn.publishedAt ||
    hymn.releaseDate ||
    hymn.date ||
    '';

  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function getPlayCount(hymn = {}) {
  const value =
    hymn.playCount ??
    hymn.plays ??
    hymn.statistics?.plays ??
    hymn.stats?.plays ??
    0;

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : 0;
}

function normalizeCollectionValue(value) {
  if (Array.isArray(value)) {
    return value
      .map(item => String(item).trim())
      .filter(Boolean);
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  return [String(value).trim()].filter(Boolean);
}

function createCollection({
  id,
  title,
  type,
  cover = DEFAULT_COVER,
  hymns = [],
  metadata = {}
}) {
  return {
    id,
    title,
    type,
    cover,
    count: hymns.length,
    hymns,
    metadata
  };
}

function sortCollectionsByTitle(collections = []) {
  return [...collections].sort((a, b) =>
    a.title.localeCompare(b.title, 'es', {
      sensitivity: 'base'
    })
  );
}

function groupByField(hymns = [], field, options = {}) {
  const {
    type = field,
    fallbackTitle = 'Sin clasificar',
    includeEmpty = false
  } = options;

  const groups = new Map();

  hymns.forEach(hymn => {
    const values = normalizeCollectionValue(hymn[field]);

    if (!values.length && includeEmpty) {
      values.push(fallbackTitle);
    }

    values.forEach(value => {
      const key = normalizeText(value);

      if (!key) return;

      if (!groups.has(key)) {
        groups.set(key, {
          title: value,
          hymns: []
        });
      }

      groups.get(key).hymns.push(hymn);
    });
  });

  const collections = Array.from(groups.values()).map(group => {
    const firstHymn = group.hymns[0];

    return createCollection({
      id: `${type}-${createSlug(group.title)}`,
      title: group.title,
      type,
      cover: getHymnCover(firstHymn),
      hymns: group.hymns,
      metadata: {
        field,
        value: group.title
      }
    });
  });

  return sortCollectionsByTitle(collections);
}

export const CollectionService = {
  /**
   * Crea colecciones agrupadas por cualquier campo.
   */
  groupBy(hymns = [], field, options = {}) {
    if (!Array.isArray(hymns)) {
      console.warn(
        '[CollectionService] Se esperaba un arreglo de himnos.'
      );

      return [];
    }

    if (!field) {
      console.warn(
        '[CollectionService] Debes proporcionar un campo para agrupar.'
      );

      return [];
    }

    return groupByField(hymns, field, options);
  },

  /**
   * Colecciones por álbum.
   */
  getAlbums(hymns = []) {
    return groupByField(hymns, 'album', {
      type: 'album',
      fallbackTitle: 'Sin álbum'
    });
  },

  /**
   * Colecciones por autor.
   */
  getAuthors(hymns = []) {
    return groupByField(hymns, 'author', {
      type: 'author',
      fallbackTitle: 'Autor desconocido'
    });
  },

  /**
   * Colecciones por categoría.
   */
  getCategories(hymns = []) {
    return groupByField(hymns, 'category', {
      type: 'category',
      fallbackTitle: 'Sin categoría'
    });
  },

  /**
   * Colecciones por tema.
   *
   * Admite:
   * theme: "Fe"
   *
   * o:
   * theme: ["Fe", "Esperanza"]
   */
  getThemes(hymns = []) {
    return groupByField(hymns, 'theme', {
      type: 'theme',
      fallbackTitle: 'Sin tema'
    });
  },

  /**
   * Colecciones por año.
   */
  getYears(hymns = []) {
    const collections = groupByField(hymns, 'year', {
      type: 'year',
      fallbackTitle: 'Año desconocido'
    });

    return collections.sort((a, b) => {
      const yearA = Number(a.title) || 0;
      const yearB = Number(b.title) || 0;

      return yearB - yearA;
    });
  },

  /**
   * Colecciones por serie.
   */
  getSeries(hymns = []) {
    return groupByField(hymns, 'series', {
      type: 'series',
      fallbackTitle: 'Sin serie'
    });
  },

  /**
   * Colecciones por libro o referencia bíblica.
   */
  getScriptureBooks(hymns = []) {
    return groupByField(hymns, 'book', {
      type: 'book',
      fallbackTitle: 'Sin libro bíblico'
    });
  },

  /**
   * Himnos recientes.
   */
  getRecent(hymns = [], limit = 12) {
    const recentHymns = [...hymns]
      .map(hymn => ({
        hymn,
        date: getHymnDate(hymn)
      }))
      .filter(item => item.date)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit)
      .map(item => item.hymn);

    if (!recentHymns.length) {
      return null;
    }

    return createCollection({
      id: 'system-recent',
      title: 'Himnos recientes',
      type: 'recent',
      cover: getHymnCover(recentHymns[0]),
      hymns: recentHymns,
      metadata: {
        limit
      }
    });
  },

  /**
   * Himnos más reproducidos.
   */
  getPopular(hymns = [], limit = 12) {
    const popularHymns = [...hymns]
      .filter(hymn => getPlayCount(hymn) > 0)
      .sort((a, b) => getPlayCount(b) - getPlayCount(a))
      .slice(0, limit);

    if (!popularHymns.length) {
      return null;
    }

    return createCollection({
      id: 'system-popular',
      title: 'Más reproducidos',
      type: 'popular',
      cover: getHymnCover(popularHymns[0]),
      hymns: popularHymns,
      metadata: {
        limit
      }
    });
  },

  /**
   * Crea una colección manual.
   *
   * Esta función será reutilizada posteriormente por:
   * - Favorites Engine
   * - History Engine
   * - Recommendation Engine
   */
  create({
    id,
    title,
    type = 'custom',
    cover,
    hymns = [],
    metadata = {}
  }) {
    if (!id || !title) {
      console.warn(
        '[CollectionService] La colección necesita id y title.'
      );

      return null;
    }

    return createCollection({
      id,
      title,
      type,
      cover: cover || getHymnCover(hymns[0]),
      hymns,
      metadata
    });
  },

  /**
   * Busca una colección por ID.
   */
  findById(collections = [], collectionId = '') {
    return (
      collections.find(collection => collection.id === collectionId) ||
      null
    );
  },

  /**
   * Busca colecciones por título.
   */
  search(collections = [], term = '') {
    const normalizedTerm = normalizeText(term);

    if (!normalizedTerm) {
      return collections;
    }

    return collections.filter(collection => {
      const title = normalizeText(collection.title);
      const type = normalizeText(collection.type);

      return (
        title.includes(normalizedTerm) ||
        type.includes(normalizedTerm)
      );
    });
  }
};

export default CollectionService;
