function jsonResponse(
  data,
  status = 200
) {
  return new Response(
    JSON.stringify(data, null, 2),
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

function normalizeObject(object) {
  return {
    key:
      object.key,

    size:
      object.size,

    etag:
      object.etag,

    uploaded:
      object.uploaded
        ? object.uploaded.toISOString()
        : null,

    httpMetadata:
      object.httpMetadata || null,

    customMetadata:
      object.customMetadata || null
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

  try {
    const url =
      new URL(
        request.url
      );

    const prefix =
      url.searchParams.get(
        'prefix'
      ) || '';

    const cursor =
      url.searchParams.get(
        'cursor'
      ) || undefined;

    const limitValue =
      Number(
        url.searchParams.get(
          'limit'
        )
      );

    const limit =
      Number.isFinite(limitValue)
        ? Math.min(
            100,
            Math.max(
              1,
              limitValue
            )
          )
        : 50;

    const result =
      await env.MEDIA_BUCKET.list({
        prefix,

        cursor,

        limit,

        include: [
          'httpMetadata',
          'customMetadata'
        ]
      });

    return jsonResponse({
      success: true,

      prefix,

      count:
        result.objects.length,

      truncated:
        result.truncated,

      cursor:
        result.cursor || null,

      objects:
        result.objects.map(
          normalizeObject
        )
    });

  } catch (error) {
    console.error(
      '[Media API]',
      error
    );

    return jsonResponse(
      {
        success: false,

        error:
          'Unable to list media objects.'
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
