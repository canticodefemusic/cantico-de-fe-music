/**
 * V9.2.0 Listening History Engine
 * HistoryService
 *
 * Administra el historial de reproducciones.
 */

const STORAGE_KEY = 'cantico:listening-history';

function loadHistory() {
  try {
    const history = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return Array.isArray(history)
      ? history
      : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  );
}

function normalizeHistory(history = []) {
  return Array.isArray(history)
    ? history
    : [];
}

export const HistoryService = {
  /**
   * Devuelve todo el historial.
   */
  getHistory() {
    return normalizeHistory(
      loadHistory()
    );
  },

  /**
   * Registra una reproducción.
   */
  addPlay(hymn) {
    if (!hymn?.id) {
      return;
    }

    const history =
      normalizeHistory(loadHistory());

    const existing = history.find(
      item => item.id === hymn.id
    );

    if (existing) {
      existing.playCount += 1;
      existing.lastPlayed =
        new Date().toISOString();
    } else {
      history.unshift({
        id: hymn.id,
        title: hymn.title || '',
        playCount: 1,
        firstPlayed:
          new Date().toISOString(),
        lastPlayed:
          new Date().toISOString()
      });
    }

    history.sort(
      (a, b) =>
        Date.parse(b.lastPlayed) -
        Date.parse(a.lastPlayed)
    );

    saveHistory(history);
  },

  /**
   * Devuelve los últimos escuchados.
   */
  getRecent(limit = 20) {
    return loadHistory().slice(0, limit);
  },

  /**
   * Devuelve los más reproducidos.
   */
  getMostPlayed(limit = 20) {
    return [...loadHistory()]
      .sort(
        (a, b) =>
          b.playCount -
          a.playCount
      )
      .slice(0, limit);
  },

  /**
   * Busca un himno en el historial.
   */
  find(id) {
    return loadHistory().find(
      item => item.id === id
    ) || null;
  },

  /**
   * Elimina todo el historial.
   */
  clear() {
    saveHistory([]);
  }
};

export default HistoryService;
