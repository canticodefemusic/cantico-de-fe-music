/**
 * Cántico de Fe Music
 * V13.6.6 — R2 Media Service
 *
 * Funciones:
 * - Listar una página de archivos
 * - Primera página
 * - Página siguiente mediante cursor
 * - Compatibilidad con listAll()
 * - Consultar uploads
 * - Consultar archivos por fecha
 * - Utilidades de metadata
 * - Detectar tipo multimedia
 */

export class R2MediaService {

  constructor({
    endpoint = '/api/media'
  } = {}) {
    this.endpoint = endpoint;
  }

  buildUrl({
    prefix = '',
    cursor = null,
    limit = 50
  } = {}) {
    const params =
      new URLSearchParams();

    if (prefix) {
      params.set(
        'prefix',
        prefix
      );
    }

    if (cursor) {
      params.set(
        'cursor',
        cursor
      );
    }

    params.set(
      'limit',
      String(limit)
    );

    return `${
      this.endpoint
    }?${
      params.toString()
    }`;
  }

  async list({
    prefix = '',
    cursor = null,
    limit = 50
  } = {}) {
    const response =
      await fetch(
        this.buildUrl({
          prefix,
          cursor,
          limit
        }),
        {
          method: 'GET',

          headers: {
            Accept:
              'application/json'
          },

          cache:
            'no-store'
        }
      );

    let data;

    try {
      data =
        await response.json();
    } catch {
      throw new Error(
        'La API multimedia devolvió una respuesta inválida.'
      );
    }

    if (
      !response.ok ||
      !data?.success
    ) {
      throw new Error(
        data?.error ||
        `No se pudo cargar la biblioteca multimedia. HTTP ${response.status}`
      );
    }

    return {
      prefix:
        data.prefix || '',

      count:
        Number(
          data.count
        ) || 0,

      truncated:
        Boolean(
          data.truncated
        ),

      cursor:
        data.cursor || null,

      objects:
        Array.isArray(
          data.objects
        )
          ? data.objects
          : []
    };
  }

  async listPage({
    prefix = '',
    cursor = null,
    limit = 50
  } = {}) {
    return this.list({
      prefix,
      cursor,
      limit
    });
  }

  async listFirstPage({
    prefix = '',
    limit = 50
  } = {}) {
    return this.listPage({
      prefix,
      cursor: null,
      limit
    });
  }

  async listNextPage({
    prefix = '',
    cursor = null,
    limit = 50
  } = {}) {
    if (!cursor) {
      return {
        prefix,
        count: 0,
        truncated: false,
        cursor: null,
        objects: []
      };
    }

    return this.listPage({
      prefix,
      cursor,
      limit
    });
  }

  async listAll({
    prefix = '',
    limit = 100
  } = {}) {
    const objects = [];

    let cursor = null;
    let hasMore = true;

    while (hasMore) {
      const result =
        await this.listPage({
          prefix,
          cursor,
          limit
        });

      objects.push(
        ...result.objects
      );

      cursor =
        result.cursor;

      hasMore =
        result.truncated &&
        Boolean(cursor);
    }

    return objects;
  }

  async getUploads({
    limit = 100
  } = {}) {
    return this.listAll({
      prefix:
        'uploads/',

      limit
    });
  }

  async getByDate(
    date,
    {
      limit = 100
    } = {}
  ) {
    if (!date) {
      return [];
    }

    return this.listAll({
      prefix:
        `uploads/${date}/`,

      limit
    });
  }

  getOriginalName(
    object
  ) {
    return (
      object
        ?.customMetadata
        ?.originalName ||
      this.getFileName(
        object?.key
      )
    );
  }

  getFileName(
    key = ''
  ) {
    const parts =
      String(key)
        .split('/');

    return (
      parts[
        parts.length - 1
      ] || ''
    );
  }

  getContentType(
    object
  ) {
    return (
      object
        ?.httpMetadata
        ?.contentType ||
      'application/octet-stream'
    );
  }

  getMediaType(
    object
  ) {
    const contentType =
      this.getContentType(
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

    return 'file';
  }

}

export const r2MediaService =
  new R2MediaService();

export default
  r2MediaService;
