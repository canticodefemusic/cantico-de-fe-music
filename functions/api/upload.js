// V13.2.1 Preview R2 binding deployment
function createObjectKey(fileName = 'file') {
  const safeName =
    String(fileName)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const normalizedName =
    safeName || 'file';

  const id =
    crypto.randomUUID();

  const date =
    new Date()
      .toISOString()
      .slice(0, 10);

  return [
    'uploads',
    date,
    `${id}-${normalizedName}`
  ].join('/');
}

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

export function onRequestGet({
  env
}) {
  const connected =
    Boolean(env.MEDIA_BUCKET);

  return jsonResponse(
    {
      success: connected,

      service:
        'cantico-r2-upload-api',

      binding:
        'MEDIA_BUCKET',

      bucketConnected:
        connected,

      message:
        connected
          ? 'R2 bucket binding is connected.'
          : 'R2 bucket binding is not configured.'
    },
    connected
      ? 200
      : 500
  );
}

export async function onRequestPost(
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

  const contentType =
    request.headers.get(
      'Content-Type'
    ) || '';

  if (
    !contentType.includes(
      'multipart/form-data'
    )
  ) {
    return jsonResponse(
      {
        success: false,
        error:
          'Expected multipart/form-data.'
      },
      415
    );
  }

  try {
    const formData =
      await request.formData();

    const file =
      formData.get('file');

    if (
      !file ||
      typeof file.stream !==
        'function'
    ) {
      return jsonResponse(
        {
          success: false,
          error:
            'No valid file was provided.'
        },
        400
      );
    }

    if (!file.size) {
      return jsonResponse(
        {
          success: false,
          error:
            'The file is empty.'
        },
        400
      );
    }

    const key =
      createObjectKey(
        file.name
      );

    await env.MEDIA_BUCKET.put(
      key,
      file.stream(),
      {
        httpMetadata: {
          contentType:
            file.type ||
            'application/octet-stream'
        },

        customMetadata: {
          originalName:
            file.name ||
            'file'
        }
      }
    );

    return jsonResponse({
      success: true,

      object: {
        key,

        name:
          file.name || 'file',

        type:
          file.type ||
          'application/octet-stream',

        size:
          file.size,

        uploadedAt:
          new Date().toISOString()
      }
    });

  } catch (error) {
    console.error(
      '[R2 Upload API]',
      error
    );

    return jsonResponse(
      {
        success: false,

        error:
          'Unable to upload the file.'
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
