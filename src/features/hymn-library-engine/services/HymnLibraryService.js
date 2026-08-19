/**
 * Cántico de Fe Music
 * V13.4.32 — Dynamic R2 Hymn Discovery
 *
 * Funciones:
 * - Mantener hymnCatalog como catálogo base
 * - Sincronizar metadatos persistentes desde R2
 * - Relacionar himnos existentes mediante r2Key
 * - Resolver coverKey a una URL R2 real
 * - Descubrir automáticamente nuevos himnos desde R2
 * - Detectar audios con categoría "himnos"
 * - Evitar duplicados por r2Key
 * - Generar IDs para nuevos himnos R2
 * - Usar audio R2 directamente para himnos dinámicos
 * - Mantener list(), search() y findById()
 */

import {
  hymnCatalog
} from '../data/hymnCatalog.js';

import {
  searchItems
} from '../../smart-search-engine/index.js';

import r2MediaService
  from '../../media-library-engine/services/R2MediaService.js';

/* ==========================================================
   Normalización
   ========================================================== */

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
}

function normalizeLowerText(
  value = ''
) {
  return normalizeText(
    value
  ).toLocaleLowerCase(
    'es'
  );
}

function normalizeTags(
  value = []
) {
  if (
    Array.isArray(
      value
    )
  ) {
    return value
      .map(
        normalizeText
      )
      .filter(Boolean);
  }

  const text =
    normalizeText(
      value
    );

  if (!text) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(
        text
      );

    if (
      Array.isArray(
        parsed
      )
    ) {
      return parsed
        .map(
          normalizeText
        )
        .filter(Boolean);
    }
  } catch {
    // Continúa como lista separada por comas.
  }

  return text
    .split(',')
    .map(
      normalizeText
    )
    .filter(Boolean);
}

/* ==========================================================
   Copyright
   ========================================================== */

function getCopyright(
  metadata = {},
  fallback = {}
) {
  const copyright = {
    holder:
      normalizeText(
        metadata
          .copyrightHolder
      ) ||
      normalizeText(
        fallback?.holder
      ),

    license:
      normalizeText(
        metadata
          .copyrightLicense
      ) ||
      normalizeText(
        fallback?.license
      )
  };

  const author =
    normalizeText(
      metadata
        .copyrightAuthor
    );

  const source =
    normalizeText(
      metadata
        .copyrightSource
    );

  const year =
    normalizeText(
      metadata
        .copyrightYear
    );

  if (author) {
    copyright.author =
      author;
  }

  if (source) {
    copyright.source =
      source;
  }

  if (year) {
    copyright.year =
      year;
  }

  return copyright;
}

/* ==========================================================
   R2
   ========================================================== */

function getR2FileUrl(
  key = ''
) {
  const cleanKey =
    normalizeText(
      key
    );

  if (!cleanKey) {
    return '';
  }

  return (
    '/api/media/file?key=' +
    encodeURIComponent(
      cleanKey
    )
  );
}

function getObjectMetadata(
  object = {}
) {
  return (
    object.customMetadata &&
    typeof object.customMetadata ===
      'object'
  )
    ? object.customMetadata
    : {};
}

function getObjectContentType(
  object = {}
) {
  return normalizeText(
    object
      ?.httpMetadata
      ?.contentType
  );
}

function isAudioObject(
  object = {}
) {
  return getObjectContentType(
    object
  ).startsWith(
    'audio/'
  );
}

function isHymnCategory(
  value = ''
) {
  const category =
    normalizeLowerText(
      value
    );

  return (
    category === 'himno' ||
    category === 'himnos'
  );
}

/* ==========================================================
   Portadas
   ========================================================== */

