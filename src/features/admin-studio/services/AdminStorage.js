/**
 * Cántico de Fe Music
 * V12.0 — Admin Studio Storage
 */

const STORAGE_PREFIX =
  'cantico:admin-studio';

const STORAGE_VERSION = 1;

function createStorageKey(key = '') {
  const cleanKey =
    String(key || '').trim();

  if (!cleanKey) {
    return null;
  }

  return `${STORAGE_PREFIX}:${cleanKey}`;
}

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
  } catch {
    return value;
  }
}

function createStorageRecord(value) {
  return {
    version: STORAGE_VERSION,
    updatedAt:
      new Date().toISOString(),
    value: cloneValue(value)
  };
}

function parseStorageRecord(
  rawValue
) {
  if (!rawValue) {
    return null;
  }

  try {
    const record =
      JSON.parse(rawValue);

    if (
      !record ||
      typeof record !== 'object' ||
      !Object.prototype.hasOwnProperty.call(
        record,
        'value'
      )
    ) {
      return null;
    }

    return record;
  } catch (error) {
    console.error(
      '[AdminStorage] No se pudo leer el registro:',
      error
    );

    return null;
  }
}

const AdminStorage = {
  getVersion() {
    return STORAGE_VERSION;
  },

  get(key, fallbackValue = null) {
    const storageKey =
      createStorageKey(key);

    if (!storageKey) {
      return cloneValue(
        fallbackValue
      );
    }

    try {
      const rawValue =
        window.localStorage.getItem(
          storageKey
        );

      const record =
        parseStorageRecord(
          rawValue
        );

      if (!record) {
        return cloneValue(
          fallbackValue
        );
      }

      return cloneValue(
        record.value
      );
    } catch (error) {
      console.error(
        `[AdminStorage] No se pudo obtener "${key}":`,
        error
      );

      return cloneValue(
        fallbackValue
      );
    }
  },

  getRecord(key) {
    const storageKey =
      createStorageKey(key);

    if (!storageKey) {
      return null;
    }

    try {
      return parseStorageRecord(
        window.localStorage.getItem(
          storageKey
        )
      );
    } catch (error) {
      console.error(
        `[AdminStorage] No se pudo leer "${key}":`,
        error
      );

      return null;
    }
  },

  set(key, value) {
    const storageKey =
      createStorageKey(key);

    if (!storageKey) {
      return false;
    }

    try {
      const record =
        createStorageRecord(value);

      window.localStorage.setItem(
        storageKey,
        JSON.stringify(record)
      );

      window.dispatchEvent(
        new CustomEvent(
          'cantico:admin-storage-changed',
          {
            detail: {
              key,
              value:
                cloneValue(value),
              updatedAt:
                record.updatedAt
            }
          }
        )
      );

      return true;
    } catch (error) {
      console.error(
        `[AdminStorage] No se pudo guardar "${key}":`,
        error
      );

      return false;
    }
  },

  remove(key) {
    const storageKey =
      createStorageKey(key);

    if (!storageKey) {
      return false;
    }

    try {
      window.localStorage.removeItem(
        storageKey
      );

      window.dispatchEvent(
        new CustomEvent(
          'cantico:admin-storage-changed',
          {
            detail: {
              key,
              removed: true,
              updatedAt:
                new Date().toISOString()
            }
          }
        )
      );

      return true;
    } catch (error) {
      console.error(
        `[AdminStorage] No se pudo eliminar "${key}":`,
        error
      );

      return false;
    }
  },

  has(key) {
    const storageKey =
      createStorageKey(key);

    if (!storageKey) {
      return false;
    }

    try {
      return (
        window.localStorage.getItem(
          storageKey
        ) !== null
      );
    } catch {
      return false;
    }
  },

  clear() {
    try {
      const keysToRemove = [];

      for (
        let index = 0;
        index < window.localStorage.length;
        index += 1
      ) {
        const key =
          window.localStorage.key(index);

        if (
          key?.startsWith(
            `${STORAGE_PREFIX}:`
          )
        ) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        window.localStorage.removeItem(
          key
        );
      });

      window.dispatchEvent(
        new CustomEvent(
          'cantico:admin-storage-cleared'
        )
      );

      return true;
    } catch (error) {
      console.error(
        '[AdminStorage] No se pudo limpiar el almacenamiento:',
        error
      );

      return false;
    }
  },

  exportData() {
    const data = {};

    try {
      for (
        let index = 0;
        index < window.localStorage.length;
        index += 1
      ) {
        const storageKey =
          window.localStorage.key(index);

        if (
          !storageKey?.startsWith(
            `${STORAGE_PREFIX}:`
          )
        ) {
          continue;
        }

        const shortKey =
          storageKey.slice(
            `${STORAGE_PREFIX}:`.length
          );

        const record =
          parseStorageRecord(
            window.localStorage.getItem(
              storageKey
            )
          );

        if (record) {
          data[shortKey] =
            record;
        }
      }

      return {
        application:
          'Cántico de Fe Music',
        module:
          'Admin Studio',
        version:
          STORAGE_VERSION,
        exportedAt:
          new Date().toISOString(),
        data
      };
    } catch (error) {
      console.error(
        '[AdminStorage] No se pudieron exportar los datos:',
        error
      );

      return {
        application:
          'Cántico de Fe Music',
        module:
          'Admin Studio',
        version:
          STORAGE_VERSION,
        exportedAt:
          new Date().toISOString(),
        data: {}
      };
    }
  },

  importData(payload, {
    replace = false
  } = {}) {
    if (
      !payload ||
      typeof payload !== 'object' ||
      !payload.data ||
      typeof payload.data !== 'object'
    ) {
      return {
        success: false,
        imported: 0,
        message:
          'El archivo no contiene datos válidos del Admin Studio.'
      };
    }

    try {
      if (replace) {
        this.clear();
      }

      let imported = 0;

      Object.entries(
        payload.data
      ).forEach(
        ([key, record]) => {
          if (
            !record ||
            typeof record !== 'object' ||
            !Object.prototype.hasOwnProperty.call(
              record,
              'value'
            )
          ) {
            return;
          }

          const saved =
            this.set(
              key,
              record.value
            );

          if (saved) {
            imported += 1;
          }
        }
      );

      return {
        success: true,
        imported,
        message:
          imported === 1
            ? 'Se importó 1 registro correctamente.'
            : `Se importaron ${imported} registros correctamente.`
      };
    } catch (error) {
      console.error(
        '[AdminStorage] No se pudieron importar los datos:',
        error
      );

      return {
        success: false,
        imported: 0,
        message:
          'No se pudieron importar los datos del Admin Studio.'
      };
    }
  }
};

export {
  STORAGE_PREFIX,
  STORAGE_VERSION
};

export default AdminStorage;
