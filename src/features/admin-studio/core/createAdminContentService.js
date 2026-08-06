/**
 * Cántico de Fe Music
 * V12.6 — Admin Content Service Factory
 */

import AdminContentStorage
  from './AdminContentStorage.js';

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

function normalizeSearchText(
  value = ''
) {
  return normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(/ñ/g, 'n');
}

function createSlug(value = '') {
  return normalizeSearchText(
    value
  )
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    );
}

function normalizeCatalog(
  catalog = []
) {
  return Array.isArray(catalog)
    ? catalog
    : [];
}

function normalizeArray(
  value = []
) {
  return Array.isArray(value)
    ? [...value]
    : [];
}

function createAdminMetadata({
  source = 'draft',
  status = 'draft',
  createdAt = null,
  updatedAt = null
} = {}) {
  const now =
    new Date().toISOString();

  return {
    source,
    status,
    published:
      status === 'published',
    createdAt:
      createdAt || now,
    updatedAt:
      updatedAt || now
  };
}

function normalizeAdminMetadata(
  admin = {},
  {
    source = 'draft',
    status = 'draft'
  } = {}
) {
  return createAdminMetadata({
    source:
      normalizeText(
        admin.source
      ) || source,

    status:
      normalizeText(
        admin.status
      ) || status,

    createdAt:
      admin.createdAt ||
      null,

    updatedAt:
      admin.updatedAt ||
      null
  });
}

function createUniqueId({
  title,
  preferredId = '',
  items = [],
  ignoredId = null,
  fallbackPrefix = 'content'
}) {
  const baseId =
    createSlug(
      preferredId ||
      title
    ) ||
    `${fallbackPrefix}-${Date.now()}`;

  const ids =
    new Set(
      items
        .filter(item =>
          item?.id &&
          item.id !== ignoredId
        )
        .map(item =>
          item.id
        )
    );

  if (!ids.has(baseId)) {
    return baseId;
  }

  let suffix = 2;
  let candidate =
    `${baseId}-${suffix}`;

  while (
    ids.has(candidate)
  ) {
    suffix += 1;

    candidate =
      `${baseId}-${suffix}`;
  }

  return candidate;
}

function mergeContent(
  publishedItems = [],
  draftItems = []
) {
  const merged =
    new Map();

  publishedItems.forEach(item => {
    if (!item?.id) {
      return;
    }

    merged.set(
      item.id,
      cloneValue(item)
    );
  });

  draftItems.forEach(item => {
    if (!item?.id) {
      return;
    }

    const published =
      merged.get(item.id);

    merged.set(
      item.id,
      {
        ...(published || {}),
        ...cloneValue(item),

        admin: {
          ...(published?.admin || {}),
          ...(item.admin || {}),

          source:
            published
              ? 'override'
              : 'draft',

          status:
            item.admin?.status ||
            'draft',

          published: false
        }
      }
    );
  });

  return Array.from(
    merged.values()
  );
}

function sortByField(
  items = [],
  fieldName = 'title'
) {
  return [...items].sort(
    (first, second) => {
      const firstValue =
        normalizeText(
          first?.[fieldName]
        );

      const secondValue =
        normalizeText(
          second?.[fieldName]
        );

      return firstValue.localeCompare(
        secondValue,
        'es',
        {
          sensitivity: 'base',
          numeric: true
        }
      );
    }
  );
}

function matchesSearch({
  item,
  query,
  fields
}) {
  const term =
    normalizeSearchText(
      query
    );

  if (!term) {
    return true;
  }

  return fields.some(field => {
    const value =
      item?.[field];

    if (Array.isArray(value)) {
      return normalizeSearchText(
        value.join(' ')
      ).includes(term);
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      return normalizeSearchText(
        Object.values(value)
          .join(' ')
      ).includes(term);
    }

    return normalizeSearchText(
      value
    ).includes(term);
  });
}