function resolveCover(
  hymn,
  objectMap
) {
  const coverKey =
    normalizeText(
      hymn?.coverKey
    );

  if (!coverKey) {
    return {
      cover:
        hymn?.cover || '',

      coverKey:
        '',

      coverSynced:
        false
    };
  }

  const coverObject =
    objectMap.get(
      coverKey
    );

  if (!coverObject) {
    return {
      cover:
        hymn?.cover || '',

      coverKey,

      coverSynced:
        false
    };
  }

  const contentType =
    getObjectContentType(
      coverObject
    );

  if (
    contentType &&
    !contentType.startsWith(
      'image/'
    )
  ) {
    return {
      cover:
        hymn?.cover || '',

      coverKey,

      coverSynced:
        false
    };
  }

  return {
    cover:
      getR2FileUrl(
        coverKey
      ),

    coverKey,

    coverSynced:
      true
  };
}

/* ==========================================================
   Himnos existentes
   ========================================================== */

function mergeHymnWithR2Metadata(
  hymn,
  object,
  objectMap
) {
  if (
    !hymn ||
    !object
  ) {
    const coverState =
      resolveCover(
        hymn,
        objectMap
      );

    return {
      ...hymn,

      ...coverState
    };
  }

  const metadata =
    getObjectMetadata(
      object
    );

  const displayName =
    normalizeText(
      metadata.displayName
    );

  const description =
    normalizeText(
      metadata.description
    );

  const category =
    normalizeText(
      metadata.category
    );

  const metadataTags =
    normalizeTags(
      metadata.tags
    );

  const metadataCoverKey =
    normalizeText(
      metadata.coverKey
    );

  const hymnWithCoverKey = {
    ...hymn,

    coverKey:
      metadataCoverKey ||
      normalizeText(
        hymn.coverKey
      )
  };

  const coverState =
    resolveCover(
      hymnWithCoverKey,
      objectMap
    );

  return {
    ...hymn,

    title:
      displayName ||
      hymn.title,

    description:
      description ||
      hymn.description,

    category:
      category ||
      hymn.category,

    featured:
      metadata.featured === true ||
      metadata.featured === 'true' ||
      metadata.featured === '1',
    
    tags:
      metadataTags.length
        ? metadataTags
        : [
            ...(
              Array.isArray(
                hymn.tags
              )
                ? hymn.tags
                : []
            )
          ],

    copyright:
      getCopyright(
        metadata,
        hymn.copyright
      ),

    ...coverState,

    r2Metadata: {
      key:
        object.key,

      synced:
        true,

      dynamic:
        false,

      updatedAt:
        normalizeText(
          metadata
            .metadataUpdatedAt
        ) ||
        null,

      coverKey:
        coverState.coverKey,

      coverSynced:
        coverState.coverSynced
    }
  };
}

/* ==========================================================
   IDs dinámicos
   ========================================================== */

function slugify(
  value = ''
) {
  return normalizeText(
    value
  )
    .normalize(
      'NFD'
    )
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    );
}

function getFileNameFromKey(
  key = ''
) {
  const cleanKey =
    normalizeText(
      key
    );

  if (!cleanKey) {
    return '';
  }

  const parts =
    cleanKey.split('/');

  return (
    parts[
      parts.length - 1
    ] ||
    ''
  );
}

function stripExtension(
  value = ''
) {
  return normalizeText(
    value
  ).replace(
    /\.[^.]+$/,
    ''
  );
}

function stripUploadUuid(
  value = ''
) {
  return normalizeText(
    value
  ).replace(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i,
    ''
  );
}

function createDynamicHymnId(
  object,
  metadata = {}
) {
  const originalName =
    normalizeText(
      metadata.originalName
    );

  const fileName =
    originalName ||
    getFileNameFromKey(
      object?.key
    );

  const cleanFileName =
    stripUploadUuid(
      stripExtension(
        fileName
      )
    );

  const displayName =
    normalizeText(
      metadata.displayName
    );

  return (
    slugify(
      cleanFileName
    ) ||
    slugify(
      displayName
    ) ||
    `r2-hymn-${Date.now()}`
  );
}

