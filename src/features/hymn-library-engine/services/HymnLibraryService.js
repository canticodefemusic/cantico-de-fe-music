/**
 * Cántico de Fe Music
 * V13.4.19 — Hymn Library R2 Metadata & Cover Sync
 *
 * Funciones:
 * - Mantener hymnCatalog como fuente base
 * - Sincronizar metadatos persistentes desde R2
 * - Relacionar himnos mediante r2Key
 * - Resolver coverKey a una URL R2 real
 * - Mantener list(), search() y findById()
 * - No modificar IDs ni rutas de audio
 */

import {
  hymnCatalog
} from '../data/hymnCatalog.js';

import {
  searchItems
} from '../../smart-search-engine/index.js';

import r2MediaService
  from '../../media-library-engine/services/R2MediaService.js';

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
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
    normalizeText(
      coverObject
        ?.httpMetadata
        ?.contentType
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
    object.customMetadata &&
    typeof object.customMetadata ===
      'object'
      ? object.customMetadata
      : {};

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

  const coverState =
    resolveCover(
      hymn,
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

      const objectMap =
        new Map(
          objects
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

      this.catalog =
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

      this.r2Synced =
        true;

      return {
        success:
          true,

        hymns:
          this.list()
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

        error
      };
    }
  }

  isR2Synced() {
    return this.r2Synced;
  }

}

export {
  normalizeText,
  normalizeTags,
  getCopyright,
  getR2FileUrl,
  resolveCover,
  mergeHymnWithR2Metadata
};
