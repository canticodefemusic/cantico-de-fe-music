/**
 * Cántico de Fe Music
 * V13.0.1 — Media Metadata Service
 */

import MediaLibraryService
  from './MediaLibraryService.js';

const STORAGE_KEY =
  'cantico:media-metadata-overrides';

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
}

function normalizeTags(
  tags = []
) {
  const values =
    Array.isArray(tags)
      ? tags
      : String(tags || '')
          .split(',');

  return [
    ...new Set(
      values
        .map(normalizeText)
        .filter(Boolean)
    )
  ];
}

function normalizeCopyright(
  copyright = {}
) {
  const source =
    copyright &&
    typeof copyright ===
      'object'
      ? copyright
      : {};

  return {
    holder:
      normalizeText(
        source.holder
      ),

    author:
      normalizeText(
        source.author
      ),

    license:
      normalizeText(
        source.license
      ),

    source:
      normalizeText(
        source.source
      ),

    year:
      normalizeText(
        source.year
      )
  };
}

function normalizeOverride(
  override = {}
) {
  const source =
    override &&
    typeof override ===
      'object'
      ? override
      : {};

  return {
    name:
      normalizeText(
        source.name
      ),

    description:
      normalizeText(
        source.description
      ),

    alt:
      normalizeText(
        source.alt
      ),

    category:
      normalizeText(
        source.category
      ),

    tags:
      normalizeTags(
        source.tags
      ),

    featured:
      Boolean(
        source.featured
      ),

    copyright:
      normalizeCopyright(
        source.copyright
      ),

    updatedAt:
      source.updatedAt ||
      new Date().toISOString()
  };
}

function readOverrides() {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return {};
    }

    const parsed =
      JSON.parse(saved);

    if (
      !parsed ||
      typeof parsed !==
        'object' ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .map(
          ([
            mediaId,
            override
          ]) => [
            normalizeText(
              mediaId
            ),
            normalizeOverride(
              override
            )
          ]
        )
        .filter(
          ([mediaId]) =>
            Boolean(mediaId)
        )
    );
  } catch (error) {
    console.error(
      '[MediaMetadataService] No se pudieron cargar los metadatos:',
      error
    );

    return {};
  }
}

function saveOverrides(
  overrides = {}
) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        overrides
      )
    );

    return true;
  } catch (error) {
    console.error(
      '[MediaMetadataService] No se pudieron guardar los metadatos:',
      error
    );

    return false;
  }
}

function mergeMedia(
  media,
  override = null
) {
  if (!media) {
    return null;
  }

  if (!override) {
    return {
      ...media,

      tags:
        Array.isArray(
          media.tags
        )
          ? [...media.tags]
          : [],

      copyright:
        normalizeCopyright(
          media.copyright
        ),

      metadataOverride:
        false
    };
  }

  return {
    ...media,

    name:
      override.name ||
      media.name,

    description:
      override.description ||
      media.description,

    alt:
      override.alt ||
      media.alt,

    category:
      override.category ||
      media.category,

    tags:
      override.tags.length
        ? [...override.tags]
        : (
            Array.isArray(
              media.tags
            )
              ? [...media.tags]
              : []
          ),

    featured:
      override.featured,

    copyright:
      {
        ...normalizeCopyright(
          media.copyright
        ),
        ...override.copyright
      },

    metadataOverride:
      true,

    metadataUpdatedAt:
      override.updatedAt
  };
}

function dispatchChange(
  action,
  mediaId,
  media = null
) {
  window.dispatchEvent(
    new CustomEvent(
      'cantico:media-metadata-change',
      {
        detail: {
          action,
          mediaId,
          media
        }
      }
    )
  );
}

