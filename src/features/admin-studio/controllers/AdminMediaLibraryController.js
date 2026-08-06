/**
 * Cántico de Fe Music
 * V13.0.9 — Admin Media Library Controller
 */

import {
  MediaBrowserController,
  MediaLibraryState,
  MediaSelectionService,
  MediaCardMenuController,
  MediaMetadataController
} from '../../media-library-engine/index.js';

const ADMIN_MEDIA_SELECTOR =
  '[data-admin-media-library]';

const MEDIA_BROWSER_SELECTOR =
  '[data-media-browser]';

const MEDIA_BROWSER_HOST_SELECTOR =
  '[data-admin-media-library-browser]';

const METADATA_HOST_SELECTOR =
  '[data-media-metadata-host]';

let globalEventsInitialized =
  false;

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

function getMediaBrowserHost(
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
    MEDIA_BROWSER_HOST_SELECTOR
  );
}

function getMetadataHost(
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
    METADATA_HOST_SELECTOR
  );
}

function openMetadataEditor(
  mediaId,
  target = null
) {
  const library =
    getAdminMediaLibrary(
      target
    );

  if (!library) {
    return false;
  }

  const host =
    getMetadataHost(
      library
    );

  if (!host) {
    return false;
  }

  host.hidden =
    false;

  const rendered =
    MediaMetadataController
      .renderEditor(
        mediaId,
        {
          host
        }
      );

  if (!rendered) {
    host.hidden =
      true;

    return false;
  }

  MediaMetadataController
    .initialize(
      host
    );

  window.setTimeout(() => {
    host.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    host
      .querySelector(
        '[name="name"]'
      )
      ?.focus();
  }, 0);

  return true;
}

function closeMetadataEditor(
  target = null
) {
  const library =
    getAdminMediaLibrary(
      target
    );

  const host =
    getMetadataHost(
      library
    );

  MediaMetadataController
    .closeEditor();

  if (host) {
    host.hidden =
      true;

    host.innerHTML =
      '';
  }

  return true;
}

function refreshBrowser(
  target = null
) {
  const browser =
    getMediaBrowser(
      target
    );

  if (!browser) {
    return null;
  }

  return MediaBrowserController
    .render({
      browser
    });
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

function handleMetadataEditRequest(
  event
) {
  const mediaId =
    event?.detail?.media?.id;

  if (!mediaId) {
    return;
  }

  openMetadataEditor(
    mediaId
  );
}

function handleMetadataEditorClose() {
  const host =
    getMetadataHost();

  if (!host) {
    return;
  }

  host.hidden =
    true;

  host.innerHTML =
    '';
}

function handleMetadataSaved() {
  refreshBrowser();
}

function handleMetadataRestored() {
  refreshBrowser();
}

function handleDocumentClick(
  event
) {
  MediaCardMenuController
    .handleDocumentClick(
      event
    );
}

function handleDocumentKeydown(
  event
) {
  MediaCardMenuController
    .handleKeydown(
      event
    );
}

function bindGlobalEvents() {
  if (
    globalEventsInitialized
  ) {
    return;
  }

  document.addEventListener(
    'click',
    handleDocumentClick
  );

  document.addEventListener(
    'keydown',
    handleDocumentKeydown
  );

  window.addEventListener(
    'cantico:media-metadata-edit-request',
    handleMetadataEditRequest
  );

  window.addEventListener(
    'cantico:media-metadata-editor-close',
    handleMetadataEditorClose
  );

  window.addEventListener(
    'cantico:media-metadata-saved',
    handleMetadataSaved
  );

  window.addEventListener(
    'cantico:media-metadata-restored',
    handleMetadataRestored
  );

  globalEventsInitialized =
    true;
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

  bindGlobalEvents();

  MediaBrowserController
    .initialize(
      library,
      {
        selectable: true,

        title:
          'Biblioteca multimedia',

        description:
          'Explora y selecciona imágenes, audios, videos y otros recursos de Cántico de Fe Music.'
      }
    );

  const metadataHost =
    getMetadataHost(
      library
    );

  if (
    metadataHost &&
    metadataHost.querySelector(
      '[data-media-metadata-editor]'
    )
  ) {
    metadataHost.hidden =
      false;

    MediaMetadataController
      .initialize(
        metadataHost
      );
  }

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

const AdminMediaLibraryController = {
  initialize,

  selectMedia,

  clearSelection,

  openMetadataEditor,

  closeMetadataEditor,

  refreshBrowser,

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
          '[data-media-select]',
          '[data-media-menu-toggle]',
          '[data-media-metadata-edit]',
          '[data-media-copy-path]',
          '[data-media-copy-id]',
          '[data-media-download]',
          '[data-media-metadata-close]',
          '[data-media-metadata-restore]',
          '[data-media-metadata-save]'
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

    const closeButton =
      target.closest(
        '[data-media-metadata-close]'
      );

    if (closeButton) {
      event.preventDefault();

      closeMetadataEditor(
        closeButton
      );

      return true;
    }

    if (
      MediaMetadataController
        .handleClick(
          event
        )
    ) {
      return true;
    }

    if (
      MediaCardMenuController
        .handleClick(
          event
        )
    ) {
      return true;
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

    if (
      MediaMetadataController
        .handleInput(
          event
        )
    ) {
      return true;
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

    if (
      MediaMetadataController
        .handleChange(
          event
        )
    ) {
      return true;
    }

    return MediaBrowserController
      .handleChange(
        event
      );
  },

  handleSubmit(event) {
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

    return MediaMetadataController
      .handleSubmit(
        event
      );
  }
};

export {
  ADMIN_MEDIA_SELECTOR,
  MEDIA_BROWSER_SELECTOR,
  MEDIA_BROWSER_HOST_SELECTOR,
  METADATA_HOST_SELECTOR,
  getAdminMediaLibrary,
  getMediaBrowser,
  getMediaBrowserHost,
  getMetadataHost,
  initialize,
  selectMedia,
  clearSelection,
  openMetadataEditor,
  closeMetadataEditor,
  refreshBrowser,
  bindGlobalEvents
};

export default
  AdminMediaLibraryController;
