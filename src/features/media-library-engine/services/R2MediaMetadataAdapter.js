/**
 * Cántico de Fe Music
 * V13.4.3 — R2 Media Metadata Adapter
 *
 * Convierte objetos de Cloudflare R2
 * al modelo utilizado por el
 * Media Metadata Editor.
 */

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
}

function getFileName(
  key = ''
) {
  const parts =
    normalizeText(key)
      .split('/');

  return (
    parts[
      parts.length - 1
    ] || ''
  );
}

function getOriginalName(
  object = {}
) {
  return (
    normalizeText(
      object
        ?.customMetadata
        ?.originalName
    ) ||
    getFileName(
      object?.key
    )
  );
}

function getContentType(
  object = {}
) {
  return (
    normalizeText(
      object
        ?.httpMetadata
        ?.contentType
    ) ||
    'application/octet-stream'
  );
}

function getExtension(
  object = {}
) {
  const metadataExtension =
    normalizeText(
      object
        ?.customMetadata
        ?.extension
    )
      .replace(
        /^\./,
        ''
      )
      .toLowerCase();

  if (metadataExtension) {
    return metadataExtension;
  }

  const name =
    getOriginalName(
      object
    );

  const dotIndex =
    name.lastIndexOf('.');

  if (
    dotIndex === -1 ||
    dotIndex ===
      name.length - 1
  ) {
    return '';
  }

  return name
    .slice(
      dotIndex + 1
    )
    .toLowerCase();
}

function getMediaType(
  object = {}
) {
  const contentType =
    getContentType(
      object
    );

  if (
    contentType.startsWith(
      'image/'
    )
  ) {
    return 'image';
  }

  if (
    contentType.startsWith(
      'audio/'
    )
  ) {
    return 'audio';
  }

  if (
    contentType.startsWith(
      'video/'
    )
  ) {
    return 'video';
  }

  if (
    contentType ===
    'application/pdf'
  ) {
    return 'document';
  }

  return 'other';
}

function getMediaUrl(
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

function formatFileSize(
  bytes = 0
) {
  const size =
    Number(bytes);

  if (
    !Number.isFinite(size) ||
    size < 0
  ) {
    return 'No disponible';
  }

  if (size === 0) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB'
  ];

  const unitIndex =
    Math.min(
      Math.floor(
        Math.log(size) /
        Math.log(1024)
      ),
      units.length - 1
    );

  const value =
    size /
    Math.pow(
      1024,
      unitIndex
    );

  return `${
    value.toLocaleString(
      'es-US',
      {
        maximumFractionDigits:
          unitIndex === 0
            ? 0
            : 2
      }
    )
  } ${
    units[unitIndex]
  }`;
}

function normalizeBooleanMetadata(
  value
) {
  if (
    value === true ||
    value === 'true' ||
    value === '1'
  ) {
    return true;
  }

  if (
    value === false ||
    value === 'false' ||
    value === '0'
  ) {
    return false;
  }

  return null;
}

export function adaptR2MediaObject(
  object = null
) {
  if (
    !object ||
    !normalizeText(
      object.key
    )
  ) {
    return null;
  }

  const key =
    normalizeText(
      object.key
    );

  const originalName =
    getOriginalName(
      object
    );

  const contentType =
    getContentType(
      object
    );

  const extension =
    getExtension(
      object
    );

  const customMetadata =
    object.customMetadata &&
    typeof object.customMetadata ===
      'object'
      ? {
          ...object.customMetadata
        }
      : {};

  const httpMetadata =
    object.httpMetadata &&
    typeof object.httpMetadata ===
      'object'
      ? {
          ...object.httpMetadata
        }
      : {};

  const uploaded =
    normalizeText(
      object.uploaded
    );

  return {
    id:
      key,

    name:
      originalName,

    description:
      '',

    type:
      getMediaType(
        object
      ),

    category:
      'uploads',

    path:
      getMediaUrl(
        key
      ),

    mimeType:
      contentType,

    extension,

    alt:
      '',

    tags:
      [],

    featured:
      false,

    order:
      0,

    metadata: {
      width:
        null,

      height:
        null,

      duration:
        null,

      fileSize:
        formatFileSize(
          object.size
        )
    },

    r2: {
      key,

      size:
        Number(
          object.size
        ) || 0,

      etag:
        normalizeText(
          object.etag
        ),

      uploaded:
        uploaded || null,

      originalName,

      normalizedName:
        normalizeText(
          customMetadata
            .normalizedName
        ),

      extension,

      contentType,

      signatureValidated:
        normalizeBooleanMetadata(
          customMetadata
            .signatureValidated
        ),

      httpMetadata,

      customMetadata,

      url:
        getMediaUrl(
          key
        )
    },

    source:
      'r2'
  };
}

export {
  normalizeText,
  getFileName,
  getOriginalName,
  getContentType,
  getExtension,
  getMediaType,
  getMediaUrl,
  formatFileSize,
  normalizeBooleanMetadata
};

export default
  adaptR2MediaObject;
