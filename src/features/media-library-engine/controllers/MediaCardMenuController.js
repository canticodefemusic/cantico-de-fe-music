/**
 * Cántico de Fe Music
 * V13.0.7 — Media Card Menu Controller
 */

import MediaLibraryService
  from '../services/MediaLibraryService.js';

const MENU_SELECTOR =
  '[data-media-card-menu]';

const TOGGLE_SELECTOR =
  '[data-media-menu-toggle]';

const PANEL_SELECTOR =
  '[data-media-menu-panel]';

const METADATA_EDIT_SELECTOR =
  '[data-media-metadata-edit]';

const COPY_PATH_SELECTOR =
  '[data-media-copy-path]';

const COPY_ID_SELECTOR =
  '[data-media-copy-id]';

const PREVIEW_SELECTOR =
  '[data-media-preview]';

const SELECT_SELECTOR =
  '[data-media-select]';

const DOWNLOAD_SELECTOR =
  '[data-media-download]';

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
}

function getMenu(
  target = null
) {
  if (
    !target ||
    typeof target.closest !==
      'function'
  ) {
    return null;
  }

  return target.closest(
    MENU_SELECTOR
  );
}

function getMenuPanel(
  menu
) {
  if (!menu) {
    return null;
  }

  return menu.querySelector(
    PANEL_SELECTOR
  );
}

function getMenuToggle(
  menu
) {
  if (!menu) {
    return null;
  }

  return menu.querySelector(
    TOGGLE_SELECTOR
  );
}

function isMenuOpen(
  menu
) {
  const panel =
    getMenuPanel(
      menu
    );

  return Boolean(
    panel &&
    !panel.hidden
  );
}

function closeMenu(
  menu
) {
  if (!menu) {
    return false;
  }

  const panel =
    getMenuPanel(
      menu
    );

  const toggle =
    getMenuToggle(
      menu
    );

  if (panel) {
    panel.hidden =
      true;
  }

  if (toggle) {
    toggle.setAttribute(
      'aria-expanded',
      'false'
    );
  }

  menu.classList.remove(
    'is-open'
  );

  return true;
}

function closeAllMenus({
  except = null
} = {}) {
  document
    .querySelectorAll(
      MENU_SELECTOR
    )
    .forEach(menu => {
      if (
        except &&
        menu === except
      ) {
        return;
      }

      closeMenu(
        menu
      );
    });
}

function openMenu(
  menu
) {
  if (!menu) {
    return false;
  }

  closeAllMenus({
    except:
      menu
  });

  const panel =
    getMenuPanel(
      menu
    );

  const toggle =
    getMenuToggle(
      menu
    );

  if (!panel) {
    return false;
  }

  panel.hidden =
    false;

  if (toggle) {
    toggle.setAttribute(
      'aria-expanded',
      'true'
    );
  }

  menu.classList.add(
    'is-open'
  );

  return true;
}

function toggleMenu(
  target
) {
  const menu =
    getMenu(
      target
    );

  if (!menu) {
    return false;
  }

  if (
    isMenuOpen(
      menu
    )
  ) {
    return closeMenu(
      menu
    );
  }

  return openMenu(
    menu
  );
}

function dispatchMenuEvent(
  eventName,
  detail = {}
) {
  window.dispatchEvent(
    new CustomEvent(
      eventName,
      {
        detail
      }
    )
  );
}

function getMedia(
  mediaId
) {
  const cleanId =
    normalizeText(
      mediaId
    );

  if (!cleanId) {
    return null;
  }

  return MediaLibraryService
    .getById(
      cleanId
    );
}

async function copyText(
  text
) {
  const cleanText =
    normalizeText(
      text
    );

  if (!cleanText) {
    return {
      success: false,
      value: '',
      message:
        'No hay información disponible para copiar.'
    };
  }

  try {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard
        .writeText ===
        'function'
    ) {
      await navigator.clipboard
        .writeText(
          cleanText
        );
    } else {
      const textarea =
        document.createElement(
          'textarea'
        );

      textarea.value =
        cleanText;

      textarea.setAttribute(
        'readonly',
        ''
      );

      textarea.style.position =
        'fixed';

      textarea.style.opacity =
        '0';

      document.body.appendChild(
        textarea
      );

      textarea.select();

      const copied =
        document.execCommand(
          'copy'
        );

      textarea.remove();

      if (!copied) {
        throw new Error(
          'El navegador rechazó la copia.'
        );
      }
    }

    return {
      success: true,
      value: cleanText,
      message:
        'La información fue copiada correctamente.'
    };
  } catch (error) {
    console.error(
      '[MediaCardMenuController] No se pudo copiar:',
      error
    );

    return {
      success: false,
      value: cleanText,
      message:
        'No se pudo copiar la información.'
    };
  }
}

