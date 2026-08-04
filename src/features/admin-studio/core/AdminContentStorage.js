/**
 * Cántico de Fe Music
 * V12.6 — Admin Content Storage
 */

const STORAGE_PREFIX =
  'cantico:admin-content:';

function cloneValue(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return value;
  }

  try {
    return JSON.parse(
      JSON.stringify(value)
    );
  } catch (error) {
    console.error(
      '[AdminContentStorage] No se pudo clonar el valor:',
      error
    );

    return value;
  }
}

function normalizeModuleName(
  moduleName = ''
) {
  return String(moduleName)
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9_-]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    );
}

function createStorageKey(
  moduleName
) {
  const normalizedName =
    normalizeModuleName(
      moduleName
    );

  if (!normalizedName) {
    throw new Error(
      'El nombre del módulo es obligatorio.'
    );
  }

  return (
    STORAGE_PREFIX +
    normalizedName
  );
}

function storageAvailable() {
  try {
    const testKey =
      `${STORAGE_PREFIX}test`;

    localStorage.setItem(
      testKey,
      '1'
    );

    localStorage.removeItem(
      testKey
    );

    return true;
  } catch (error) {
    console.error(
      '[AdminContentStorage] localStorage no está disponible:',
      error
    );

    return false;
  }
}

const AdminContentStorage = {
  isAvailable() {
    return storageAvailable();
  },

  getKey(moduleName) {
    return createStorageKey(
      moduleName
    );
  },

  get(
    moduleName,
    fallbackValue = []
  ) {
    if (!storageAvailable()) {
      return cloneValue(
        fallbackValue
      );
    }

    try {
      const storageKey =
        createStorageKey(
          moduleName
        );

      const savedValue =
        localStorage.getItem(
          storageKey
        );

      if (savedValue === null) {
        return cloneValue(
          fallbackValue
        );
      }

      return JSON.parse(
        savedValue
      );
    } catch (error) {
      console.error(
        `[AdminContentStorage] No se pudo leer el módulo "${moduleName}":`,
        error
      );

      return cloneValue(
        fallbackValue
      );
    }
  },

  set(
    moduleName,
    value
  ) {
    if (!storageAvailable()) {
      return false;
    }

    try {
      const storageKey =
        createStorageKey(
          moduleName
        );

      localStorage.setItem(
        storageKey,
        JSON.stringify(value)
      );

      window.dispatchEvent(
        new CustomEvent(
          'cantico:admin-content-storage-change',
          {
            detail: {
              module:
                normalizeModuleName(
                  moduleName
                ),

              storageKey,

              action: 'set'
            }
          }
        )
      );

      return true;
    } catch (error) {
      console.error(
        `[AdminContentStorage] No se pudo guardar el módulo "${moduleName}":`,
        error
      );

      return false;
    }
  },

  remove(moduleName) {
    if (!storageAvailable()) {
      return false;
    }

    try {
      const storageKey =
        createStorageKey(
          moduleName
        );

      localStorage.removeItem(
        storageKey
      );

      window.dispatchEvent(
        new CustomEvent(
          'cantico:admin-content-storage-change',
          {
            detail: {
              module:
                normalizeModuleName(
                  moduleName
                ),

              storageKey,

              action: 'remove'
            }
          }
        )
      );

      return true;
    } catch (error) {
      console.error(
        `[AdminContentStorage] No se pudo eliminar el módulo "${moduleName}":`,
        error
      );

      return false;
    }
  },

  has(moduleName) {
    if (!storageAvailable()) {
      return false;
    }

    try {
      const storageKey =
        createStorageKey(
          moduleName
        );

      return (
        localStorage.getItem(
          storageKey
        ) !== null
      );
    } catch (error) {
      console.error(
        `[AdminContentStorage] No se pudo verificar el módulo "${moduleName}":`,
        error
      );

      return false;
    }
  },

  clear(moduleName) {
    return this.remove(
      moduleName
    );
  },

  exportModule(moduleName) {
    const normalizedName =
      normalizeModuleName(
        moduleName
      );

    return {
      application:
        'Cántico de Fe Music',

      module:
        normalizedName,

      version: 1,

      exportedAt:
        new Date().toISOString(),

      data:
        cloneValue(
          this.get(
            normalizedName,
            []
          )
        )
    };
  }
};

export {
  STORAGE_PREFIX,
  normalizeModuleName,
  createStorageKey
};

export default AdminContentStorage;
