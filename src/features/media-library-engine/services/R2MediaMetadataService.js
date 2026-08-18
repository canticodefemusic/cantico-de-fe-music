/**
 * Cántico de Fe Music
 * V13.4.48 — R2 Partial Metadata Updates
 *
 * Funciones:
 * - Leer metadatos persistentes desde R2
 * - Guardar metadatos persistentes en R2
 * - Actualizar campos individuales sin borrar los demás
 * - Mantener coverKey, tags, copyright y featured
 * - Normalizar respuestas de la API
 */

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
  const source =
    Array.isArray(value)
      ? value
      : String(
          value || ''
        ).split(',');

  return [
    ...new Set(
      source
        .map(
          normalizeText
        )
        .filter(Boolean)
    )
  ];
}

function normalizeCopyright(
  value = {}
) {
  const source =
    value &&
    typeof value ===
      'object'
      ? value
      : {};

  return {
    author:
      normalizeText(
        source.author
      ),

    holder:
      normalizeText(
        source.holder
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

function normalizeMetadata(
  value = {}
) {
  const source =
    value &&
    typeof value ===
      'object'
      ? value
      : {};

  return {
    displayName:
      normalizeText(
        source.displayName
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

    coverKey:
      normalizeText(
        source.coverKey
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

    metadataUpdatedAt:
      normalizeText(
        source.metadataUpdatedAt
      )
  };
}

function mergeMetadata(
  current = {},
  changes = {}
) {
  const currentMetadata =
    normalizeMetadata(
      current
    );

  const source =
    changes &&
    typeof changes ===
      'object'
      ? changes
      : {};

  const merged = {
    ...currentMetadata
  };

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      'displayName'
    )
  ) {
    merged.displayName =
      normalizeText(
        source.displayName
      );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      'description'
    )
  ) {
    merged.description =
      normalizeText(
        source.description
      );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      'alt'
    )
  ) {
    merged.alt =
      normalizeText(
        source.alt
      );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      'category'
    )
  ) {
    merged.category =
      normalizeText(
        source.category
      );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      'coverKey'
    )
  ) {
    merged.coverKey =
      normalizeText(
        source.coverKey
      );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      'tags'
    )
  ) {
    merged.tags =
      normalizeTags(
        source.tags
      );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      'featured'
    )
  ) {
    merged.featured =
      Boolean(
        source.featured
      );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      source,
      'copyright'
    )
  ) {
    merged.copyright = {
      ...currentMetadata
        .copyright,

      ...normalizeCopyright(
        {
          ...currentMetadata
            .copyright,

          ...source
            .copyright
        }
      )
    };
  }

  return merged;
}

function buildUrl(
  key
) {
  const cleanKey =
    normalizeText(
      key
    );

  if (!cleanKey) {
    return '';
  }

  return (
    '/api/media/metadata?key=' +
    encodeURIComponent(
      cleanKey
    )
  );
}

async function parseResponse(
  response
) {
  let data = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (
    !response.ok ||
    !data?.success
  ) {
    throw new Error(
      data?.error ||
      `No se pudieron procesar los metadatos. HTTP ${response.status}`
    );
  }

  return data;
}

export class R2MediaMetadataService {

  async get(
    key
  ) {
    const url =
      buildUrl(
        key
      );

    if (!url) {
      throw new Error(
        'No se pudo identificar el archivo multimedia.'
      );
    }

    const response =
      await fetch(
        url,
        {
          method:
            'GET',

          headers: {
            Accept:
              'application/json'
          },

          cache:
            'no-store'
        }
      );

    const data =
      await parseResponse(
        response
      );

    return {
      key:
        normalizeText(
          data.key
        ),

      metadata:
        normalizeMetadata(
          data.metadata
        )
    };
  }

  async update(
    key,
    metadata = {}
  ) {
    const url =
      buildUrl(
        key
      );

    if (!url) {
      throw new Error(
        'No se pudo identificar el archivo multimedia.'
      );
    }

    const normalized =
      normalizeMetadata(
        metadata
      );

    const response =
      await fetch(
        url,
        {
          method:
            'PUT',

          headers: {
            Accept:
              'application/json',

            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              normalized
            )
        }
      );

    const data =
      await parseResponse(
        response
      );

    return {
      key:
        normalizeText(
          data.key
        ),

      metadata:
        normalizeMetadata(
          data.metadata
        )
    };
  }

  async patch(
    key,
    changes = {}
  ) {
    const current =
      await this.get(
        key
      );

    const merged =
      mergeMetadata(
        current.metadata,
        changes
      );

    return this.update(
      key,
      merged
    );
  }

}

export const r2MediaMetadataService =
  new R2MediaMetadataService();

export {
  normalizeText,
  normalizeTags,
  normalizeCopyright,
  normalizeMetadata,
  mergeMetadata,
  buildUrl
};

export default
  r2MediaMetadataService;
