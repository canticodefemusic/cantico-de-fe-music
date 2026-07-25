/**
 * V9.0.5 Sort Engine
 * SortEngine
 *
 * Coordina SortService y SortRenderer.
 * También guarda la preferencia del usuario.
 */

import SortService from './SortService.js';
import SortRenderer from './SortRenderer.js';

const engineInstances = new WeakMap();

const DEFAULT_MODE = 'title-asc';
const DEFAULT_STORAGE_KEY = 'cantico-de-fe-sort-mode';

function getContainer(target) {
  if (target instanceof Element) {
    return target;
  }

  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return null;
}

function normalizeItems(items = []) {
  return Array.isArray(items)
    ? items
    : [];
}

function normalizeMode(mode = DEFAULT_MODE) {
  return SortService.isValidMode(mode)
    ? mode
    : DEFAULT_MODE;
}

function readStoredMode(storageKey = DEFAULT_STORAGE_KEY) {
  try {
    const storedMode = window.localStorage.getItem(storageKey);

    return storedMode && SortService.isValidMode(storedMode)
      ? storedMode
      : null;
  } catch (error) {
    console.warn(
      '[SortEngine] No se pudo leer localStorage.',
      error
    );

    return null;
  }
}

function saveStoredMode(
  mode,
  storageKey = DEFAULT_STORAGE_KEY
) {
  try {
    window.localStorage.setItem(storageKey, mode);

    return true;
  } catch (error) {
    console.warn(
      '[SortEngine] No se pudo guardar en localStorage.',
      error
    );

    return false;
  }
}

function createState({
  items = [],
  sortedItems = [],
  mode = DEFAULT_MODE,
  storageKey = DEFAULT_STORAGE_KEY,
  persist = true,
  onSort = null
} = {}) {
  return {
    items,
    sortedItems,
    mode,
    storageKey,
    persist,
    onSort,
    initialized: true
  };
}

function executeSort(container, mode) {
  const state = engineInstances.get(container);

  if (!state) {
    return [];
  }

  const normalizedMode = normalizeMode(mode);

  const sortedItems = SortService.sort(
    state.items,
    normalizedMode
  );

  if (state.persist) {
    saveStoredMode(
      normalizedMode,
      state.storageKey
    );
  }

  SortRenderer.setSelected(
    container,
    normalizedMode
  );

  const nextState = {
    ...state,
    mode: normalizedMode,
    sortedItems
  };

  engineInstances.set(
    container,
    nextState
  );

  if (typeof state.onSort === 'function') {
    state.onSort(
      sortedItems,
      normalizedMode
    );
  }

  return sortedItems;
}

export const SortEngine = {
  /**
   * Inicializa el motor de ordenamiento.
   */
  init({
    target,
    items = [],
    mode = DEFAULT_MODE,
    persist = true,
    storageKey = DEFAULT_STORAGE_KEY,
    onSort = null
  } = {}) {
    const container = getContainer(target);

    if (!container) {
      console.warn(
        '[SortEngine] No se encontró el contenedor.'
      );

      return null;
    }

    const normalizedItems =
      normalizeItems(items);

    const storedMode =
      persist
        ? readStoredMode(storageKey)
        : null;

    const initialMode =
      normalizeMode(
        storedMode || mode
      );

    const sortedItems =
      SortService.sort(
        normalizedItems,
        initialMode
      );

    SortRenderer.render(
      container,
      {
        selected: initialMode,

        onChange(selectedMode) {
          executeSort(
            container,
            selectedMode
          );
        }
      }
    );

    const state = createState({
      items: normalizedItems,
      sortedItems,
      mode: initialMode,
      storageKey,
      persist,
      onSort
    });

    engineInstances.set(
      container,
      state
    );

    if (typeof onSort === 'function') {
      onSort(
        sortedItems,
        initialMode
      );
    }

    return {
      container,
      ...state
    };
  },

  /**
   * Ordena usando un modo específico.
   */
  sort(target, mode = DEFAULT_MODE) {
    const container = getContainer(target);

    if (!container) {
      return [];
    }

    return executeSort(
      container,
      mode
    );
  },

  /**
   * Actualiza la lista original y vuelve a ordenar.
   */
  setItems(target, items = []) {
    const container = getContainer(target);

    if (!container) {
      return [];
    }

    const state = engineInstances.get(container);

    if (!state) {
      console.warn(
        '[SortEngine] El motor no ha sido inicializado.'
      );

      return [];
    }

    const normalizedItems =
      normalizeItems(items);

    engineInstances.set(
      container,
      {
        ...state,
        items: normalizedItems
      }
    );

    return executeSort(
      container,
      state.mode
    );
  },

  /**
   * Devuelve los elementos ya ordenados.
   */
  getSortedItems(target) {
    const container = getContainer(target);

    if (!container) {
      return [];
    }

    const state = engineInstances.get(container);

    return state
      ? [...state.sortedItems]
      : [];
  },

  /**
   * Devuelve el modo actual.
   */
  getMode(target) {
    const container = getContainer(target);

    if (!container) {
      return null;
    }

    const state = engineInstances.get(container);

    return state
      ? state.mode
      : null;
  },

  /**
   * Restaura el orden predeterminado.
   */
  reset(target) {
    return this.sort(
      target,
      DEFAULT_MODE
    );
  },

  /**
   * Activa o desactiva el selector.
   */
  setDisabled(target, disabled = true) {
    return SortRenderer.setDisabled(
      target,
      disabled
    );
  },

  /**
   * Devuelve el estado actual.
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
      items: [...state.items],
      sortedItems: [...state.sortedItems]
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

    SortRenderer.clear(container);
    engineInstances.delete(container);

    return true;
  }
};

export default SortEngine;
