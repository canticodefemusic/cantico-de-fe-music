/**
 * Cántico de Fe Music
 * V12.8.0 — Media Library Catalog
 */

export const mediaLibraryData = [
  {
    id:
      'default-social-cover',

    name:
      'Portada predeterminada',

    description:
      'Portada general utilizada cuando un contenido no tiene una imagen propia.',

    type:
      'image',

    category:
      'covers',

    path:
      '/assets/images/default-social-cover.png',

    mimeType:
      'image/png',

    extension:
      'png',

    alt:
      'Portada predeterminada de Cántico de Fe Music',

    tags: [
      'portada',
      'predeterminada',
      'social',
      'cántico de fe music'
    ],

    featured:
      true,

    order:
      1,

    metadata: {
      width:
        null,

      height:
        null,

      duration:
        null,

      fileSize:
        null
    }
  },

  {
    id:
      'fe-que-mueve-montanas-audio',

    name:
      'Fe que Mueve Montañas',

    description:
      'Archivo de audio oficial del himno Fe que Mueve Montañas.',

    type:
      'audio',

    category:
      'hymns',

    path:
      '/assets/audio/himnos/fe-que-mueve-montanas.mp3',

    mimeType:
      'audio/mpeg',

    extension:
      'mp3',

    alt:
      '',

    tags: [
      'himno',
      'audio',
      'fe',
      'fe que mueve montañas'
    ],

    featured:
      false,

    order:
      2,

    metadata: {
      width:
        null,

      height:
        null,

      duration:
        null,

      fileSize:
        null
    }
  },

  {
    id:
      'quince-anos-mas-audio',

    name:
      'Quince Años Más',

    description:
      'Archivo de audio oficial del himno Quince Años Más.',

    type:
      'audio',

    category:
      'hymns',

    path:
      '/assets/audio/himnos/quince-anos-mas.mp3',

    mimeType:
      'audio/mpeg',

    extension:
      'mp3',

    alt:
      '',

    tags: [
      'himno',
      'audio',
      'ezequías',
      'quince años más'
    ],

    featured:
      false,

    order:
      3,

    metadata: {
      width:
        null,

      height:
        null,

      duration:
        null,

      fileSize:
        null
    }
  }
];

export default mediaLibraryData;