async function copyMediaPath(
  path
) {
  const result =
    await copyText(
      path
    );

  dispatchMenuEvent(
    result.success
      ? 'cantico:media-path-copied'
      : 'cantico:media-copy-error',
    {
      ...result,
      type: 'path'
    }
  );

  return result;
}

async function copyMediaId(
  mediaId
) {
  const result =
    await copyText(
      mediaId
    );

  dispatchMenuEvent(
    result.success
      ? 'cantico:media-id-copied'
      : 'cantico:media-copy-error',
    {
      ...result,
      type: 'id'
    }
  );

  return result;
}

function requestMetadataEditor(
  mediaId
) {
  const media =
    getMedia(
      mediaId
    );

  if (!media) {
    const result = {
      success: false,
      media: null,
      message:
        'No se encontró el archivo multimedia.'
    };

    dispatchMenuEvent(
      'cantico:media-metadata-edit-error',
      result
    );

    return result;
  }

  const result = {
    success: true,
    media,
    message:
      'Solicitud de edición preparada.'
  };

  dispatchMenuEvent(
    'cantico:media-metadata-edit-request',
    {
      media
    }
  );

  return result;
}

function handleDocumentClick(
  event
) {
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
    target.closest(
      MENU_SELECTOR
    )
  ) {
    return false;
  }

  closeAllMenus();

  return false;
}

function handleKeydown(
  event
) {
  if (
    event?.key !==
    'Escape'
  ) {
    return false;
  }

  const openMenu =
    document.querySelector(
      `${MENU_SELECTOR}.is-open`
    );

  if (!openMenu) {
    return false;
  }

  const toggle =
    getMenuToggle(
      openMenu
    );

  closeAllMenus();

  toggle?.focus();

  return true;
}

const MediaCardMenuController = {
  openMenu,

  closeMenu,

  closeAllMenus,

  toggleMenu,

  copyText,

  copyMediaPath,

  copyMediaId,

  requestMetadataEditor,

  handleDocumentClick,

  handleKeydown,

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

    const toggleButton =
      target.closest(
        TOGGLE_SELECTOR
      );

    if (toggleButton) {
      event.preventDefault();
      event.stopPropagation();

      toggleMenu(
        toggleButton
      );

      return true;
    }

    const metadataButton =
      target.closest(
        METADATA_EDIT_SELECTOR
      );

    if (metadataButton) {
      event.preventDefault();

      requestMetadataEditor(
        metadataButton.dataset
          .mediaMetadataEdit
      );

      closeAllMenus();

      return true;
    }

    const copyPathButton =
      target.closest(
        COPY_PATH_SELECTOR
      );

    if (copyPathButton) {
      event.preventDefault();

      copyMediaPath(
        copyPathButton.dataset
          .mediaCopyPath
      );

      closeAllMenus();

      return true;
    }

    const copyIdButton =
      target.closest(
        COPY_ID_SELECTOR
      );

    if (copyIdButton) {
      event.preventDefault();

      copyMediaId(
        copyIdButton.dataset
          .mediaCopyId
      );

      closeAllMenus();

      return true;
    }

    const previewButton =
      target.closest(
        PREVIEW_SELECTOR
      );

    if (previewButton) {
      closeAllMenus();

      return false;
    }

    const selectButton =
      target.closest(
        SELECT_SELECTOR
      );

    if (selectButton) {
      closeAllMenus();

      return false;
    }

    const downloadLink =
      target.closest(
        DOWNLOAD_SELECTOR
      );

    if (downloadLink) {
      closeAllMenus();

      return false;
    }

    return false;
  }
};

export {
  MENU_SELECTOR,
  TOGGLE_SELECTOR,
  PANEL_SELECTOR,
  METADATA_EDIT_SELECTOR,
  COPY_PATH_SELECTOR,
  COPY_ID_SELECTOR,
  PREVIEW_SELECTOR,
  SELECT_SELECTOR,
  DOWNLOAD_SELECTOR,
  getMenu,
  getMenuPanel,
  getMenuToggle,
  isMenuOpen,
  openMenu,
  closeMenu,
  closeAllMenus,
  toggleMenu,
  copyText,
  copyMediaPath,
  copyMediaId,
  requestMetadataEditor,
  handleDocumentClick,
  handleKeydown
};

export default
  MediaCardMenuController;
