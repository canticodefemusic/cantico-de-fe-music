/**
 * V9.2.0 Listening History Engine
 * HistoryRenderer
 *
 * Renderiza el historial de reproducciones.
 */

import HistoryTemplates from '../templates/HistoryTemplates.js';

function getContainer(target) {
  if (target instanceof Element) {
    return target;
  }

  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return null;
}

export const HistoryRenderer = {
  /**
   * Renderiza la lista completa.
   */
  render(target, items = []) {
    const container = getContainer(target);

    if (!container) {
      console.warn(
        '[HistoryRenderer] No se encontró el contenedor.'
      );

      return false;
    }

    container.innerHTML =
      HistoryTemplates.list(items);

    return true;
  },

  /**
   * Renderiza el estado vacío.
   */
  renderEmpty(target) {
    const container = getContainer(target);

    if (!container) {
      return false;
    }

    container.innerHTML =
      HistoryTemplates.empty();

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

    return true;
  }
};

export default HistoryRenderer;
