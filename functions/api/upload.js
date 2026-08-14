// V13.2.3 — Server-Side Upload Validation

const MAX_FILE_SIZE =
  50 * 1024 * 1024;

const ALLOWED_MIME_TYPES =
  new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',

    'audio/mpeg',
    'audio/mp4',
    'audio/x-m4a',
    'audio/wav',
    'audio/x-wav',
    'audio/ogg',

    'video/mp4',
    'video/webm',

    'application/pdf'
  ]);

const ALLOWED_EXTENSIONS =
  new Set([
    'jpg',
    'jpeg',
    'png',
    'webp',
    'gif',

    'mp3',
    'm4a',
    'wav',
    'ogg',

    'mp4',
    'webm',

    'pdf'
  ]);


function normalizeFileName(
  fileName = 'file'
) {
  const value =
    String(fileName)
      .trim()
      .toLowerCase();

  const lastDotIndex =
    value.lastIndexOf('.');

  const rawBaseName =
    lastDotIndex > 0
      ? value.slice(
          0,
          lastDotIndex
        )
      : value;

  const rawExtension =
    lastDotIndex > 0
      ? value.slice(
          lastDotIndex + 1
        )
      : '';

  const safeBaseName =
    rawBaseName
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .replace(
        /[^a-z0-9_-]+/g,
        '-'
      )
      .replace(
        /-+/g,
        '-'
      )
      .replace(
        /^[-_]+|[-_]+$/g,
        ''
      )
      .slice(
        0,
        120
      );

  const safeExtension =
    rawExtension
      .replace(
        /[^a-z0-9]+/g,
        ''
      )
      .slice(
        0,
        12
      );

  const baseName =
    safeBaseName ||
    'file';

  return safeExtension
    ? `${baseName}.${safeExtension}`
    : baseName;
}


function getFileExtension(
  fileName = ''
) {
  const value =
    String(fileName)
      .trim()
      .toLowerCase();

  const lastDotIndex =
    value.lastIndexOf('.');

  if (
    lastDotIndex <= 0 ||
    lastDotIndex ===
      value.length - 1
  ) {
    return '';
  }

  return value.slice(
    lastDotIndex + 1
  );
}


function createObjectKey(
  fileName = 'file'
) {
  const normalizedName =
    normalizeFileName(
      fileName
    );

  const id =
    crypto.randomUUID();

  const date =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );

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


function validateUploadedFile(
  file
) {
  if (
    !file ||
    typeof file.stream !==
      'function'
  ) {
    return {
      valid: false,
      status: 400,
      error:
        'No valid file was provided.'
    };
  }

  const fileSize =
    Number(file.size);

  if (
    !Number.isFinite(
      fileSize
    ) ||
    fileSize <= 0
  ) {
    return {
      valid: false,
      status: 400,
      error:
        'The file is empty.'
    };
  }

  if (
    fileSize >
    MAX_FILE_SIZE
  ) {
    return {
      valid: false,
      status: 413,
      error:
        'The file exceeds the maximum allowed size of 50 MB.'
    };
  }

  const mimeType =
    String(
      file.type || ''
    )
      .trim()
      .toLowerCase();

  if (
    !mimeType ||
    !ALLOWED_MIME_TYPES.has(
      mimeType
    )
  ) {
    return {
      valid: false,
      status: 415,
      error:
        'The file type is not allowed.'
    };
  }

  const extension =
    getFileExtension(
      file.name
    );

  if (
    !extension ||
    !ALLOWED_EXTENSIONS.has(
      extension
    )
  ) {
    return {
      valid: false,
      status: 415,
      error:
        'The file extension is not allowed.'
    };
  }

  return {
    valid: true,
    mimeType,
    extension,
    fileSize
  };
}


export function onRequestGet({
  env
}) {
  const connected =
    Boolean(
      env.MEDIA_BUCKET
    );

  return jsonResponse(
    {
      success:
        connected,

      service:
        'cantico-r2-upload-api',

      binding:
        'MEDIA_BUCKET',

      bucketConnected:
        connected,

      maxFileSize:
        MAX_FILE_SIZE,

      maxFileSizeMB:
        50,

      allowedMimeTypes:
        Array.from(
          ALLOWED_MIME_TYPES
        ),

      allowedExtensions:
        Array.from(
          ALLOWED_EXTENSIONS
        ),

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

  if (
    !env.MEDIA_BUCKET
  ) {
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
      formData.get(
        'file'
      );

    const validation =
      validateUploadedFile(
        file
      );

    if (
      !validation.valid
    ) {
      return jsonResponse(
        {
          success: false,

          error:
            validation.error
        },

        validation.status
      );
    }

    const normalizedName =
      normalizeFileName(
        file.name
      );

    const key =
      createObjectKey(
        normalizedName
      );

    const uploadedAt =
      new Date()
        .toISOString();

    await env.MEDIA_BUCKET.put(
      key,
      file.stream(),
      {
        httpMetadata: {
          contentType:
            validation.mimeType
        },

        customMetadata: {
          originalName:
            file.name ||
            'file',

          normalizedName,

          extension:
            validation.extension,

          uploadedAt
        }
      }
    );

    return jsonResponse({
      success: true,

      object: {
        key,

        name:
          file.name ||
          'file',

        normalizedName,

        type:
          validation.mimeType,

        extension:
          validation.extension,

        size:
          validation.fileSize,

        uploadedAt
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
