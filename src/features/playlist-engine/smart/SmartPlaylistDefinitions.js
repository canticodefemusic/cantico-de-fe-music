/**
 * V9.1.0 Smart Playlists
 * SmartPlaylistDefinitions
 *
 * Definiciones predeterminadas para playlists
 * automáticas del sitio.
 */

export const SmartPlaylistDefinitions = Object.freeze([
  {
    id: 'smart-favorites',
    name: 'Mis favoritos',
    description:
      'Himnos que has marcado como favoritos.',
    type: 'favorites',
    rule: {
      favoriteIds: []
    }
  },

  {
    id: 'smart-recent',
    name: 'Agregados recientemente',
    description:
      'Los himnos más recientes de la biblioteca.',
    type: 'recent',
    rule: {
      limit: 12
    }
  },

  {
    id: 'smart-most-played',
    name: 'Más reproducidos',
    description:
      'Los himnos con mayor número de reproducciones.',
    type: 'most-played',
    rule: {
      limit: 12
    }
  },

  {
    id: 'smart-faith',
    name: 'Himnos de fe',
    description:
      'Himnos relacionados con la fe y la confianza en Dios.',
    type: 'keyword',
    rule: {
      value: 'fe'
    }
  },

  {
    id: 'smart-hope',
    name: 'Himnos de esperanza',
    description:
      'Himnos sobre esperanza, consuelo y fortaleza.',
    type: 'keyword',
    rule: {
      value: 'esperanza'
    }
  },

  {
    id: 'smart-prayer',
    name: 'Himnos de oración',
    description:
      'Himnos relacionados con la oración y el clamor a Dios.',
    type: 'keyword',
    rule: {
      value: 'oración'
    }
  }
]);

export function getSmartPlaylistDefinitions() {
  return SmartPlaylistDefinitions.map(definition => ({
    ...definition,
    rule: {
      ...definition.rule
    }
  }));
}

export function findSmartPlaylistDefinition(id) {
  return SmartPlaylistDefinitions.find(
    definition => definition.id === id
  ) || null;
}

export default SmartPlaylistDefinitions;