/* ==========================================================
   Himnos dinámicos R2
   ========================================================== */

function isDynamicR2Hymn(
  object = {}
) {
  if (
    !object?.key ||
    !isAudioObject(
      object
    )
  ) {
    return false;
  }

  const metadata =
    getObjectMetadata(
      object
    );

  return isHymnCategory(
    metadata.category
  );
}

function createDynamicR2Hymn(
  object,
  objectMap
) {
  const metadata =
    getObjectMetadata(
      object
    );

  const key =
    normalizeText(
      object.key
    );

  if (!key) {
    return null;
  }

  const displayName =
    normalizeText(
      metadata.displayName
    );

  const description =
    normalizeText(
      metadata.description
    );

  const category =
    normalizeText(
      metadata.category
    );

  const coverKey =
    normalizeText(
      metadata.coverKey
    );

  const tags =
    normalizeTags(
      metadata.tags
    );

  const originalName =
    normalizeText(
      metadata.originalName
    ) ||
    getFileNameFromKey(
      key
    );

  const title =
    displayName ||
    stripUploadUuid(
      stripExtension(
        originalName
      )
    ) ||
    'Himno sin título';

  const audioUrl =
    getR2FileUrl(
      key
    );

  const baseHymn = {
    id:
      createDynamicHymnId(
        object,
        metadata
      ),

    title,

    subtitle:
      '',

    category:
      category ||
      'Himnos',

    theme:
      '',

    scriptures:
      [],

    scripture:
      '',

    artist:
      'Cántico de Fe Music',

    r2Key:
      key,

    coverKey,

    audio:
      audioUrl,

    src:
      audioUrl,

    cover:
      '',

    duration:
      '',

    description:
      description ||
      'Himno cristiano de Cántico de Fe Music.',

    lyrics:
      [],

    tags,

    featured:
      metadata.featured === true ||
      metadata.featured === 'true' ||
      metadata.featured === '1',

    copyright:
      getCopyright(
        metadata,
        {
          holder:
            'Cántico de Fe Music',

          license:
            'Todos los derechos reservados'
        }
      ),

    source:
      'r2'
  };

  const coverState =
    resolveCover(
      baseHymn,
      objectMap
    );

  return {
    ...baseHymn,

    ...coverState,

    r2Metadata: {
      key,

      synced:
        true,

      dynamic:
        true,

      updatedAt:
        normalizeText(
          metadata
            .metadataUpdatedAt
        ) ||
        null,

      coverKey:
        coverState.coverKey,

      coverSynced:
        coverState.coverSynced
    }
  };
}

/* ==========================================================
   Servicio
   ========================================================== */

export class HymnLibraryService {

  constructor(
    catalog = hymnCatalog
  ) {
    this.baseCatalog =
      catalog.map(
        hymn => ({
          ...hymn
        })
      );

    this.catalog =
      this.baseCatalog.map(
        hymn => ({
          ...hymn
        })
      );

    this.r2Synced =
      false;
  }

  list() {
    return [
      ...this.catalog
    ];
  }

  findById(
    id
  ) {
    return (
      this.catalog.find(
        hymn =>
          hymn.id === id
      ) ||
      null
    );
  }

  search(
    query
  ) {
    return searchItems(
      this.catalog,
      query
    );
  }

  categories() {
    return [
      ...new Set(
        this.catalog
          .map(
            hymn =>
              hymn.category
          )
          .filter(Boolean)
      )
    ];
  }

