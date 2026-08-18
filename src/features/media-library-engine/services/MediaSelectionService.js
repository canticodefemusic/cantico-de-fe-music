/**
 * Cántico de Fe Music
 * V13.12.3 — Universal Media Selection Service
 *
 * Funciones:
 * - Compatible con MediaLibraryService
 * - Compatible con keys de Cloudflare R2
 * - Selección individual
 * - Selección múltiple
 * - Toggle
 * - Selección por rango
 * - Seleccionar todos
 * - Último elemento seleccionado
 * - Suscripciones
 * - Eventos globales
 * - Limpieza y sincronización
 * - Compatibilidad con API anterior
 */

import MediaLibraryService
  from './MediaLibraryService.js';

/* ------------------------------------------------------------------ */
/* Estado                                                             */
/* ------------------------------------------------------------------ */

const listeners =
  new Set();

const selectedMediaIds =
  new Set();

let lastSelectedMediaId =
  null;

/* ------------------------------------------------------------------ */
/* Normalización                                                      */
/* ------------------------------------------------------------------ */

function normalizeId(
  mediaId
) {
  if (
    mediaId === null ||
    mediaId === undefined
  ) {
    return null;
  }

  const value =
    String(
      mediaId
    ).trim();

  return (
    value ||
    null
  );
}

/* ------------------------------------------------------------------ */
/* Resolución opcional de metadata                                    */
/* ------------------------------------------------------------------ */

