/**
 * V9.0.5 Sort Engine
 * SortRenderer
 *
 * Renderiza el selector de ordenamiento
 * y administra la interacción con el usuario.
 */

import SortTemplates from './SortTemplates.js';

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
      selected: 'title-asc',
      onChange: null
    });
  }

  return rendererState.get(container);
}

function setState(container, nextState = {}) {
  const currentState = getState(container);

  const newState = {
    ...currentState,
    ...nextState
  };

  rendererState.set(container, newState);

  return newState;
}

function bindEvents(container) {
  if (container.dataset.sortRendererBound === 'true') {
    return;
  }

  container.addEventListener('change', event => {
    const select = event.target.closest(
      '[data-sort-select]'
    );

    if (!select || !container.contains(select)) {
      return;
    }

    const selectedMode = select.value;
    const state = getState(container);

    setState(container, {
      selected: selectedMode
    });

    if (typeof state.onChange === 'function') {
      state.onChange(selectedMode, select);
    }
  });

  container.dataset.sortRendererBound = 'true';
}

export const SortRenderer = {
  /**
   * Renderiza el selector completo.
   */
  render(
    target,
    {
      selected = 'title-asc',
      onChange = null
    } = {}
  ) {
    const container = getContainer(target);

    if (!container) {
      console.warn(
        '[SortRenderer] No se encontró el contenedor.'
      );

      return false;
    }

    container.innerHTML =
      SortTemplates.selector(selected);

    setState(container, {
      selected,
      onChange
    });

    bindEvents(container);

    return true;
  },

  /**
   * Cambia el valor seleccionado.
   */
  setSelected(target, mode = 'title-asc') {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const select = container.querySelector(
      '[data-sort-select]'
    );

    if (!select) {
      return false;
    }

    select.value = mode;

    setState(container, {
      selected: mode
    });

    return true;
  },

  /**
   * Devuelve el modo seleccionado.
   */
  getSelected(target) {
    const container = getContainer(target);

    if (!container) {
      return null;
    }

    return getState(container).selected;
  },

  /**
   * Activa o desactiva el selector.
   */
  setDisabled(target, disabled = true) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    const select = container.querySelector(
      '[data-sort-select]'
    );

    if (!select) {
      return false;
    }

    select.disabled = Boolean(disabled);

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
    delete container.dataset.sortRendererBound;

    return true;
  },

  /**
   * Devuelve el estado actual.
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

export default SortRenderer;
