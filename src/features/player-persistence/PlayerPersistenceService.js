/**
 * Cántico de Fe Music
 * V10.1 — Player Persistence Service
 */

const STORAGE_KEY = 'cantico:player-session';

export class PlayerPersistenceService {
  static save(data = {}) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...data,
          savedAt: Date.now()
        })
      );
    } catch (error) {
      console.error(
        '[Player Persistence] Error saving session:',
        error
      );
    }
  }

  static load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error(
        '[Player Persistence] Error loading session:',
        error
      );

      return null;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error(
        '[Player Persistence] Error clearing session:',
        error
      );
    }
  }
}