  async syncR2Metadata() {
    try {
      const objects =
        await r2MediaService
          .listAll({
            limit:
              100
          });

      const safeObjects =
        Array.isArray(
          objects
        )
          ? objects
          : [];

      const objectMap =
        new Map(
          safeObjects
            .filter(
              object =>
                object?.key
            )
            .map(
              object => [
                object.key,
                object
              ]
            )
        );

      /* ------------------------------------------------------
         1. Sincronizar catálogo base
         ------------------------------------------------------ */

      const syncedBaseCatalog =
        this.baseCatalog.map(
          hymn => {
            const r2Key =
              normalizeText(
                hymn.r2Key
              );

            if (!r2Key) {
              const coverState =
                resolveCover(
                  hymn,
                  objectMap
                );

              return {
                ...hymn,

                ...coverState
              };
            }

            const object =
              objectMap.get(
                r2Key
              );

            if (!object) {
              const coverState =
                resolveCover(
                  hymn,
                  objectMap
                );

              return {
                ...hymn,

                ...coverState,

                r2Metadata: {
                  key:
                    r2Key,

                  synced:
                    false,

                  dynamic:
                    false,

                  updatedAt:
                    null,

                  coverKey:
                    coverState.coverKey,

                  coverSynced:
                    coverState.coverSynced
                }
              };
            }

            return mergeHymnWithR2Metadata(
              hymn,
              object,
              objectMap
            );
          }
        );

      /* ------------------------------------------------------
         2. Keys ya utilizadas por catálogo base
         ------------------------------------------------------ */

      const existingR2Keys =
        new Set(
          this.baseCatalog
            .map(
              hymn =>
                normalizeText(
                  hymn.r2Key
                )
            )
            .filter(Boolean)
        );

      const existingIds =
        new Set(
          syncedBaseCatalog
            .map(
              hymn =>
                normalizeText(
                  hymn.id
                )
            )
            .filter(Boolean)
        );

      /* ------------------------------------------------------
         3. Descubrir nuevos himnos R2
         ------------------------------------------------------ */

      const dynamicHymns =
        safeObjects
          .filter(
            object =>
              isDynamicR2Hymn(
                object
              )
          )
          .filter(
            object =>
              !existingR2Keys.has(
                normalizeText(
                  object.key
                )
              )
          )
          .map(
            object =>
              createDynamicR2Hymn(
                object,
                objectMap
              )
          )
          .filter(Boolean)
          .map(
            hymn => {
              let candidateId =
                hymn.id;

              if (
                !existingIds.has(
                  candidateId
                )
              ) {
                existingIds.add(
                  candidateId
                );

                return hymn;
              }

              let suffix =
                2;

              while (
                existingIds.has(
                  `${candidateId}-${suffix}`
                )
              ) {
                suffix +=
                  1;
              }

              candidateId =
                `${candidateId}-${suffix}`;

              existingIds.add(
                candidateId
              );

              return {
                ...hymn,

                id:
                  candidateId
              };
            }
          );

      /* ------------------------------------------------------
         4. Catálogo final
         ------------------------------------------------------ */

      this.catalog = [
        ...syncedBaseCatalog,
        ...dynamicHymns
      ];

      this.r2Synced =
        true;

      return {
        success:
          true,

        hymns:
          this.list(),

        dynamicCount:
          dynamicHymns.length
      };

    } catch (error) {
      console.error(
        '[HymnLibraryService] No se pudieron sincronizar los metadatos R2:',
        error
      );

      this.catalog =
        this.baseCatalog.map(
          hymn => ({
            ...hymn
          })
        );

      this.r2Synced =
        false;

      return {
        success:
          false,

        hymns:
          this.list(),

        dynamicCount:
          0,

        error
      };
    }
  }

  isR2Synced() {
    return this.r2Synced;
  }

}

/* ==========================================================
   Exports
   ========================================================== */

export {
  normalizeText,
  normalizeTags,
  getCopyright,
  getR2FileUrl,
  getObjectMetadata,
  getObjectContentType,
  isAudioObject,
  isHymnCategory,
  resolveCover,
  mergeHymnWithR2Metadata,
  slugify,
  getFileNameFromKey,
  stripExtension,
  stripUploadUuid,
  createDynamicHymnId,
  isDynamicR2Hymn,
  createDynamicR2Hymn
};
