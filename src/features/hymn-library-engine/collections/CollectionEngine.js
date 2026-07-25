/**
 * V9.0.4 Collections Engine
 * CollectionEngine
 *
 * Coordina el catálogo, el servicio de colecciones
 * y el renderer.
 */

import CollectionService from './CollectionService.js';
import CollectionRenderer from './CollectionRenderer.js';

const engineInstances = new WeakMap();

function getContainer(target) {
  if (target instanceof Element) {
    return target;
  }

  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return null;
}

function normalizeHymns(hymns = []) {
  return Array.isArray(hymns) ? hymns : [];
}

function normalizeCollectionType(type = 'album') {
  const allowedTypes = [
    'album',
    'author',
    'category',
    'theme',
    'year',
    'series',
    'book',
    'recent',
    'popular'
  ];

  return allowedTypes.includes(type)
    ? type
    : 'album';
}

function getCollectionsByType(hymns = [], type = 'album', options = {}) {
  const normalizedType = normalizeCollectionType(type);

  switch (normalizedType) {
    case 'author':
      return CollectionService.getAuthors(hymns);

    case 'category':
      return CollectionService.getCategories(hymns);

    case 'theme':
      return CollectionService.getThemes(hymns);

    case 'year':
      return CollectionService.getYears(hymns);

    case 'series':
      return CollectionService.getSeries(hymns);

    case 'book':
      return CollectionService.getScriptureBooks(hymns);

    case 'recent': {
      const collection = CollectionService.getRecent(
        hymns,
        options.limit || 12
      );

      return collection ? [collection] : [];
    }

    case 'popular': {
      const collection = CollectionService.getPopular(
        hymns,
        options.limit || 12
      );

      return collection ? [collection] : [];
    }

    case 'album':
    default:
      return CollectionService.getAlbums(hymns);
  }
}

function getDefaultTitle(type = 'album') {
  const titles = {
    album: 'Álbumes',
    author: 'Autores',
    category: 'Categorías',
    theme: 'Temas',
    year: 'Años',
    series: 'Series',
    book: 'Libros bíblicos',
    recent: 'Himnos recientes',
    popular: 'Más reproducidos'
  };

  return titles[type] || 'Colecciones';
}

function getDefaultDescription(type = 'album') {
  const descriptions = {
    album: 'Explora los himnos organizados por álbum.',
    author: 'Encuentra himnos organizados por autor.',
    category: 'Explora la biblioteca por categoría.',
    theme: 'Descubre himnos según su tema principal.',
    year: 'Consulta los himnos organizados por año.',
    series: 'Explora los himnos agrupados por serie.',
    book: 'Encuentra himnos relacionados con libros bíblicos.',
    recent: 'Los himnos agregados más recientemente.',
    popular: 'Los himnos con más reproducciones.'
  };

  return descriptions[type] || '';
}

function createInstanceState({
  hymns = [],
  type = 'album',
  collections = [],
  options = {}
} = {}) {
  return {
    hymns,
    type,
    collections,
    options,
    initialized: true
  };
}

export const CollectionEngine = {
  /**
   * Inicializa una colección en un contenedor.
   */
  init({
    target,
    hymns = [],
    type = 'album',
    title,
    description,
    view = 'grid',
    limit = 12,
    onOpen = null
  } = {}) {
    const container = getContainer(target);

    if (!container) {
      console.warn(
        '[CollectionEngine] No se encontró el contenedor.'
      );

      return null;
    }

    const normalizedHymns = normalizeHymns(hymns);
    const normalizedType = normalizeCollectionType(type);

    CollectionRenderer.showLoading(container);

    const collections = getCollectionsByType(
      normalizedHymns,
      normalizedType,
      { limit }
    );

    const options = {
      id: `hymn-collections-${normalizedType}`,
      title: title || getDefaultTitle(normalizedType),
      description:
        description !== undefined
          ? description
          : getDefaultDescription(normalizedType),
      view,
      onOpen
    };

    CollectionRenderer.render(
      container,
      collections,
      options
    );

    const state = createInstanceState({
      hymns: normalizedHymns,
      type: normalizedType,
      collections,
      options
    });

    engineInstances.set(container, state);

    return {
      container,
      ...state
    };
  },

  /**
   * Cambia el tipo de colección mostrado.
   */
  setType(target, type = 'album', options = {}) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const currentState = engineInstances.get(container);

    if (!currentState) {
      console.warn(
        '[CollectionEngine] El motor no ha sido inicializado.'
      );

      return false;
    }

    const normalizedType = normalizeCollectionType(type);

    const collections = getCollectionsByType(
      currentState.hymns,
      normalizedType,
      {
        limit: options.limit || 12
      }
    );

    const nextOptions = {
      ...currentState.options,
      title:
        options.title ||
        getDefaultTitle(normalizedType),
      description:
        options.description !== undefined
          ? options.description
          : getDefaultDescription(normalizedType)
    };

    CollectionRenderer.render(
      container,
      collections,
      nextOptions
    );

    engineInstances.set(container, {
      ...currentState,
      type: normalizedType,
      collections,
      options: nextOptions
    });

    return true;
  },

  /**
   * Actualiza el catálogo de himnos.
   */
  setHymns(target, hymns = []) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const currentState = engineInstances.get(container);

    if (!currentState) {
      return false;
    }

    const normalizedHymns = normalizeHymns(hymns);

    const collections = getCollectionsByType(
      normalizedHymns,
      currentState.type,
      {
        limit: currentState.options.limit || 12
      }
    );

    CollectionRenderer.updateCollections(
      container,
      collections
    );

    engineInstances.set(container, {
      ...currentState,
      hymns: normalizedHymns,
      collections
    });

    return true;
  },

  /**
   * Refresca las colecciones usando el estado actual.
   */
  refresh(target) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const currentState = engineInstances.get(container);

    if (!currentState) {
      return false;
    }

    const collections = getCollectionsByType(
      currentState.hymns,
      currentState.type,
      {
        limit: currentState.options.limit || 12
      }
    );

    CollectionRenderer.updateCollections(
      container,
      collections
    );

    engineInstances.set(container, {
      ...currentState,
      collections
    });

    return true;
  },

  /**
   * Busca colecciones por título o tipo.
   */
  search(target, term = '') {
    const container = getContainer(target);

    if (!container) {
      return [];
    }

    const currentState = engineInstances.get(container);

    if (!currentState) {
      return [];
    }

    const results = CollectionService.search(
      currentState.collections,
      term
    );

    CollectionRenderer.updateCollections(
      container,
      results
    );

    return results;
  },

  /**
   * Restaura todas las colecciones después de una búsqueda.
   */
  resetSearch(target) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const currentState = engineInstances.get(container);

    if (!currentState) {
      return false;
    }

    CollectionRenderer.updateCollections(
      container,
      currentState.collections
    );

    return true;
  },

  /**
   * Cambia la vista entre cuadrícula y lista.
   */
  setView(target, view = 'grid') {
    return CollectionRenderer.updateView(
      target,
      view
    );
  },

  /**
   * Devuelve el estado actual del motor.
   */
  getState(target) {
    const container = getContainer(target);

    if (!container) {
      return null;
    }

    const state = engineInstances.get(container);

    if (!state) {
      return null;
    }

    return {
      ...state,
      hymns: [...state.hymns],
      collections: [...state.collections]
    };
  },

  /**
   * Destruye la instancia.
   */
  destroy(target) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    CollectionRenderer.clear(container);
    engineInstances.delete(container);

    return true;
  }
};

export default CollectionEngine;
