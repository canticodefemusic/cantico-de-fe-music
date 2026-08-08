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

function getObjectKey(
  request
) {
  const url =
    new URL(
      request.url
    );

  return (
    url.searchParams.get(
      'key'
    ) || ''
  ).trim();
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
    getObjectKey(
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
      await env.MEDIA_BUCKET.get(
        key,
        {
          onlyIf:
            request.headers,

          range:
            request.headers
        }
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

    if (!('body' in object)) {
      return new Response(
        null,
        {
          status: 412
        }
      );
    }

    const headers =
      new Headers();

    object.writeHttpMetadata(
      headers
    );

    headers.set(
      'ETag',
      object.httpEtag
    );

    headers.set(
      'Accept-Ranges',
      'bytes'
    );

    headers.set(
      'Cache-Control',
      'public, max-age=3600'
    );

    if (
      !headers.has(
        'Content-Type'
      )
    ) {
      headers.set(
        'Content-Type',
        'application/octet-stream'
      );
    }

    let status = 200;

    if (object.range) {
      const offset =
        object.range.offset || 0;

      const length =
        object.range.length ||
        object.size;

      const end =
        offset +
        length -
        1;

      headers.set(
        'Content-Range',
        `bytes ${offset}-${end}/${object.size}`
      );

      headers.set(
        'Content-Length',
        String(length)
      );

      status = 206;
    } else {
      headers.set(
        'Content-Length',
        String(object.size)
      );
    }

    return new Response(
      object.body,
      {
        status,
        headers
      }
    );

  } catch (error) {
    console.error(
      '[R2 Media File API]',
      error
    );

    return jsonResponse(
      {
        success: false,
        error:
          'Unable to load media object.'
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
