/**
 * Cántico de Fe Music
 * V13.4.8 — R2 Media Metadata Service
 *
 * Funciones:
 * - Leer metadatos persistentes desde R2
 * - Guardar metadatos persistentes en R2
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

}

export const r2MediaMetadataService =
  new R2MediaMetadataService();

export {
  normalizeText,
  normalizeTags,
  normalizeCopyright,
  normalizeMetadata,
  buildUrl
};

export default
  r2MediaMetadataService;
