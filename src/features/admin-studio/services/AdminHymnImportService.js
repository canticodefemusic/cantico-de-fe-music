/**
 * Cántico de Fe Music
 * V12.5 — Admin Hymn Import Service
 */

import AdminStorage
  from './AdminStorage.js';

import AdminHymnService
  from './AdminHymnService.js';

const DRAFT_STORAGE_KEY =
  'hymn-drafts';

function cloneValue(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return value;
  }

  return JSON.parse(
    JSON.stringify(value)
  );
}

function normalizeText(value = '') {
  return String(
    value ?? ''
  ).trim();
}

function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value
      .map(item =>
        normalizeText(item)
      )
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item =>
        normalizeText(item)
      )
      .filter(Boolean);
  }

  return [];
}

function normalizeLyrics(value) {
  if (Array.isArray(value)) {
    return value.map(line =>
      String(line ?? '')
    );
  }

  if (typeof value === 'string') {
    return value
      .replace(/\r\n/g, '\n')
      .split('\n');
  }

  return [];
}

function normalizeCopyright(
  value = {}
) {
  return {
    holder:
      normalizeText(
        value.holder ||
        'Cántico de Fe Music'
      ),

    license:
      normalizeText(
        value.license ||
        'Todos los derechos reservados'
      )
  };
}

function normalizeImportedHymn(
  hymn = {}
) {
  const audio =
    normalizeText(
      hymn.audio ||
      hymn.src
    );

  return {
    id:
      normalizeText(
        hymn.id
      ),

    title:
      normalizeText(
        hymn.title
      ),

    subtitle:
      normalizeText(
        hymn.subtitle
      ),

    category:
      normalizeText(
        hymn.category
      ),

    theme:
      normalizeText(
        hymn.theme
      ),

    scriptures:
      normalizeStringList(
        hymn.scriptures ||
        hymn.scripture
      ),

    artist:
      normalizeText(
        hymn.artist ||
        'Cántico de Fe Music'
      ),

    audio,

    src:
      normalizeText(
        hymn.src ||
        audio
      ),

    cover:
      normalizeText(
        hymn.cover
      ),

    duration:
      normalizeText(
        hymn.duration
      ),

    description:
      normalizeText(
        hymn.description
      ),

    lyrics:
      normalizeLyrics(
        hymn.lyrics
      ),

    tags:
      normalizeStringList(
        hymn.tags
      ),

    copyright:
      normalizeCopyright(
        hymn.copyright
      ),

    admin: {
      source: 'draft',
      status: 'draft',
      createdAt:
        hymn.admin?.createdAt ||
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString()
    }
  };
}

function extractHymnsFromPayload(
  payload
) {
  if (
    Array.isArray(payload)
  ) {
    return payload;
  }

  if (
    Array.isArray(
      payload?.hymns
    )
  ) {
    return payload.hymns;
  }

  if (
    Array.isArray(
      payload?.drafts
    )
  ) {
    return payload.drafts;
  }

  if (
    Array.isArray(
      payload?.merged
    )
  ) {
    return payload.merged;
  }

  if (
    Array.isArray(
      payload?.data?.hymns
    )
  ) {
    return payload.data.hymns;
  }

  return null;
}

function validateImportedHymns(
  hymns = []
) {
  const errors = [];
  const warnings = [];
  const ids = new Set();

  hymns.forEach(
    (hymn, index) => {
      const position =
        index + 1;

      if (
        !hymn ||
        typeof hymn !== 'object'
      ) {
        errors.push(
          `El registro ${position} no es un objeto válido.`
        );

        return;
      }

      const id =
        normalizeText(
          hymn.id
        );

      const title =
        normalizeText(
          hymn.title
        );

      if (!id) {
        errors.push(
          `El himno ${position} no tiene ID.`
        );
      }

      if (!title) {
        errors.push(
          `El himno ${position} no tiene título.`
        );
      }

      if (
        id &&
        ids.has(id)
      ) {
        errors.push(
          `El ID "${id}" está duplicado dentro del archivo.`
        );
      }

      if (id) {
        ids.add(id);
      }

      const audio =
        normalizeText(
          hymn.audio ||
          hymn.src
        );

      if (
        audio &&
        !audio.startsWith('/')
      ) {
        warnings.push(
          `"${title || id}" tiene una ruta de audio que no comienza con "/".`
        );
      }

      const cover =
        normalizeText(
          hymn.cover
        );

      if (
        cover &&
        !cover.startsWith('/')
      ) {
        warnings.push(
          `"${title || id}" tiene una ruta de portada que no comienza con "/".`
        );
      }
    }
  );

  return {
    valid:
      errors.length === 0,

    count:
      hymns.length,

    errors,

    warnings
  };
}

function createImportComparison(
  importedHymns = []
) {
  const currentHymns =
    AdminHymnService.list();

  const currentById =
    new Map(
      currentHymns.map(hymn => [
        hymn.id,
        hymn
      ])
    );

  const added = [];
  const updated = [];
  const unchanged = [];

  importedHymns.forEach(
    hymn => {
      const current =
        currentById.get(
          hymn.id
        );

      if (!current) {
        added.push(
          cloneValue(hymn)
        );

        return;
      }

      const currentComparable =
        JSON.stringify({
          ...current,
          admin: undefined
        });

      const importedComparable =
        JSON.stringify({
          ...hymn,
          admin: undefined
        });

      if (
        currentComparable ===
        importedComparable
      ) {
        unchanged.push(
          cloneValue(hymn)
        );
      } else {
        updated.push(
          cloneValue(hymn)
        );
      }
    }
  );

  return {
    added,
    updated,
    unchanged,
    total:
      importedHymns.length
  };
}

