/**
 * Cántico de Fe Music
 * V12.1 — Admin Hymn Service
 */

import {
  hymnCatalog
} from '../../hymn-library-engine/data/hymnCatalog.js';

import {
  searchItems
} from '../../smart-search-engine/index.js';

import AdminStorage
  from './AdminStorage.js';

const STORAGE_KEY =
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
  return String(value || '')
    .trim();
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

function createSlug(value = '') {
  return normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(/ñ/g, 'n')
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    );
}

function createUniqueId(
  title,
  existingItems = [],
  ignoredId = null
) {
  const baseId =
    createSlug(title) ||
    `himno-${Date.now()}`;

  const existingIds =
    new Set(
      existingItems
        .filter(item =>
          item?.id &&
          item.id !== ignoredId
        )
        .map(item =>
          item.id
        )
    );

  if (!existingIds.has(baseId)) {
    return baseId;
  }

  let suffix = 2;
  let candidate =
    `${baseId}-${suffix}`;

  while (
    existingIds.has(candidate)
  ) {
    suffix += 1;

    candidate =
      `${baseId}-${suffix}`;
  }

  return candidate;
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

function normalizeHymn(
  hymn = {},
  {
    existingItems = [],
    ignoredId = null,
    source = 'draft'
  } = {}
) {
  const title =
    normalizeText(hymn.title);

  const id =
    normalizeText(hymn.id) ||
    createUniqueId(
      title,
      existingItems,
      ignoredId
    );

  const audio =
    normalizeText(
      hymn.audio ||
      hymn.src
    );

  return {
    id,

    title,

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
      source,
      status:
        normalizeText(
          hymn.admin?.status ||
          (
            source === 'published'
              ? 'published'
              : 'draft'
          )
        ),

      updatedAt:
        hymn.admin?.updatedAt ||
        null,

      createdAt:
        hymn.admin?.createdAt ||
        null
    }
  };
}

function getPublishedHymns() {
  return hymnCatalog.map(hymn =>
    normalizeHymn(
      hymn,
      {
        source: 'published'
      }
    )
  );
}

function getStoredDrafts() {
  const drafts =
    AdminStorage.get(
      STORAGE_KEY,
      []
    );

  if (!Array.isArray(drafts)) {
    return [];
  }

  return drafts
    .map(hymn =>
      normalizeHymn(
        hymn,
        {
          source: 'draft'
        }
      )
    )
    .filter(hymn =>
      hymn.id
    );
}

function saveDrafts(drafts) {
  return AdminStorage.set(
    STORAGE_KEY,
    drafts
  );
}

function mergeHymns(
  publishedHymns,
  draftHymns
) {
  const merged =
    new Map();

  publishedHymns.forEach(hymn => {
    merged.set(
      hymn.id,
      cloneValue(hymn)
    );
  });

  draftHymns.forEach(hymn => {
    const published =
      merged.get(hymn.id);

    merged.set(
      hymn.id,
      {
        ...(published || {}),
        ...cloneValue(hymn),

        admin: {
          ...(published?.admin || {}),
          ...(hymn.admin || {}),
          source:
            published
              ? 'override'
              : 'draft',
          status:
            hymn.admin?.status ||
            'draft'
        }
      }
    );
  });

  return Array.from(
    merged.values()
  );
}

function sortByTitle(items) {
  return [...items].sort(
    (a, b) =>
      a.title.localeCompare(
        b.title,
        'es',
        {
          sensitivity: 'base'
        }
      )
  );
}

