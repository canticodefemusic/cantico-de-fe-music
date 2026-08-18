function jsonResponse(
  data,
  status = 200
) {
  return new Response(
    JSON.stringify(
      data,
      null,
      2
    ),
    {
      status,

      headers: {
        'Content-Type':
          'application/json; charset=utf-8',

        'Cache-Control':
          'no-store'
      }
    }
  );
}

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
}

function normalizeTags(
  value
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

function normalizeBoolean(
  value
) {
  return (
    value === true ||
    value === 'true' ||
    value === '1'
  );
}

function getKey(
  request
) {
  const url =
    new URL(
      request.url
    );

  return normalizeText(
    url.searchParams.get(
      'key'
    )
  );
}

function safeJsonParse(
  value,
  fallback
) {
  try {
    return JSON.parse(
      value
    );
  } catch {
    return fallback;
  }
}

function readEditableMetadata(
  customMetadata = {}
) {
  return {
    displayName:
      normalizeText(
        customMetadata
          .displayName
      ),

    description:
      normalizeText(
        customMetadata
          .description
      ),

    alt:
      normalizeText(
        customMetadata
          .alt
      ),

    category:
      normalizeText(
        customMetadata
          .category
      ),

    coverKey:
      normalizeText(
        customMetadata
          .coverKey
      ),
    
    tags:
      normalizeTags(
        safeJsonParse(
          customMetadata
            .tags ||
          '[]',
          []
        )
      ),

    featured:
      normalizeBoolean(
        customMetadata
          .featured
      ),

    copyright: {
      author:
        normalizeText(
          customMetadata
            .copyrightAuthor
        ),

      holder:
        normalizeText(
          customMetadata
            .copyrightHolder
        ),

      license:
        normalizeText(
          customMetadata
            .copyrightLicense
        ),

      source:
        normalizeText(
          customMetadata
            .copyrightSource
        ),

      year:
        normalizeText(
          customMetadata
            .copyrightYear
        )
    },

    metadataUpdatedAt:
      normalizeText(
        customMetadata
          .metadataUpdatedAt
      )
  };
}

function buildMetadata(
  currentMetadata = {},
  input = {}
) {
  const copyright =
    input.copyright &&
    typeof input.copyright ===
      'object'
      ? input.copyright
      : {};

  return {
    ...currentMetadata,

    displayName:
      normalizeText(
        input.displayName
      ),

    description:
      normalizeText(
        input.description
      ),

    alt:
      normalizeText(
        input.alt
      ),

    category:
      normalizeText(
        input.category
      ),

    coverKey:
      normalizeText(
        input.coverKey
      ),
    
    tags:
      JSON.stringify(
        normalizeTags(
          input.tags
        )
      ),

    featured:
      normalizeBoolean(
        input.featured
      )
        ? 'true'
        : 'false',

    copyrightAuthor:
      normalizeText(
        copyright.author
      ),

    copyrightHolder:
      normalizeText(
        copyright.holder
      ),

    copyrightLicense:
      normalizeText(
        copyright.license
      ),

    copyrightSource:
      normalizeText(
        copyright.source
      ),

    copyrightYear:
      normalizeText(
        copyright.year
      ),

    metadataUpdatedAt:
      new Date()
        .toISOString()
  };
}

export async function onRequestGet(
  context
) {
  const {
    request,
    env
  } = context;

  if (!env.MEDIA_BUCKET) {
    return jsonResponse(
      {
        success: false,
        error:
          'R2 bucket binding is not configured.'
      },
      500
    );
  }

  const key =
    getKey(
      request
    );

  if (!key) {
    return jsonResponse(
      {
        success: false,
        error:
          'Missing media key.'
      },
      400
    );
  }

  try {
    const object =
      await env.MEDIA_BUCKET.head(
        key
      );

    if (!object) {
      return jsonResponse(
        {
          success: false,
          error:
            'Media object not found.'
        },
        404
      );
    }

    return jsonResponse({
      success: true,

      key,

      metadata:
        readEditableMetadata(
          object.customMetadata ||
          {}
        )
    });

  } catch (error) {
    console.error(
      '[R2 Media Metadata GET]',
      error
    );

    return jsonResponse(
      {
        success: false,
        error:
          'Unable to read media metadata.'
      },
      500
    );
  }
}

export async function onRequestPut(
  context
) {
  const {
    request,
    env
  } = context;

  if (!env.MEDIA_BUCKET) {
    return jsonResponse(
      {
        success: false,
        error:
          'R2 bucket binding is not configured.'
      },
      500
    );
  }

  const key =
    getKey(
      request
    );

  if (!key) {
    return jsonResponse(
      {
        success: false,
        error:
          'Missing media key.'
      },
      400
    );
  }

  let input = null;

  try {
    input =
      await request.json();
  } catch {
    return jsonResponse(
      {
        success: false,
        error:
          'Invalid JSON body.'
      },
      400
    );
  }

  try {
    const object =
      await env.MEDIA_BUCKET.get(
        key
      );

    if (!object) {
      return jsonResponse(
        {
          success: false,
          error:
            'Media object not found.'
        },
        404
      );
    }

    const customMetadata =
      buildMetadata(
        object.customMetadata ||
        {},
        input
      );

    await env.MEDIA_BUCKET.put(
      key,
      object.body,
      {
        httpMetadata:
          object.httpMetadata,

        customMetadata
      }
    );

    return jsonResponse({
      success: true,

      key,

      metadata:
        readEditableMetadata(
          customMetadata
        )
    });

  } catch (error) {
    console.error(
      '[R2 Media Metadata PUT]',
      error
    );

    return jsonResponse(
      {
        success: false,
        error:
          'Unable to update media metadata.'
      },
      500
    );
  }
}

export function onRequest() {
  return jsonResponse(
    {
      success: false,
      error:
        'Method not allowed.'
    },
    405
  );
}