function mergeDrafts(
  currentDrafts,
  importedDrafts
) {
  const merged =
    new Map();

  currentDrafts.forEach(
    hymn => {
      if (hymn?.id) {
        merged.set(
          hymn.id,
          cloneValue(hymn)
        );
      }
    }
  );

  importedDrafts.forEach(
    hymn => {
      if (hymn?.id) {
        merged.set(
          hymn.id,
          cloneValue(hymn)
        );
      }
    }
  );

  return Array.from(
    merged.values()
  );
}

function readFileAsText(file) {
  return new Promise(
    (resolve, reject) => {
      if (!file) {
        reject(
          new Error(
            'No se seleccionó ningún archivo.'
          )
        );

        return;
      }

      const reader =
        new FileReader();

      reader.addEventListener(
        'load',
        () => {
          resolve(
            String(
              reader.result ||
              ''
            )
          );
        },
        {
          once: true
        }
      );

      reader.addEventListener(
        'error',
        () => {
          reject(
            reader.error ||
            new Error(
              'No se pudo leer el archivo.'
            )
          );
        },
        {
          once: true
        }
      );

      reader.readAsText(
        file
      );
    }
  );
}

function parseJsonText(text = '') {
  try {
    return {
      success: true,
      payload:
        JSON.parse(text),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      payload: null,
      error
    };
  }
}

const AdminHymnImportService = {
  async inspectFile(file) {
    try {
      const text =
        await readFileAsText(
          file
        );

      const parsed =
        parseJsonText(
          text
        );

      if (!parsed.success) {
        return {
          success: false,
          fileName:
            file?.name ||
            null,
          hymns: [],
          validation: {
            valid: false,
            count: 0,
            errors: [
              'El archivo no contiene JSON válido.'
            ],
            warnings: []
          },
          comparison: null,
          message:
            'No se pudo interpretar el archivo seleccionado.'
        };
      }

      const rawHymns =
        extractHymnsFromPayload(
          parsed.payload
        );

      if (!rawHymns) {
        return {
          success: false,
          fileName:
            file?.name ||
            null,
          hymns: [],
          validation: {
            valid: false,
            count: 0,
            errors: [
              'El archivo no contiene una lista de himnos reconocible.'
            ],
            warnings: []
          },
          comparison: null,
          message:
            'El respaldo no tiene una estructura compatible.'
        };
      }

      const normalizedHymns =
        rawHymns.map(
          normalizeImportedHymn
        );

      const validation =
        validateImportedHymns(
          normalizedHymns
        );

      const comparison =
        validation.valid
          ? createImportComparison(
              normalizedHymns
            )
          : null;

      return {
        success:
          validation.valid,

        fileName:
          file?.name ||
          null,

        hymns:
          normalizedHymns,

        validation,

        comparison,

        message:
          validation.valid
            ? 'El archivo fue validado correctamente.'
            : 'El archivo contiene errores y no puede importarse.'
      };
    } catch (error) {
      console.error(
        '[AdminHymnImportService] No se pudo inspeccionar el archivo:',
        error
      );

      return {
        success: false,
        fileName:
          file?.name ||
          null,
        hymns: [],
        validation: {
          valid: false,
          count: 0,
          errors: [
            error?.message ||
            'Error desconocido al leer el archivo.'
          ],
          warnings: []
        },
        comparison: null,
        message:
          'No se pudo leer el archivo seleccionado.'
      };
    }
  },

  importHymns(
    hymns = [],
    {
      mode = 'merge'
    } = {}
  ) {
    const normalizedHymns =
      Array.isArray(hymns)
        ? hymns.map(
            normalizeImportedHymn
          )
        : [];

    const validation =
      validateImportedHymns(
        normalizedHymns
      );

    if (!validation.valid) {
      return {
        success: false,
        imported: 0,
        mode,
        errors:
          validation.errors,
        message:
          'Los himnos no superaron la validación.'
      };
    }

    const currentDrafts =
      AdminStorage.get(
        DRAFT_STORAGE_KEY,
        []
      );

    const nextDrafts =
      mode === 'replace'
        ? normalizedHymns
        : mergeDrafts(
            Array.isArray(
              currentDrafts
            )
              ? currentDrafts
              : [],
            normalizedHymns
          );

    const saved =
      AdminStorage.set(
        DRAFT_STORAGE_KEY,
        nextDrafts
      );

    return {
      success: saved,
      imported:
        saved
          ? normalizedHymns.length
          : 0,
      mode,
      errors: [],
      message:
        saved
          ? (
              normalizedHymns.length === 1
                ? 'Se importó 1 himno correctamente.'
                : `Se importaron ${normalizedHymns.length} himnos correctamente.`
            )
          : 'No se pudieron guardar los himnos importados.'
    };
  },

  getSupportedExtensions() {
    return [
      '.json'
    ];
  },

  getAcceptedMimeTypes() {
    return [
      'application/json',
      'text/json',
      'text/plain'
    ];
  }
};

export {
  DRAFT_STORAGE_KEY,
  extractHymnsFromPayload,
  normalizeImportedHymn,
  validateImportedHymns,
  createImportComparison
};

export default AdminHymnImportService;
