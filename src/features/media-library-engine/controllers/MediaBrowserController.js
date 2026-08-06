/**
 * Cántico de Fe Music
 * V12.8.7 — Media Browser Controller
 */

import MediaLibraryService
  from '../services/MediaLibraryService.js';

import MediaLibraryState
  from '../state/MediaLibraryState.js';

import renderMediaBrowser
  from '../components/renderMediaBrowser.js';

const BROWSER_SELECTOR =
  '[data-media-browser]';

const CONTENT_SELECTOR =
  '[data-media-browser-content]';

const SEARCH_SELECTOR =
  '[data-media-search]';

const TYPE_SELECTOR =
  '[data-media-type]';

const CATEGORY_SELECTOR =
  '[data-media-category]';

const SORT_SELECTOR =
  '[data-media-sort]';

const RESET_SELECTOR =
  '[data-media-reset]';

const PREVIEW_SELECTOR =
  '[data-media-preview]';

const SELECT_SELECTOR =
  '[data-media-select]';

const RESULT_COUNT_SELECTOR =
  '[data-media-result-count]';

const DEFAULT_OPTIONS = {
  selectable: true,
  title:
    'Biblioteca multimedia',
  description:
    'Explora imágenes, audios, videos y otros recursos del proyecto.'
};

const browserOptions =
  new WeakMap();

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
}

function getBrowser(
  target = null
) {
  if (
    target &&
    typeof target.closest ===
      'function'
  ) {
    const closestBrowser =
      target.closest(
        BROWSER_SELECTOR
      );

    if (closestBrowser) {
      return closestBrowser;
    }
  }

  return document.querySelector(
    BROWSER_SELECTOR
  );
}

function getBrowserOptions(
  browser
) {
  return {
    ...DEFAULT_OPTIONS,
    ...(
      browserOptions.get(
        browser
      ) || {}
    )
  };
}

function setBrowserOptions(
  browser,
  options = {}
) {
  if (!browser) {
    return;
  }

  browserOptions.set(
    browser,
    {
      ...DEFAULT_OPTIONS,
      ...options
    }
  );
}

function getState() {
  return MediaLibraryState
    .getState();
}

function createBrowserMarkup(
  browser
) {
  const state =
    getState();

  const options =
    getBrowserOptions(
      browser
    );

  return renderMediaBrowser({
    query:
      state.query,

    type:
      state.type,

    category:
      state.category,

    sort:
      state.sort,

    selectable:
      options.selectable,

    title:
      options.title,

    description:
      options.description
  });
}

function replaceBrowser(
  browser
) {
  if (!browser) {
    return null;
  }

  const wrapper =
    document.createElement(
      'div'
    );

  wrapper.innerHTML =
    createBrowserMarkup(
      browser
    ).trim();

  const nextBrowser =
    wrapper.firstElementChild;

  if (!nextBrowser) {
    return null;
  }

  const options =
    getBrowserOptions(
      browser
    );

  browser.replaceWith(
    nextBrowser
  );

  setBrowserOptions(
    nextBrowser,
    options
  );

  return nextBrowser;
}

function restoreSearchFocus(
  browser,
  cursorPosition = null
) {
  window.setTimeout(() => {
    const input =
      browser?.querySelector(
        SEARCH_SELECTOR
      );

    if (!input) {
      return;
    }

    input.focus();

    const position =
      cursorPosition ??
      input.value.length;

    input.setSelectionRange(
      position,
      position
    );
  }, 0);
}

function renderBrowser({
  browser = null,
  preserveSearchFocus = false,
  cursorPosition = null
} = {}) {
  const currentBrowser =
    browser ||
    getBrowser();

  const nextBrowser =
    replaceBrowser(
      currentBrowser
    );

  if (
    preserveSearchFocus &&
    nextBrowser
  ) {
    restoreSearchFocus(
      nextBrowser,
      cursorPosition
    );
  }

  return nextBrowser;
}