const MediaMetadataService = {
  getOverrides() {
    return readOverrides();
  },

  getOverride(
    mediaId
  ) {
    const cleanId =
      normalizeText(
        mediaId
      );

    if (!cleanId) {
      return null;
    }

    return (
      readOverrides()[
        cleanId
      ] ||
      null
    );
  },

  getById(
    mediaId
  ) {
    const cleanId =
      normalizeText(
        mediaId
      );

    if (!cleanId) {
      return null;
    }

    const media =
      MediaLibraryService
        .getById(
          cleanId
        );

    if (!media) {
      return null;
    }

    return mergeMedia(
      media,
      this.getOverride(
        cleanId
      )
    );
  },

  getAll() {
    return MediaLibraryService
      .getAll()
      .map(media =>
        mergeMedia(
          media,
          this.getOverride(
            media.id
          )
        )
      );
  },

  update(
    mediaId,
    changes = {}
  ) {
    const cleanId =
      normalizeText(
        mediaId
      );

    if (!cleanId) {
      return {
        success: false,
        media: null,
        message:
          'El identificador del archivo no es válido.'
      };
    }

    const originalMedia =
      MediaLibraryService
        .getById(
          cleanId
        );

    if (!originalMedia) {
      return {
        success: false,
        media: null,
        message:
          'No se encontró el archivo multimedia.'
      };
    }

    const overrides =
      readOverrides();

    const previous =
      overrides[cleanId] ||
      {};

    const nextOverride =
      normalizeOverride({
        ...previous,
        ...changes,

        copyright: {
          ...(
            previous.copyright ||
            {}
          ),
          ...(
            changes.copyright ||
            {}
          )
        },

        updatedAt:
          new Date()
            .toISOString()
      });

    overrides[cleanId] =
      nextOverride;

    if (
      !saveOverrides(
        overrides
      )
    ) {
      return {
        success: false,
        media: null,
        message:
          'No se pudieron guardar los metadatos.'
      };
    }

    const media =
      mergeMedia(
        originalMedia,
        nextOverride
      );

    dispatchChange(
      'update',
      cleanId,
      media
    );

    return {
      success: true,
      media,
      message:
        'Los metadatos fueron guardados correctamente.'
    };
  },

  restore(
    mediaId
  ) {
    const cleanId =
      normalizeText(
        mediaId
      );

    if (!cleanId) {
      return {
        success: false,
        media: null,
        message:
          'El identificador del archivo no es válido.'
      };
    }

    const originalMedia =
      MediaLibraryService
        .getById(
          cleanId
        );

    if (!originalMedia) {
      return {
        success: false,
        media: null,
        message:
          'No se encontró el archivo multimedia.'
      };
    }

    const overrides =
      readOverrides();

    delete overrides[
      cleanId
    ];

    if (
      !saveOverrides(
        overrides
      )
    ) {
      return {
        success: false,
        media: null,
        message:
          'No se pudieron restaurar los metadatos.'
      };
    }

    const media =
      mergeMedia(
        originalMedia
      );

    dispatchChange(
      'restore',
      cleanId,
      media
    );

    return {
      success: true,
      media,
      message:
        'Se restauraron los metadatos originales.'
    };
  },

  hasOverride(
    mediaId
  ) {
    return Boolean(
      this.getOverride(
        mediaId
      )
    );
  },

  exportMetadata() {
    return JSON.stringify(
      {
        app:
          'Cántico de Fe Music',

        version:
          1,

        exportedAt:
          new Date()
            .toISOString(),

        metadata:
          readOverrides()
      },
      null,
      2
    );
  },

  clearAll() {
    try {
      localStorage.removeItem(
        STORAGE_KEY
      );

      dispatchChange(
        'clear-all',
        null,
        null
      );

      return {
        success: true,
        message:
          'Todos los metadatos personalizados fueron eliminados.'
      };
    } catch (error) {
      console.error(
        '[MediaMetadataService] No se pudieron eliminar los metadatos:',
        error
      );

      return {
        success: false,
        message:
          'No se pudieron eliminar los metadatos personalizados.'
      };
    }
  }
};

export {
  STORAGE_KEY,
  normalizeText,
  normalizeTags,
  normalizeCopyright,
  normalizeOverride,
  mergeMedia
};

export default
  MediaMetadataService;
