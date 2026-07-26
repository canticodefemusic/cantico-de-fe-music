/**
 * V9.1.0 Smart Playlists
 * SmartPlaylistEngine
 *
 * Coordina las playlists inteligentes.
 */

import SmartPlaylistService from './SmartPlaylistService.js';
import {
  getSmartPlaylistDefinitions
} from './SmartPlaylistDefinitions.js';

export const SmartPlaylistEngine = {
  /**
   * Genera todas las playlists inteligentes.
   */
  generate(hymns = [], options = {}) {
    const definitions =
      options.definitions ||
      getSmartPlaylistDefinitions();

    return SmartPlaylistService.generateAll(
      definitions,
      hymns
    );
  },

  /**
   * Genera una sola playlist inteligente.
   */
  generateOne(definition, hymns = []) {
    return SmartPlaylistService.generate({
      ...definition,
      hymns
    });
  },

  /**
   * Devuelve las definiciones disponibles.
   */
  definitions() {
    return getSmartPlaylistDefinitions();
  },

  /**
   * Devuelve los tipos soportados.
   */
  types() {
    return SmartPlaylistService.getTypes();
  }
};

export default SmartPlaylistEngine;
