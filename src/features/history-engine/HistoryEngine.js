/**
 * V9.2.0 Listening History Engine
 * HistoryEngine
 */

import HistoryService from './services/HistoryService.js';
import HistoryRenderer from './renderers/HistoryRenderer.js';

export const HistoryEngine = {
  /**
   * Registra una reproducción.
   */
  addPlay(hymn) {
    HistoryService.addPlay(hymn);
  },

  /**
   * Devuelve el historial.
   */
  getHistory() {
    return HistoryService.getHistory();
  },

  /**
   * Devuelve los más recientes.
   */
  getRecent(limit = 20) {
    return HistoryService.getRecent(limit);
  },

  /**
   * Devuelve los más reproducidos.
   */
  getMostPlayed(limit = 20) {
    return HistoryService.getMostPlayed(limit);
  },

  /**
   * Limpia el historial.
   */
  clear() {
    HistoryService.clear();
  },

  /**
   * Renderiza el historial.
   */
  render(target) {
    HistoryRenderer.render(
      target,
      HistoryService.getHistory()
    );
  }
};

export default HistoryEngine;
