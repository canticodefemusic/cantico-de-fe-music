/**
 * Cántico de Fe Music
 * V12.8.11 — Media Selection Service
 */

import MediaLibraryService
  from './MediaLibraryService.js';

const listeners =
  new Set();

let selectedMediaId =
  null;

function emit(media) {
  listeners.forEach(listener => {
    try {
      listener(media);
    } catch (error) {
      console.error(
        '[MediaSelectionService] Error en listener:',
        error
      );
    }
  });

  window.dispatchEvent(
    new CustomEvent(
      'cantico:media-selection-change',
      {
        detail: {
          media
        }
      }
    )
  );
}

const MediaSelectionService = {
  subscribe(listener) {
    if (
      typeof listener !==
      'function'
    ) {
      return () => {};
    }

    listeners.add(
      listener
    );

    listener(
      this.getSelected()
    );

    return () => {
      listeners.delete(
        listener
      );
    };
  },

  select(mediaId) {
    const media =
      MediaLibraryService.getById(
        mediaId
      );

    if (!media) {
      return {
        success: false,
        media: null,
        message:
          'No se encontró el archivo seleccionado.'
      };
    }

    selectedMediaId =
      media.id;

    emit(media);

    return {
      success: true,
      media,
      message:
        'Archivo seleccionado correctamente.'
    };
  },

  clear() {
    selectedMediaId =
      null;

    emit(null);

    return {
      success: true,
      media: null,
      message:
        'La selección fue eliminada.'
    };
  },

  getSelected() {
    if (!selectedMediaId) {
      return null;
    }

    return MediaLibraryService.getById(
      selectedMediaId
    );
  },

  getSelectedId() {
    return selectedMediaId;
  },

  hasSelection() {
    return Boolean(
      this.getSelected()
    );
  }
};

export default
  MediaSelectionService;
