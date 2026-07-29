/**
 * Cántico de Fe Music
 * V10.1 — Player Persistence Service
 */

const STORAGE_KEY = 'cantico:player-session';

export class PlayerPersistenceService {
  static save(data = {}) {
    try {
      const currentSession = this.load() || {};

      const session = {
        ...currentSession,
        ...data,
        savedAt: Date.now()
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(session)
      );

      return session;
    } catch (error) {
      console.error(
        '[Player Persistence] Error saving session:',
        error
      );

      return null;
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

  static restore(playerService) {
    const session = this.load();

    if (!session || !playerService) {
      return false;
    }

    return session;
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