function dispatchMediaEvent(
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

function getMediaById(
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

function selectMedia(
  mediaId,
  browser = null
) {
  const media =
    getMediaById(
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

  MediaLibraryState
    .setSelectedMediaId(
      media.id
    );

  const currentBrowser =
    browser ||
    getBrowser();

  currentBrowser
    ?.querySelectorAll(
      '[data-media-id]'
    )
    .forEach(card => {
      card.classList.toggle(
        'is-selected',
        card.dataset.mediaId ===
          media.id
      );
    });

  dispatchMediaEvent(
    'cantico:media-selected',
    {
      media
    }
  );

  return {
    success: true,
    media,
    message:
      'Archivo seleccionado correctamente.'
  };
}

function clearSelection(
  browser = null
) {
  MediaLibraryState
    .clearSelection();

  const currentBrowser =
    browser ||
    getBrowser();

  currentBrowser
    ?.querySelectorAll(
      '[data-media-id]'
    )
    .forEach(card => {
      card.classList.remove(
        'is-selected'
      );
    });

  dispatchMediaEvent(
    'cantico:media-selection-cleared'
  );
}

function previewMedia(
  mediaId
) {
  const media =
    getMediaById(
      mediaId
    );

  if (!media) {
    return {
      success: false,
      media: null,
      message:
        'No se encontró el archivo para la vista previa.'
    };
  }

  MediaLibraryState
    .setPreviewMediaId(
      media.id
    );

  dispatchMediaEvent(
    'cantico:media-preview-open',
    {
      media
    }
  );

  return {
    success: true,
    media,
    message:
      'Vista previa abierta correctamente.'
  };
}

function closePreview() {
  MediaLibraryState
    .closePreview();

  dispatchMediaEvent(
    'cantico:media-preview-close'
  );
}

function updateQuery(
  input
) {
  const browser =
    getBrowser(
      input
    );

  if (!browser) {
    return false;
  }

  const cursorPosition =
    input.selectionStart;

  MediaLibraryState
    .setQuery(
      input.value
    );

  renderBrowser({
    browser,
    preserveSearchFocus: true,
    cursorPosition
  });

  return true;
}

function updateType(
  select
) {
  const browser =
    getBrowser(
      select
    );

  if (!browser) {
    return false;
  }

  MediaLibraryState
    .setType(
      select.value
    );

  renderBrowser({
    browser
  });

  return true;
}

function updateCategory(
  select
) {
  const browser =
    getBrowser(
      select
    );

  if (!browser) {
    return false;
  }

  MediaLibraryState
    .setCategory(
      select.value
    );

  renderBrowser({
    browser
  });

  return true;
}

function updateSort(
  select
) {
  const browser =
    getBrowser(
      select
    );

  if (!browser) {
    return false;
  }

  MediaLibraryState
    .setSort(
      select.value
    );

  renderBrowser({
    browser
  });

  return true;
}

function resetFilters(
  target
) {
  const browser =
    getBrowser(
      target
    );

  if (!browser) {
    return false;
  }

  MediaLibraryState
    .clearFilters();

  renderBrowser({
    browser
  });

  return true;
}

function initializeBrowser(
  root = document,
  options = {}
) {
  const browser =
    root?.matches?.(
      BROWSER_SELECTOR
    )
      ? root
      : root?.querySelector?.(
          BROWSER_SELECTOR
        );

  if (!browser) {
    return false;
  }

  setBrowserOptions(
    browser,
    {
      selectable:
        browser.dataset
          .mediaSelectable !==
        'false',

      ...options
    }
  );

  const selectedMediaId =
    getState()
      .selectedMediaId;

  if (selectedMediaId) {
    selectMedia(
      selectedMediaId,
      browser
    );
  }

  return true;
}

function updateResultCount(
  browser,
  count
) {
  const resultCount =
    browser?.querySelector(
      RESULT_COUNT_SELECTOR
    );

  if (!resultCount) {
    return false;
  }

  const normalizedCount =
    Number.isFinite(
      Number(count)
    )
      ? Number(count)
      : 0;

  resultCount.textContent =
    `${normalizedCount} ${
      normalizedCount === 1
        ? 'archivo'
        : 'archivos'
    }`;

  return true;
}

const MediaBrowserController = {
  initialize:
    initializeBrowser,

  render:
    renderBrowser,

  selectMedia,

  clearSelection,

  previewMedia,

  closePreview,

  updateResultCount,

  getSelectedMedia() {
    const selectedMediaId =
      getState()
        .selectedMediaId;

    return getMediaById(
      selectedMediaId
    );
  },

  getPreviewMedia() {
    const previewMediaId =
      getState()
        .previewMediaId;

    return getMediaById(
      previewMediaId
    );
  },

  handleInput(event) {
    const searchInput =
      event?.target?.closest?.(
        SEARCH_SELECTOR
      );

    if (!searchInput) {
      return false;
    }

    return updateQuery(
      searchInput
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

    const typeSelect =
      target.closest(
        TYPE_SELECTOR
      );

    if (typeSelect) {
      return updateType(
        typeSelect
      );
    }

    const categorySelect =
      target.closest(
        CATEGORY_SELECTOR
      );

    if (categorySelect) {
      return updateCategory(
        categorySelect
      );
    }

    const sortSelect =
      target.closest(
        SORT_SELECTOR
      );

    if (sortSelect) {
      return updateSort(
        sortSelect
      );
    }

    return false;
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

    const resetButton =
      target.closest(
        RESET_SELECTOR
      );

    if (resetButton) {
      event.preventDefault();

      return resetFilters(
        resetButton
      );
    }

    const previewButton =
      target.closest(
        PREVIEW_SELECTOR
      );

    if (previewButton) {
      event.preventDefault();

      previewMedia(
        previewButton.dataset
          .mediaPreview
      );

      return true;
    }

    const selectButton =
      target.closest(
        SELECT_SELECTOR
      );

    if (selectButton) {
      event.preventDefault();

      const browser =
        getBrowser(
          selectButton
        );

      const selectable =
        browser?.dataset
          .mediaSelectable !==
        'false';

      if (!selectable) {
        return true;
      }

      selectMedia(
        selectButton.dataset
          .mediaSelect,
        browser
      );

      return true;
    }

    return false;
  }
};

export {
  BROWSER_SELECTOR,
  CONTENT_SELECTOR,
  SEARCH_SELECTOR,
  TYPE_SELECTOR,
  CATEGORY_SELECTOR,
  SORT_SELECTOR,
  RESET_SELECTOR,
  PREVIEW_SELECTOR,
  SELECT_SELECTOR,
  getBrowser,
  selectMedia,
  clearSelection,
  previewMedia,
  closePreview,
  updateQuery,
  updateType,
  updateCategory,
  updateSort,
  resetFilters,
  initializeBrowser
};

export default
  MediaBrowserController;
