/**
 * Cántico de Fe Music
 * V12.9.4 — Admin Media Library Controller
 */

import {
  MediaBrowserController,
  MediaLibraryState,
  MediaSelectionService
} from '../../media-library-engine/index.js';

const ADMIN_MEDIA_SELECTOR =
  '[data-admin-media-library]';

const MEDIA_BROWSER_SELECTOR =
  '[data-media-browser]';

function getAdminMediaLibrary(
  target = null
) {
  if (
    target &&
    typeof target.closest ===
      'function'
  ) {
    const closestLibrary =
      target.closest(
        ADMIN_MEDIA_SELECTOR
      );

    if (closestLibrary) {
      return closestLibrary;
    }
  }

  return document.querySelector(
    ADMIN_MEDIA_SELECTOR
  );
}

function getMediaBrowser(
  root = null
) {
  const library =
    root?.matches?.(
      ADMIN_MEDIA_SELECTOR
    )
      ? root
      : getAdminMediaLibrary(
          root
        );

  if (!library) {
    return null;
  }

  return library.querySelector(
    MEDIA_BROWSER_SELECTOR
  );
}

function initialize(
  root = document
) {
  const library =
    root?.matches?.(
      ADMIN_MEDIA_SELECTOR
    )
      ? root
      : root?.querySelector?.(
          ADMIN_MEDIA_SELECTOR
        );

  if (!library) {
    return false;
  }

  const browser =
    getMediaBrowser(
      library
    );

  if (!browser) {
    return false;
  }

  MediaBrowserController.initialize(
    library,
    {
      selectable: true,

      title:
        'Biblioteca multimedia',

      description:
        'Explora y selecciona imágenes, audios, videos y otros recursos de Cántico de Fe Music.'
    }
  );

  const selectedMedia =
    MediaSelectionService
      .getSelected();

  if (selectedMedia?.id) {
    MediaLibraryState
      .setSelectedMediaId(
        selectedMedia.id
      );

    MediaBrowserController
      .selectMedia(
        selectedMedia.id,
        browser
      );
  }

  return true;
}

function selectMedia(
  mediaId,
  target = null
) {
  const library =
    getAdminMediaLibrary(
      target
    );

  if (!library) {
    return {
      success: false,
      media: null,
      message:
        'La Biblioteca Multimedia no está disponible.'
    };
  }

  const browser =
    getMediaBrowser(
      library
    );

  const browserResult =
    MediaBrowserController
      .selectMedia(
        mediaId,
        browser
      );

  if (!browserResult.success) {
    return browserResult;
  }

  return MediaSelectionService
    .select(
      browserResult.media.id
    );
}

function clearSelection(
  target = null
) {
  const library =
    getAdminMediaLibrary(
      target
    );

  const browser =
    getMediaBrowser(
      library
    );

  MediaBrowserController
    .clearSelection(
      browser
    );

  return MediaSelectionService
    .clear();
}

const AdminMediaLibraryController = {
  initialize,

  selectMedia,

  clearSelection,

  canHandleClick(target) {
    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    return Boolean(
      target.closest(
        [
          '[data-media-reset]',
          '[data-media-preview]',
          '[data-media-select]'
        ].join(', ')
      )
    );
  },

  handleClick(event) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    const library =
      getAdminMediaLibrary(
        target
      );

    if (!library) {
      return false;
    }

    const selectButton =
      target.closest(
        '[data-media-select]'
      );

    if (selectButton) {
      event.preventDefault();

      const mediaId =
        selectButton.dataset
          .mediaSelect;

      if (!mediaId) {
        return true;
      }

      selectMedia(
        mediaId,
        selectButton
      );

      return true;
    }

    return MediaBrowserController
      .handleClick(
        event
      );
  },

  handleInput(event) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    if (
      !getAdminMediaLibrary(
        target
      )
    ) {
      return false;
    }

    return MediaBrowserController
      .handleInput(
        event
      );
  },

  handleChange(event) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    if (
      !getAdminMediaLibrary(
        target
      )
    ) {
      return false;
    }

    return MediaBrowserController
      .handleChange(
        event
      );
  }
};

export {
  ADMIN_MEDIA_SELECTOR,
  MEDIA_BROWSER_SELECTOR,
  getAdminMediaLibrary,
  getMediaBrowser,
  initialize,
  selectMedia,
  clearSelection
};

export default
  AdminMediaLibraryController;
