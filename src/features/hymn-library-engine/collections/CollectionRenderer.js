/**
 * V9.0.4 Collections Engine
 * CollectionRenderer
 *
 * Se encarga exclusivamente de renderizar colecciones en el DOM.
 */

import CollectionTemplates from './CollectionTemplates.js';

const rendererState = new WeakMap();

function getContainer(target) {
  if (target instanceof Element) {
    return target;
  }

  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return null;
}

function getState(container) {
  if (!rendererState.has(container)) {
    rendererState.set(container, {
      collections: [],
      view: 'grid',
      options: {}
    });
  }

  return rendererState.get(container);
}

function setState(container, nextState = {}) {
  const currentState = getState(container);

  rendererState.set(container, {
    ...currentState,
    ...nextState
  });

  return rendererState.get(container);
}

function normalizeView(view = 'grid') {
  return view === 'list' ? 'list' : 'grid';
}

function renderContent(collections = [], view = 'grid') {
  return view === 'list'
    ? CollectionTemplates.list(collections)
    : CollectionTemplates.grid(collections);
}

function updateViewButtons(container, view) {
  container
    .querySelectorAll('[data-collections-view]')
    .forEach(button => {
      const buttonView = button.dataset.collectionsView;
      const isActive = buttonView === view;

      button.setAttribute(
        'aria-pressed',
        String(isActive)
      );

      button.classList.toggle(
        'is-active',
        isActive
      );
    });
}

function bindViewControls(container) {
  if (container.dataset.collectionsViewBound === 'true') {
    return;
  }

  container.addEventListener('click', event => {
    const viewButton = event.target.closest(
      '[data-collections-view]'
    );

    if (!viewButton || !container.contains(viewButton)) {
      return;
    }

    const nextView = normalizeView(
      viewButton.dataset.collectionsView
    );

    CollectionRenderer.updateView(
      container,
      nextView
    );
  });

  container.dataset.collectionsViewBound = 'true';
}

function bindCollectionOpen(container, onOpen) {
  if (typeof onOpen !== 'function') {
    return;
  }

  if (container.dataset.collectionOpenBound === 'true') {
    setState(container, {
      onOpen
    });

    return;
  }

  container.addEventListener('click', event => {
    const openButton = event.target.closest(
      '[data-collection-open]'
    );

    if (!openButton || !container.contains(openButton)) {
      return;
    }

    const collectionId =
      openButton.dataset.collectionOpen;

    const state = getState(container);

    const collection = state.collections.find(
      item => item.id === collectionId
    );

    if (!collection) {
      console.warn(
        `[CollectionRenderer] No se encontró la colección: ${collectionId}`
      );

      return;
    }

    const activeHandler =
      getState(container).onOpen;

    if (typeof activeHandler === 'function') {
      activeHandler(collection, openButton);
    }
  });

  container.dataset.collectionOpenBound = 'true';

  setState(container, {
    onOpen
  });
}

export const CollectionRenderer = {
  /**
   * Renderiza una sección completa de colecciones.
   */
  render(target, collections = [], options = {}) {
    const container = getContainer(target);

    if (!container) {
      console.warn(
        '[CollectionRenderer] No se encontró el contenedor.'
      );

      return false;
    }

    const {
      id = '',
      title = 'Colecciones',
      description = '',
      view = 'grid',
      onOpen = null
    } = options;

    const normalizedCollections =
      Array.isArray(collections)
        ? collections
        : [];

    const normalizedView =
      normalizeView(view);

    setState(container, {
      collections: normalizedCollections,
      view: normalizedView,
      options,
      onOpen
    });

    container.innerHTML =
      CollectionTemplates.section({
        id,
        title,
        description,
        collections: normalizedCollections,
        view: normalizedView
      });

    bindViewControls(container);
    bindCollectionOpen(container, onOpen);

    updateViewButtons(
      container,
      normalizedView
    );

    return true;
  },

  /**
   * Renderiza únicamente una cuadrícula.
   */
  renderGrid(target, collections = []) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const normalizedCollections =
      Array.isArray(collections)
        ? collections
        : [];

    container.innerHTML =
      CollectionTemplates.grid(
        normalizedCollections
      );

    setState(container, {
      collections: normalizedCollections,
      view: 'grid'
    });

    return true;
  },

  /**
   * Renderiza únicamente una lista.
   */
  renderList(target, collections = []) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const normalizedCollections =
      Array.isArray(collections)
        ? collections
        : [];

    container.innerHTML =
      CollectionTemplates.list(
        normalizedCollections
      );

    setState(container, {
      collections: normalizedCollections,
      view: 'list'
    });

    return true;
  },

  /**
   * Cambia entre vista de cuadrícula y lista.
   */
  updateView(target, view = 'grid') {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const normalizedView =
      normalizeView(view);

    const state = getState(container);

    const contentContainer =
      container.querySelector(
        '[data-collections-content]'
      );

    if (!contentContainer) {
      console.warn(
        '[CollectionRenderer] No se encontró el área de contenido.'
      );

      return false;
    }

    contentContainer.innerHTML =
      renderContent(
        state.collections,
        normalizedView
      );

    setState(container, {
      view: normalizedView
    });

    updateViewButtons(
      container,
      normalizedView
    );

    return true;
  },

  /**
   * Actualiza los datos sin reconstruir toda la sección.
   */
  updateCollections(target, collections = []) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const normalizedCollections =
      Array.isArray(collections)
        ? collections
        : [];

    const state = getState(container);

    const contentContainer =
      container.querySelector(
        '[data-collections-content]'
      );

    if (!contentContainer) {
      return false;
    }

    contentContainer.innerHTML =
      renderContent(
        normalizedCollections,
        state.view
      );

    setState(container, {
      collections: normalizedCollections
    });

    return true;
  },

  /**
   * Muestra el estado de carga.
   */
  showLoading(target) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    container.innerHTML =
      CollectionTemplates.loading();

    return true;
  },

  /**
   * Muestra un estado vacío personalizado.
   */
  showEmpty(target, options = {}) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    container.innerHTML =
      CollectionTemplates.empty(options);

    return true;
  },

  /**
   * Limpia el contenedor.
   */
  clear(target) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    container.innerHTML = '';

    rendererState.delete(container);

    delete container.dataset.collectionsViewBound;
    delete container.dataset.collectionOpenBound;

    return true;
  },

  /**
   * Devuelve el estado actual del renderer.
   */
  getState(target) {
    const container = getContainer(target);

    if (!container) {
      return null;
    }

    return {
      ...getState(container)
    };
  }
};

export default CollectionRenderer;