const AdminHymnService = {
  list({
    query = '',
    status = 'all'
  } = {}) {
    const published =
      getPublishedHymns();

    const drafts =
      getStoredDrafts();

    let hymns =
      mergeHymns(
        published,
        drafts
      );

    if (
      status &&
      status !== 'all'
    ) {
      hymns = hymns.filter(
        hymn =>
          hymn.admin?.status ===
          status
      );
    }

    if (
      String(query || '').trim()
    ) {
      hymns = searchItems(
        hymns,
        query
      );
    }

    return sortByTitle(
      hymns
    );
  },

  listPublished() {
    return sortByTitle(
      getPublishedHymns()
    );
  },

  listDrafts() {
    return sortByTitle(
      getStoredDrafts()
    );
  },

  findById(hymnId) {
    const cleanId =
      normalizeText(hymnId);

    if (!cleanId) {
      return null;
    }

    return (
      this.list()
        .find(
          hymn =>
            hymn.id === cleanId
        ) ||
      null
    );
  },

  createDraft(values = {}) {
    const allHymns =
      this.list();

    const now =
      new Date().toISOString();

    const draft =
      normalizeHymn(
        values,
        {
          existingItems:
            allHymns,
          source: 'draft'
        }
      );

    if (!draft.title) {
      return {
        success: false,
        hymn: null,
        message:
          'El título del himno es obligatorio.'
      };
    }

    draft.admin = {
      ...draft.admin,
      source: 'draft',
      status: 'draft',
      createdAt: now,
      updatedAt: now
    };

    const drafts =
      getStoredDrafts();

    const saved =
      saveDrafts([
        ...drafts,
        draft
      ]);

    return {
      success: saved,
      hymn:
        saved
          ? cloneValue(draft)
          : null,
      message:
        saved
          ? 'El borrador del himno fue creado correctamente.'
          : 'No se pudo guardar el borrador del himno.'
    };
  },

  updateDraft(
    hymnId,
    changes = {}
  ) {
    const cleanId =
      normalizeText(hymnId);

    if (!cleanId) {
      return {
        success: false,
        hymn: null,
        message:
          'El identificador del himno no es válido.'
      };
    }

    const current =
      this.findById(cleanId);

    if (!current) {
      return {
        success: false,
        hymn: null,
        message:
          'No se encontró el himno solicitado.'
      };
    }

    const allHymns =
      this.list();

    const updated =
      normalizeHymn(
        {
          ...current,
          ...changes,
          id: cleanId,

          copyright: {
            ...current.copyright,
            ...(
              changes.copyright ||
              {}
            )
          }
        },
        {
          existingItems:
            allHymns,
          ignoredId:
            cleanId,
          source: 'draft'
        }
      );

    if (!updated.title) {
      return {
        success: false,
        hymn: null,
        message:
          'El título del himno es obligatorio.'
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
      createdAt:
        current.admin?.createdAt ||
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString()
    };

    const drafts =
      getStoredDrafts();

    const draftIndex =
      drafts.findIndex(
        hymn =>
          hymn.id === cleanId
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
      saveDrafts(
        nextDrafts
      );

    return {
      success: saved,
      hymn:
        saved
          ? cloneValue(updated)
          : null,
      message:
        saved
          ? 'El borrador fue actualizado correctamente.'
          : 'No se pudo actualizar el borrador.'
    };
  },

  duplicate(hymnId) {
    const original =
      this.findById(hymnId);

    if (!original) {
      return {
        success: false,
        hymn: null,
        message:
          'No se encontró el himno que deseas duplicar.'
      };
    }

    const allHymns =
      this.list();

    const title =
      `${original.title} — Copia`;

    const duplicate =
      normalizeHymn(
        {
          ...original,
          id:
            createUniqueId(
              title,
              allHymns
            ),
          title
        },
        {
          existingItems:
            allHymns,
          source: 'draft'
        }
      );

    const now =
      new Date().toISOString();

    duplicate.admin = {
      source: 'draft',
      status: 'draft',
      createdAt: now,
      updatedAt: now
    };

    const drafts =
      getStoredDrafts();

    const saved =
      saveDrafts([
        ...drafts,
        duplicate
      ]);

    return {
      success: saved,
      hymn:
        saved
          ? cloneValue(
              duplicate
            )
          : null,
      message:
        saved
          ? 'El himno fue duplicado correctamente.'
          : 'No se pudo duplicar el himno.'
    };
  },

  removeDraft(hymnId) {
    const cleanId =
      normalizeText(hymnId);

    const drafts =
      getStoredDrafts();

    const exists =
      drafts.some(
        hymn =>
          hymn.id === cleanId
      );

    if (!exists) {
      return {
        success: false,
        message:
          'No existe un borrador para este himno.'
      };
    }

    const nextDrafts =
      drafts.filter(
        hymn =>
          hymn.id !== cleanId
      );

    const saved =
      saveDrafts(
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

  restorePublished(hymnId) {
    return this.removeDraft(
      hymnId
    );
  },

  getCounts() {
    const hymns =
      this.list();

    return {
      total:
        hymns.length,

      published:
        hymns.filter(
          hymn =>
            hymn.admin?.status ===
            'published'
        ).length,

      drafts:
        hymns.filter(
          hymn =>
            hymn.admin?.status ===
            'draft'
        ).length,

      overrides:
        hymns.filter(
          hymn =>
            hymn.admin?.source ===
            'override'
        ).length
    };
  },

  exportData() {
    return {
      application:
        'Cántico de Fe Music',

      module:
        'Admin Hymn Manager',

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

export {
  STORAGE_KEY
};

export default AdminHymnService;