function getMediaById(
  mediaId
) {
  const id =
    normalizeId(
      mediaId
    );

  if (!id) {
    return null;
  }

  try {
    return (
      MediaLibraryService
        ?.getById?.(
          id
        ) ||
      null
    );
  } catch {
    /*
     * Una key de R2 puede no existir
     * dentro de MediaLibraryService.
     *
     * La selección sigue siendo válida.
     */
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Consultas internas                                                 */
/* ------------------------------------------------------------------ */

function getSelectedMedia() {
  return [
    ...selectedMediaIds
  ]
    .map(
      mediaId =>
        getMediaById(
          mediaId
        )
    )
    .filter(
      Boolean
    );
}

function createSnapshot() {
  const selectedIds =
    [
      ...selectedMediaIds
    ];

  const selected =
    getSelectedMedia();

  const lastSelected =
    lastSelectedMediaId
      ? getMediaById(
          lastSelectedMediaId
        )
      : null;

  return {
    selected,

    selectedIds,

    count:
      selectedIds.length,

    lastSelected,

    lastSelectedId:
      lastSelectedMediaId,

    hasSelection:
      selectedIds.length > 0
  };
}

/* ------------------------------------------------------------------ */
/* Eventos                                                            */
/* ------------------------------------------------------------------ */

function emit() {
  const snapshot =
    createSnapshot();

  listeners.forEach(
    listener => {
      try {
        listener(
          snapshot.lastSelected,
          snapshot
        );
      } catch (error) {
        console.error(
          '[MediaSelectionService] Listener error:',
          error
        );
      }
    }
  );

  if (
    typeof window !==
      'undefined' &&
    typeof CustomEvent !==
      'undefined'
  ) {
    window.dispatchEvent(
      new CustomEvent(
        'cantico:media-selection-change',
        {
          detail: {
            /*
             * Compatibilidad V12.
             */
            media:
              snapshot.lastSelected,

            /*
             * API moderna.
             */
            selected:
              snapshot.selected,

            selectedIds:
              snapshot.selectedIds,

            count:
              snapshot.count,

            lastSelected:
              snapshot.lastSelected,

            lastSelectedId:
              snapshot.lastSelectedId,

            hasSelection:
              snapshot.hasSelection
          }
        }
      )
    );
  }

  return snapshot;
}

/* ------------------------------------------------------------------ */
/* Resultado estándar                                                 */
/* ------------------------------------------------------------------ */

function createResult({
  success = true,
  message = ''
} = {}) {
  const snapshot =
    createSnapshot();

  return {
    success,

    /*
     * Compatibilidad anterior.
     */
    media:
      snapshot.lastSelected,

    /*
     * API moderna.
     */
    selected:
      snapshot.selected,

    selectedIds:
      snapshot.selectedIds,

    count:
      snapshot.count,

    lastSelected:
      snapshot.lastSelected,

    lastSelectedId:
      snapshot.lastSelectedId,

    hasSelection:
      snapshot.hasSelection,

    message
  };
}

/* ------------------------------------------------------------------ */
/* Servicio                                                           */
/* ------------------------------------------------------------------ */

const MediaSelectionService = {

  /* ================================================================ */
  /* Suscripción                                                       */
  /* ================================================================ */

  subscribe(
    listener
  ) {
    if (
      typeof listener !==
      'function'
    ) {
      return () => {};
    }

    listeners.add(
      listener
    );

    const snapshot =
      createSnapshot();

    try {
      listener(
        snapshot.lastSelected,
        snapshot
      );
    } catch (error) {
      console.error(
        '[MediaSelectionService] Initial listener error:',
        error
      );
    }

    return () => {
      listeners.delete(
        listener
      );
    };
  },

  /* ================================================================ */
  /* Seleccionar                                                       */
  /* ================================================================ */

  select(
    mediaId,
    {
      additive = false,
      emitChange = true
    } = {}
  ) {
    const id =
      normalizeId(
        mediaId
      );

    if (!id) {
      return createResult({
        success:
          false,

        message:
          'No se encontró un identificador válido.'
      });
    }

    if (!additive) {
      selectedMediaIds
        .clear();
    }

    selectedMediaIds
      .add(
        id
      );

    lastSelectedMediaId =
      id;

    if (emitChange) {
      emit();
    }

    return createResult({
      success:
        true,

      message:
        'Archivo seleccionado correctamente.'
    });
  },

  /* ================================================================ */
  /* Deseleccionar                                                     */
  /* ================================================================ */

  deselect(
    mediaId,
    {
      emitChange = true
    } = {}
  ) {
    const id =
      normalizeId(
        mediaId
      );

    if (!id) {
      return createResult({
        success:
          false,

        message:
          'No se encontró un identificador válido.'
      });
    }

    const existed =
      selectedMediaIds
        .delete(
          id
        );

    if (
      lastSelectedMediaId ===
      id
    ) {
      const remainingIds =
        [
          ...selectedMediaIds
        ];

      lastSelectedMediaId =
        remainingIds.length
          ? remainingIds[
              remainingIds.length - 1
            ]
          : null;
    }

    if (
      existed &&
      emitChange
    ) {
      emit();
    }

    return createResult({
      success:
        existed,

      message:
        existed
          ? 'Archivo deseleccionado correctamente.'
          : 'El archivo no estaba seleccionado.'
    });
  },

  /* ================================================================ */
  /* Toggle                                                            */
  /* ================================================================ */

  toggle(
    mediaId,
    {
      additive = true,
      emitChange = true
    } = {}
  ) {
    const id =
      normalizeId(
        mediaId
      );

    if (!id) {
      return createResult({
        success:
          false,

        message:
          'No se encontró un identificador válido.'
      });
    }

    if (
      selectedMediaIds.has(
        id
      )
    ) {
      return this.deselect(
        id,
        {
          emitChange
        }
      );
    }

    return this.select(
      id,
      {
        additive,
        emitChange
      }
    );
  },

  /* ================================================================ */
  /* Establecer selección                                              */
  /* ================================================================ */

  setSelected(
    mediaId,
    selected = true,
    {
      additive = true,
      emitChange = true
    } = {}
  ) {
    if (selected) {
      return this.select(
        mediaId,
        {
          additive,
          emitChange
        }
      );
    }

    return this.deselect(
      mediaId,
      {
        emitChange
      }
    );
  },

  /* ================================================================ */
  /* Seleccionar todos                                                 */
  /* ================================================================ */

  selectAll(
    mediaIds = [],
    {
      replace = true,
      emitChange = true
    } = {}
  ) {
    const ids =
      Array.isArray(
        mediaIds
      )
        ? mediaIds
            .map(
              normalizeId
            )
            .filter(
              Boolean
            )
        : [];

    if (replace) {
      selectedMediaIds
        .clear();
    }

    ids.forEach(
      id => {
        selectedMediaIds
          .add(
            id
          );

        lastSelectedMediaId =
          id;
      }
    );

    if (emitChange) {
      emit();
    }

    const count =
      selectedMediaIds.size;

    return createResult({
      success:
        true,

      message:
        `${count} archivo${
          count === 1
            ? ''
            : 's'
        } seleccionado${
          count === 1
            ? ''
            : 's'
        }.`
    });
  },

  /* ================================================================ */
  /* Selección por rango                                               */
  /* ================================================================ */

  selectRange({
    orderedIds = [],
    fromId = null,
    toId = null,
    additive = false,
    emitChange = true
  } = {}) {
    const ids =
      Array.isArray(
        orderedIds
      )
        ? orderedIds
            .map(
              normalizeId
            )
            .filter(
              Boolean
            )
        : [];

    const startId =
      normalizeId(
        fromId
      );

    const endId =
      normalizeId(
        toId
      );

    if (
      !ids.length ||
      !startId ||
      !endId
    ) {
      return createResult({
        success:
          false,

        message:
          'No se pudo determinar el rango de selección.'
      });
    }

    const startIndex =
      ids.indexOf(
        startId
      );

    const endIndex =
      ids.indexOf(
        endId
      );

    if (
      startIndex === -1 ||
      endIndex === -1
    ) {
      return createResult({
        success:
          false,

        message:
          'Uno de los archivos no pertenece al rango visible.'
      });
    }

    const firstIndex =
      Math.min(
        startIndex,
        endIndex
      );

    const lastIndex =
      Math.max(
        startIndex,
        endIndex
      );

    const range =
      ids.slice(
        firstIndex,
        lastIndex + 1
      );

    if (!additive) {
      selectedMediaIds
        .clear();
    }

    range.forEach(
      id => {
        selectedMediaIds
          .add(
            id
          );
      }
    );

    lastSelectedMediaId =
      endId;

    if (emitChange) {
      emit();
    }

    return createResult({
      success:
        true,

      message:
        `${range.length} archivo${
          range.length === 1
            ? ''
            : 's'
        } seleccionado${
          range.length === 1
            ? ''
            : 's'
        } en el rango.`
    });
  },

  /* ================================================================ */
  /* Limpiar                                                           */
  /* ================================================================ */

  clear({
    emitChange = true
  } = {}) {
    selectedMediaIds
      .clear();

    lastSelectedMediaId =
      null;

    if (emitChange) {
      emit();
    }

    return createResult({
      success:
        true,

      message:
        'La selección fue eliminada.'
    });
  },

  /* ================================================================ */
  /* Consultas                                                         */
  /* ================================================================ */

  isSelected(
    mediaId
  ) {
    const id =
      normalizeId(
        mediaId
      );

    return Boolean(
      id &&
      selectedMediaIds.has(
        id
      )
    );
  },

  hasSelection() {
    return (
      selectedMediaIds.size >
      0
    );
  },

  getCount() {
    return selectedMediaIds
      .size;
  },

  getSelectedIds() {
    return [
      ...selectedMediaIds
    ];
  },

  getSelectedItems() {
    return getSelectedMedia();
  },

  /*
   * API antigua:
   * devuelve metadata cuando existe.
   */
  getSelected() {
    if (
      !lastSelectedMediaId
    ) {
      return null;
    }

    return getMediaById(
      lastSelectedMediaId
    );
  },

  /*
   * API antigua.
   */
  getSelectedId() {
    return lastSelectedMediaId;
  },

  getLastSelected() {
    return this.getSelected();
  },

  getLastSelectedId() {
    return lastSelectedMediaId;
  },

  getSnapshot() {
    return createSnapshot();
  },

  /* ================================================================ */
  /* Sincronización                                                    */
  /* ================================================================ */

  prune(
    validIds = [],
    {
      emitChange = true
    } = {}
  ) {
    const validSet =
      new Set(
        Array.isArray(
          validIds
        )
          ? validIds
              .map(
                normalizeId
              )
              .filter(
                Boolean
              )
          : []
      );

    let changed =
      false;

    selectedMediaIds
      .forEach(
        id => {
          if (
            !validSet.has(
              id
            )
          ) {
            selectedMediaIds
              .delete(
                id
              );

            changed =
              true;
          }
        }
      );

    if (
      lastSelectedMediaId &&
      !selectedMediaIds.has(
        lastSelectedMediaId
      )
    ) {
      const remainingIds =
        [
          ...selectedMediaIds
        ];

      lastSelectedMediaId =
        remainingIds.length
          ? remainingIds[
              remainingIds.length - 1
            ]
          : null;

      changed =
        true;
    }

    if (
      changed &&
      emitChange
    ) {
      emit();
    }

    return createResult({
      success:
        true,

      message:
        'La selección fue sincronizada.'
    });
  }

};

export default
  MediaSelectionService;
