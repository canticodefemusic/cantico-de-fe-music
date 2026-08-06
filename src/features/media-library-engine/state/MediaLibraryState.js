/**
 * Cántico de Fe Music
 * V12.8.6 — Media Library State
 */

const listeners =
  new Set();

const initialState = {
  query: '',
  type: 'all',
  category: 'all',
  sort: 'order',
  selectedMediaId: null,
  previewMediaId: null
};

const state = {
  ...initialState
};

function cloneValue(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return value;
  }

  return JSON.parse(
    JSON.stringify(value)
  );
}

function createSnapshot() {
  return cloneValue(
    state
  );
}

function emit(
  action = 'update'
) {
  const snapshot =
    createSnapshot();

  listeners.forEach(
    listener => {
      try {
        listener(
          snapshot,
          action
        );
      } catch (error) {
        console.error(
          '[MediaLibraryState] Error en listener:',
          error
        );
      }
    }
  );

  window.dispatchEvent(
    new CustomEvent(
      'cantico:media-library-state-change',
      {
        detail: {
          action,
          state: snapshot
        }
      }
    )
  );
}

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
}

function normalizeFilterValue(
  value,
  fallback = 'all'
) {
  return (
    normalizeText(
      value
    ) ||
    fallback
  );
}

const MediaLibraryState = {
  getState() {
    return createSnapshot();
  },

  subscribe(listener) {
    if (
      typeof listener !==
      'function'
    ) {
      return () => {};
    }

    listeners.add(
      listener
    );

    listener(
      createSnapshot(),
      'subscribe'
    );

    return () => {
      listeners.delete(
        listener
      );
    };
  },

  setState(
    changes = {},
    action = 'set-state'
  ) {
    if (
      !changes ||
      typeof changes !==
        'object'
    ) {
      return this.getState();
    }

    Object.assign(
      state,
      changes
    );

    emit(action);

    return this.getState();
  },

  setQuery(
    query = ''
  ) {
    state.query =
      normalizeText(
        query
      );

    emit('set-query');

    return state.query;
  },

  setType(
    type = 'all'
  ) {
    state.type =
      normalizeFilterValue(
        type
      );

    emit('set-type');

    return state.type;
  },

  setCategory(
    category = 'all'
  ) {
    state.category =
      normalizeFilterValue(
        category
      );

    emit('set-category');

    return state.category;
  },

  setSort(
    sort = 'order'
  ) {
    state.sort =
      normalizeFilterValue(
        sort,
        'order'
      );

    emit('set-sort');

    return state.sort;
  },

  setSelectedMediaId(
    mediaId = null
  ) {
    state.selectedMediaId =
      mediaId
        ? normalizeText(
            mediaId
          )
        : null;

    emit(
      'set-selected-media'
    );

    return (
      state.selectedMediaId
    );
  },

  setPreviewMediaId(
    mediaId = null
  ) {
    state.previewMediaId =
      mediaId
        ? normalizeText(
            mediaId
          )
        : null;

    emit(
      'set-preview-media'
    );

    return (
      state.previewMediaId
    );
  },

  clearFilters() {
    state.query =
      initialState.query;

    state.type =
      initialState.type;

    state.category =
      initialState.category;

    state.sort =
      initialState.sort;

    emit('clear-filters');

    return this.getState();
  },

  clearSelection() {
    state.selectedMediaId =
      null;

    emit(
      'clear-selection'
    );

    return this.getState();
  },

  closePreview() {
    state.previewMediaId =
      null;

    emit(
      'close-preview'
    );

    return this.getState();
  },

  reset() {
    Object.assign(
      state,
      initialState
    );

    emit('reset');

    return this.getState();
  }
};

export {
  initialState
};

export default
  MediaLibraryState;