export function createAdminContentService({
  module,
  catalog = [],
  normalizeItem = item => item,
  createDefaults = () => ({}),
  searchFields = [
    'title',
    'name',
    'description'
  ],
  titleField = 'title',
  sortField = 'title',
  fallbackPrefix = 'content',
  duplicateLabel = 'Copia'
} = {}) {
  const moduleName =
    normalizeText(module);

  if (!moduleName) {
    throw new Error(
      '[createAdminContentService] El nombre del módulo es obligatorio.'
    );
  }

  function normalizeContentItem(
    item = {},
    {
      source = 'draft',
      status = 'draft',
      existingItems = [],
      ignoredId = null
    } = {}
  ) {
    const normalizedCustomItem =
      normalizeItem(
        cloneValue(item)
      ) || {};

    const title =
      normalizeText(
        normalizedCustomItem[
          titleField
        ]
      );

    const id =
      normalizeText(
        normalizedCustomItem.id
      ) ||
      createUniqueId({
        title,
        items:
          existingItems,
        ignoredId,
        fallbackPrefix
      });

    return {
      ...normalizedCustomItem,

      id,

      admin:
        normalizeAdminMetadata(
          normalizedCustomItem.admin,
          {
            source,
            status
          }
        )
    };
  }

  function getPublishedItems() {
    const normalizedCatalog =
      normalizeCatalog(
        catalog
      );

    return normalizedCatalog
      .map(item =>
        normalizeContentItem(
          item,
          {
            source:
              'published',
            status:
              'published'
          }
        )
      )
      .filter(item =>
        item.id
      );
  }

  function getDraftItems() {
    const storedItems =
      AdminContentStorage.get(
        moduleName,
        []
      );

    if (!Array.isArray(storedItems)) {
      return [];
    }

    return storedItems
      .map(item =>
        normalizeContentItem(
          item,
          {
            source: 'draft',
            status: 'draft'
          }
        )
      )
      .filter(item =>
        item.id
      );
  }

  function saveDraftItems(
    items = []
  ) {
    return AdminContentStorage.set(
      moduleName,
      items
    );
  }

  const service = {
    module:
      moduleName,

    list({
      query = '',
      status = 'all',
      sortBy = sortField
    } = {}) {
      const publishedItems =
        getPublishedItems();

      const draftItems =
        getDraftItems();

      let items =
        mergeContent(
          publishedItems,
          draftItems
        );

      if (
        status &&
        status !== 'all'
      ) {
        items = items.filter(
          item => {
            if (
              status === 'override'
            ) {
              return (
                item.admin?.source ===
                'override'
              );
            }

            return (
              item.admin?.status ===
              status
            );
          }
        );
      }

      if (
        normalizeText(query)
      ) {
        items = items.filter(item =>
          matchesSearch({
            item,
            query,
            fields:
              normalizeArray(
                searchFields
              )
          })
        );
      }

      return sortByField(
        items,
        sortBy
      );
    },

    listPublished() {
      return sortByField(
        getPublishedItems(),
        sortField
      );
    },

    listDrafts() {
      return sortByField(
        getDraftItems(),
        sortField
      );
    },

    findById(id) {
      const cleanId =
        normalizeText(id);

      if (!cleanId) {
        return null;
      }

      return (
        this.list()
          .find(item =>
            item.id === cleanId
          ) ||
        null
      );
    },

    exists(id) {
      return Boolean(
        this.findById(id)
      );
    },

    createDraft(
      values = {}
    ) {
      const currentItems =
        this.list();

      const defaults =
        createDefaults() || {};

      const now =
        new Date().toISOString();

      const draft =
        normalizeContentItem(
          {
            ...defaults,
            ...cloneValue(values)
          },
          {
            source: 'draft',
            status: 'draft',
            existingItems:
              currentItems
          }
        );

      const title =
        normalizeText(
          draft[titleField]
        );

      if (!title) {
        return {
          success: false,
          item: null,
          message:
            'El título es obligatorio.'
        };
      }

      draft.admin = {
        ...draft.admin,
        source: 'draft',
        status: 'draft',
        published: false,
        createdAt: now,
        updatedAt: now
      };

      const drafts =
        getDraftItems();

      const saved =
        saveDraftItems([
          ...drafts,
          draft
        ]);

      return {
        success: saved,

        item:
          saved
            ? cloneValue(draft)
            : null,

        message:
          saved
            ? 'El borrador fue creado correctamente.'
            : 'No se pudo guardar el borrador.'
      };
    },

    updateDraft(
      id,
      changes = {}
    ) {
      const cleanId =
        normalizeText(id);

      if (!cleanId) {
        return {
          success: false,
          item: null,
          message:
            'El identificador no es válido.'
        };
      }

      const current =
        this.findById(
          cleanId
        );

      if (!current) {
        return {
          success: false,
          item: null,
          message:
            'No se encontró el contenido solicitado.'
        };
      }

      const currentItems =
        this.list();

      const updated =
        normalizeContentItem(
          {
            ...current,
            ...cloneValue(changes),
            id: cleanId,

            admin: {
              ...current.admin,
              ...(
                changes.admin ||
                {}
              )
            }
          },
          {
            source: 'draft',
            status: 'draft',
            existingItems:
              currentItems,
            ignoredId:
              cleanId
          }
        );

      const title =
        normalizeText(
          updated[titleField]
        );

      if (!title) {
        return {
          success: false,
          item: null,
          message:
            'El título es obligatorio.'
        };
      }

      updated.admin = {
        ...current.admin,
        ...updated.admin,

        source:
          current.admin?.source ===
          'published'
            ? 'override'
            : current.admin?.source ||
              'draft',

        status: 'draft',
        published: false,

        createdAt:
          current.admin?.createdAt ||
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString()
      };

      const drafts =
        getDraftItems();

      const draftIndex =
        drafts.findIndex(
          item =>
            item.id === cleanId
        );

      const nextDrafts =
        [...drafts];

      if (draftIndex >= 0) {
        nextDrafts[
          draftIndex
        ] = updated;
      } else {
        nextDrafts.push(
          updated
        );
      }

      const saved =
        saveDraftItems(
          nextDrafts
        );

      return {
        success: saved,

        item:
          saved
            ? cloneValue(updated)
            : null,

        message:
          saved
            ? 'El borrador fue actualizado correctamente.'
            : 'No se pudo actualizar el borrador.'
      };
    },

    duplicate(id) {
      const original =
        this.findById(id);

      if (!original) {
        return {
          success: false,
          item: null,
          message:
            'No se encontró el contenido que deseas duplicar.'
        };
      }

      const currentItems =
        this.list();

      const originalTitle =
        normalizeText(
          original[
            titleField
          ]
        );

      const duplicateTitle =
        `${originalTitle} — ${duplicateLabel}`;

      const duplicate =
        normalizeContentItem(
          {
            ...cloneValue(original),

            id:
              createUniqueId({
                title:
                  duplicateTitle,
                items:
                  currentItems,
                fallbackPrefix
              }),

            [titleField]:
              duplicateTitle
          },
          {
            source: 'draft',
            status: 'draft',
            existingItems:
              currentItems
          }
        );

      const now =
        new Date().toISOString();

      duplicate.admin = {
        source: 'draft',
        status: 'draft',
        published: false,
        createdAt: now,
        updatedAt: now
      };

      const drafts =
        getDraftItems();

      const saved =
        saveDraftItems([
          ...drafts,
          duplicate
        ]);

      return {
        success: saved,

        item:
          saved
            ? cloneValue(
                duplicate
              )
            : null,

        message:
          saved
            ? 'El contenido fue duplicado correctamente.'
            : 'No se pudo duplicar el contenido.'
      };
    },

    removeDraft(id) {
      const cleanId =
        normalizeText(id);

      const drafts =
        getDraftItems();

      const exists =
        drafts.some(item =>
          item.id === cleanId
        );

      if (!exists) {
        return {
          success: false,
          message:
            'No existe un borrador para este contenido.'
        };
      }

      const nextDrafts =
        drafts.filter(item =>
          item.id !== cleanId
        );

      const saved =
        saveDraftItems(
          nextDrafts
        );

      return {
        success: saved,

        message:
          saved
            ? 'El borrador fue eliminado correctamente.'
            : 'No se pudo eliminar el borrador.'
      };
    },

    restorePublished(id) {
      return this.removeDraft(
        id
      );
    },

    clearDrafts() {
      const removed =
        AdminContentStorage.remove(
          moduleName
        );

      return {
        success: removed,

        message:
          removed
            ? 'Los borradores fueron eliminados correctamente.'
            : 'No se pudieron eliminar los borradores.'
      };
    },

    getCounts() {
      const items =
        this.list();

      return {
        total:
          items.length,

        published:
          items.filter(item =>
            item.admin?.status ===
            'published'
          ).length,

        drafts:
          items.filter(item =>
            item.admin?.status ===
            'draft'
          ).length,

        overrides:
          items.filter(item =>
            item.admin?.source ===
            'override'
          ).length
      };
    },

    exportData() {
      return {
        application:
          'Cántico de Fe Music',

        module:
          moduleName,

        version: 1,

        exportedAt:
          new Date().toISOString(),

        published:
          this.listPublished(),

        drafts:
          this.listDrafts(),

        merged:
          this.list()
      };
    }
  };

  return service;
}

export {
  cloneValue,
  normalizeText,
  normalizeSearchText,
  createSlug,
  createAdminMetadata,
  normalizeAdminMetadata,
  createUniqueId,
  mergeContent,
  sortByField
};

export default createAdminContentService;
