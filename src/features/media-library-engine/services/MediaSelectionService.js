/**
 * Cántico de Fe Music
 * V13.12.0 — Professional Media Selection Service
 *
 * Funciones:
 * - Selección individual
 * - Selección múltiple
 * - Seleccionar / deseleccionar
 * - Toggle
 * - Seleccionar todos
 * - Selección por rango
 * - Último archivo seleccionado
 * - Estado de selección
 * - Suscripciones
 * - Evento global
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
/* Utilidades                                                         */
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

  return value || null;
}

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

  return (
    MediaLibraryService
      .getById(
        id
      ) ||
    null
  );
}

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

    selectedIds:
      [
        ...selectedMediaIds
      ],

    count:
      selectedMediaIds.size,

    lastSelected,

    lastSelectedId:
      lastSelectedMediaId,

    hasSelection:
      selectedMediaIds.size > 0
  };
}

/* ------------------------------------------------------------------ */
/* Eventos                                                            */
/* ------------------------------------------------------------------ */

function emit() {
  const snapshot =
    createSnapshot();

  /*
   * Compatibilidad con V12:
   * El primer argumento continúa siendo
   * el último archivo seleccionado.
   *
   * El segundo argumento contiene el nuevo
   * estado completo de selección múltiple.
   */
  listeners.forEach(
    listener => {
      try {
        listener(
          snapshot.lastSelected,
          snapshot
        );
      } catch (error) {
        console.error(
          '[MediaSelectionService] Error en listener:',
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
             * Compatibilidad anterior.
             */
            media:
              snapshot.lastSelected,

            /*
             * Nuevo estado profesional.
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
     * Compatibilidad V12.
     */
    media:
      snapshot.lastSelected,

    /*
     * Estado nuevo.
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
        '[MediaSelectionService] Error inicializando listener:',
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

    const media =
      getMediaById(
        id
      );

    if (
      !id ||
      !media
    ) {
      return createResult({
        success:
          false,

        message:
          'No se encontró el archivo seleccionado.'
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
          'No se encontró el archivo seleccionado.'
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
          'No se encontró el archivo seleccionado.'
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
  /* Establecer estado                                                 */
  /* ================================================================ */

  setSelected(
    mediaId,
    selected = true,
    options = {}
  ) {
    return selected
      ? this.select(
          mediaId,
          {
            additive:
              options.additive ??
              true,

            emitChange:
              options.emitChange ??
              true
          }
        )
      : this.deselect(
          mediaId,
          {
            emitChange:
              options.emitChange ??
              true
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
        const media =
          getMediaById(
            id
          );

        if (!media) {
          return;
        }

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

    return createResult({
      success:
        true,

      message:
        `${selectedMediaIds.size} archivo${
          selectedMediaIds.size === 1
            ? ''
            : 's'
        } seleccionado${
          selectedMediaIds.size === 1
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
        const media =
          getMediaById(
            id
          );

        if (media) {
          selectedMediaIds
            .add(
              id
            );
        }
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
   * Compatibilidad con V12.
   *
   * Antes getSelected() devolvía un
   * único archivo. Conservamos ese
   * comportamiento devolviendo el
   * último archivo seleccionado.
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
   * Compatibilidad con V12.
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
