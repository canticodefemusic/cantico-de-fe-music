// V13.2.5 — Server-Side File Signature Validation

const MAX_FILE_SIZE =
  50 * 1024 * 1024;

const ALLOWED_FILE_RULES = {
  'image/jpeg': {
    extensions: [
      'jpg',
      'jpeg'
    ],
    signature: 'jpeg'
  },

  'image/png': {
    extensions: [
      'png'
    ],
    signature: 'png'
  },

  'image/webp': {
    extensions: [
      'webp'
    ],
    signature: 'webp'
  },

  'audio/mpeg': {
    extensions: [
      'mp3'
    ],
    signature: 'mp3'
  },

  'audio/mp4': {
    extensions: [
      'm4a',
      'mp4'
    ],
    signature: 'mp4'
  },

  'audio/wav': {
    extensions: [
      'wav'
    ],
    signature: 'wav'
  },

  'audio/flac': {
    extensions: [
      'flac'
    ],
    signature: 'flac'
  },

  'video/mp4': {
    extensions: [
      'mp4'
    ],
    signature: 'mp4'
  },

  'video/webm': {
    extensions: [
      'webm'
    ],
    signature: 'webm'
  },

  'application/pdf': {
    extensions: [
      'pdf'
    ],
    signature: 'pdf'
  }
};


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


function bytesMatch(
  bytes,
  expected,
  offset = 0
) {
  if (
    bytes.length <
    offset + expected.length
  ) {
    return false;
  }

  return expected.every(
    (value, index) =>
      bytes[offset + index] ===
      value
  );
}


function asciiMatch(
  bytes,
  text,
  offset = 0
) {
  const expected =
    Array.from(text)
      .map(
        character =>
          character.charCodeAt(0)
      );

  return bytesMatch(
    bytes,
    expected,
    offset
  );
}


function isJpeg(bytes) {
  return bytesMatch(
    bytes,
    [
      0xff,
      0xd8,
      0xff
    ]
  );
}


function isPng(bytes) {
  return bytesMatch(
    bytes,
    [
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a
    ]
  );
}


function isWebp(bytes) {
  return (
    asciiMatch(
      bytes,
      'RIFF',
      0
    ) &&
    asciiMatch(
      bytes,
      'WEBP',
      8
    )
  );
}


function isPdf(bytes) {
  return asciiMatch(
    bytes,
    '%PDF-',
    0
  );
}


function isMp3(bytes) {
  const hasId3Header =
    asciiMatch(
      bytes,
      'ID3',
      0
    );

  const hasFrameSync =
    bytes.length >= 2 &&
    bytes[0] === 0xff &&
    (
      bytes[1] & 0xe0
    ) === 0xe0;

  return (
    hasId3Header ||
    hasFrameSync
  );
}


function isMp4(bytes) {
  return (
    bytes.length >= 12 &&
    asciiMatch(
      bytes,
      'ftyp',
      4
    )
  );
}


function isWav(bytes) {
  return (
    asciiMatch(
      bytes,
      'RIFF',
      0
    ) &&
    asciiMatch(
      bytes,
      'WAVE',
      8
    )
  );
}


function isFlac(bytes) {
  return asciiMatch(
    bytes,
    'fLaC',
    0
  );
}


function isWebm(bytes) {
  return bytesMatch(
    bytes,
    [
      0x1a,
      0x45,
      0xdf,
      0xa3
    ],
    0
  );
}


function validateSignature(
  signature,
  bytes
) {
  switch (signature) {
    case 'jpeg':
      return isJpeg(bytes);

    case 'png':
      return isPng(bytes);

    case 'webp':
      return isWebp(bytes);

    case 'pdf':
      return isPdf(bytes);

    case 'mp3':
      return isMp3(bytes);

    case 'mp4':
      return isMp4(bytes);

    case 'wav':
      return isWav(bytes);

    case 'flac':
      return isFlac(bytes);

    case 'webm':
      return isWebm(bytes);

    default:
      return false;
  }
}


async function readSignatureBytes(
  file
) {
  const header =
    file.slice(
      0,
      32
    );

  const buffer =
    await header.arrayBuffer();

  return new Uint8Array(
    buffer
  );
}


async function validateUploadedFile(
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

  const rule =
    ALLOWED_FILE_RULES[
      mimeType
    ];

  if (!rule) {
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
    !rule.extensions.includes(
      extension
    )
  ) {
    return {
      valid: false,
      status: 415,
      error:
        'The file extension does not match the declared file type.'
    };
  }

  const signatureBytes =
    await readSignatureBytes(
      file
    );

  const signatureValid =
    validateSignature(
      rule.signature,
      signatureBytes
    );

  if (!signatureValid) {
    return {
      valid: false,
      status: 415,
      error:
        'The file contents do not match the declared file type.'
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

      version:
        'V13.2.5',

      binding:
        'MEDIA_BUCKET',

      bucketConnected:
        connected,

      maxFileSize:
        MAX_FILE_SIZE,

      maxFileSizeMB:
        50,

      allowedMimeTypes:
        Object.keys(
          ALLOWED_FILE_RULES
        ),

      allowedExtensions:
        Array.from(
          new Set(
            Object.values(
              ALLOWED_FILE_RULES
            )
              .flatMap(
                rule =>
                  rule.extensions
              )
          )
        ),

      signatureValidation:
        true,

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
      await validateUploadedFile(
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

          validatedMimeType:
            validation.mimeType,

          signatureValidated:
            'true',

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

        signatureValidated:
          true,

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
