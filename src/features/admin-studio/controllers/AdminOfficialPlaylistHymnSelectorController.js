/**
 * Cántico de Fe Music
 * V12.7.2 — Official Playlist Hymn Selector Controller
 */

import AdminState
  from '../services/AdminState.js';

import {
  HymnLibraryService
} from '../../hymn-library-engine/services/HymnLibraryService.js';

import {
  renderSelectedHymn
} from '../components/renderOfficialPlaylistHymnSelector.js';

const SELECTOR =
  '[data-admin-official-playlist-hymn-selector]';

const FORM_SELECTOR =
  '[data-admin-official-playlist-editor-form]';

const SEARCH_SELECTOR =
  '[data-admin-official-playlist-hymn-search]';

const ITEM_SELECTOR =
  '[data-admin-official-playlist-hymn-item]';

const TOGGLE_SELECTOR =
  '[data-admin-official-playlist-hymn-toggle]';

const SELECTED_LIST_SELECTOR =
  '[data-admin-official-playlist-selected-list]';

const SELECTED_ROW_SELECTOR =
  '[data-admin-official-playlist-selected-hymn]';

const SELECTED_COUNT_SELECTOR =
  '[data-admin-official-playlist-selected-count]';

const ORDER_FIELD_SELECTOR =
  '[data-admin-official-playlist-hymn-order]';

const hymnLibraryService =
  new HymnLibraryService();

function normalizeText(value = '') {
  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(/ñ/g, 'n');
}

function normalizeIds(ids = []) {
  if (!Array.isArray(ids)) {
    return [];
  }

  return [
    ...new Set(
      ids
        .map(id =>
          String(id ?? '').trim()
        )
        .filter(Boolean)
    )
  ];
}

function getSelector(target = null) {
  if (
    target &&
    typeof target.closest ===
      'function'
  ) {
    const closestSelector =
      target.closest(
        SELECTOR
      );

    if (closestSelector) {
      return closestSelector;
    }
  }

  return document.querySelector(
    SELECTOR
  );
}

function getForm(selector = null) {
  return (
    selector?.closest(
      FORM_SELECTOR
    ) ||
    document.querySelector(
      FORM_SELECTOR
    )
  );
}

function getHymns() {
  return hymnLibraryService.list();
}

function getHymnsById() {
  return new Map(
    getHymns().map(hymn => [
      hymn.id,
      hymn
    ])
  );
}

function getCheckedIds(
  selector
) {
  if (!selector) {
    return [];
  }

  return normalizeIds(
    Array.from(
      selector.querySelectorAll(
        `${TOGGLE_SELECTOR}:checked`
      )
    ).map(input =>
      input.value
    )
  );
}

function getRenderedOrder(
  selector
) {
  if (!selector) {
    return [];
  }

  return normalizeIds(
    Array.from(
      selector.querySelectorAll(
        SELECTED_ROW_SELECTOR
      )
    ).map(row =>
      row.dataset
        .adminOfficialPlaylistSelectedHymn
    )
  );
}

function getStoredOrder(
  selector
) {
  const field =
    getForm(selector)
      ?.querySelector(
        ORDER_FIELD_SELECTOR
      );

  if (!field?.value) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(
        field.value
      );

    return normalizeIds(
      parsed
    );
  } catch {
    return normalizeIds(
      String(field.value)
        .split(',')
    );
  }
}

function createOrderedSelection(
  selector
) {
  const checkedIds =
    getCheckedIds(
      selector
    );

  const checkedSet =
    new Set(
      checkedIds
    );

  const existingOrder =
    normalizeIds([
      ...getStoredOrder(
        selector
      ),
      ...getRenderedOrder(
        selector
      )
    ]).filter(id =>
      checkedSet.has(id)
    );

  const existingSet =
    new Set(
      existingOrder
    );

  const newIds =
    checkedIds.filter(id =>
      !existingSet.has(id)
    );

  return [
    ...existingOrder,
    ...newIds
  ];
}

function ensureOrderField(
  selector,
  selectedIds = []
) {
  const form =
    getForm(
      selector
    );

  if (!form) {
    return null;
  }

  let field =
    form.querySelector(
      ORDER_FIELD_SELECTOR
    );

  if (!field) {
    field =
      document.createElement(
        'input'
      );

    field.type =
      'hidden';

    field.name =
      'hymnOrder';

    field.setAttribute(
      'data-admin-official-playlist-hymn-order',
      ''
    );

    form.appendChild(
      field
    );
  }

  field.value =
    JSON.stringify(
      normalizeIds(
        selectedIds
      )
    );

  return field;
}

function updateCheckboxes(
  selector,
  selectedIds
) {
  const selectedSet =
    new Set(
      selectedIds
    );

  selector
    .querySelectorAll(
      TOGGLE_SELECTOR
    )
    .forEach(input => {
      const selected =
        selectedSet.has(
          input.value
        );

      input.checked =
        selected;

      input
        .closest(
          ITEM_SELECTOR
        )
        ?.classList.toggle(
          'is-selected',
          selected
        );
    });
}

function renderSelectedEmpty() {
  return `
    <div
      class="admin-playlist-hymn-selector__selected-empty"
      data-admin-official-playlist-selected-empty
    >
      <p>
        Esta playlist todavía no contiene
        himnos.
      </p>

      <small>
        Selecciona uno o más himnos de la
        lista disponible.
      </small>
    </div>
  `;
}

function updateSelectedList(
  selector,
  selectedIds
) {
  const list =
    selector.querySelector(
      SELECTED_LIST_SELECTOR
    );

  if (!list) {
    return;
  }

  const hymnsById =
    getHymnsById();

  const selectedHymns =
    selectedIds
      .map(id =>
        hymnsById.get(id)
      )
      .filter(Boolean);

  if (!selectedHymns.length) {
    list.innerHTML =
      renderSelectedEmpty();

    return;
  }

  list.innerHTML =
    selectedHymns
      .map((hymn, index) =>
        renderSelectedHymn({
          hymn,
          position:
            index + 1
        })
      )
      .join('');
}

function updateSelectedCount(
  selector,
  selectedIds
) {
  const count =
    selector.querySelector(
      SELECTED_COUNT_SELECTOR
    );

  if (!count) {
    return;
  }

  count.textContent =
    String(
      selectedIds.length
    );
}

function updateSelection(
  selector,
  selectedIds,
  {
    markDirty = true
  } = {}
) {
  if (!selector) {
    return [];
  }

  const normalizedIds =
    normalizeIds(
      selectedIds
    );

  updateCheckboxes(
    selector,
    normalizedIds
  );

  updateSelectedList(
    selector,
    normalizedIds
  );

  updateSelectedCount(
    selector,
    normalizedIds
  );

  ensureOrderField(
    selector,
    normalizedIds
  );

  if (markDirty) {
    AdminState.setDirty(true);

    window.dispatchEvent(
      new CustomEvent(
        'cantico:admin-official-playlist-hymns-change',
        {
          detail: {
            hymnIds:
              normalizedIds
          }
        }
      )
    );
  }

  return normalizedIds;
}

function filterAvailableHymns(
  searchInput
) {
  const selector =
    getSelector(
      searchInput
    );

  if (!selector) {
    return false;
  }

  const term =
    normalizeText(
      searchInput.value
    );

  let visibleCount = 0;

  selector
    .querySelectorAll(
      ITEM_SELECTOR
    )
    .forEach(item => {
      const searchText =
        normalizeText(
          item.dataset
            .hymnSearchText
        );

      const visible =
        !term ||
        searchText.includes(
          term
        );

      item.hidden =
        !visible;

      if (visible) {
        visibleCount += 1;
      }
    });

  let emptyMessage =
    selector.querySelector(
      '[data-admin-official-playlist-hymn-search-empty]'
    );

  if (
    visibleCount === 0 &&
    !emptyMessage
  ) {
    emptyMessage =
      document.createElement(
        'div'
      );

    emptyMessage.className =
      'admin-section__empty';

    emptyMessage.setAttribute(
      'data-admin-official-playlist-hymn-search-empty',
      ''
    );

    emptyMessage.innerHTML = `
      <p>
        No se encontraron himnos
        con esa búsqueda.
      </p>
    `;

    selector
      .querySelector(
        '[data-admin-official-playlist-hymn-list]'
      )
      ?.appendChild(
        emptyMessage
      );
  }

  if (
    visibleCount > 0 &&
    emptyMessage
  ) {
    emptyMessage.remove();
  }

  return true;
}

function toggleHymn(
  toggle
) {
  const selector =
    getSelector(
      toggle
    );

  if (!selector) {
    return false;
  }

  const selectedIds =
    createOrderedSelection(
      selector
    );

  updateSelection(
    selector,
    selectedIds
  );

  return true;
}

function removeHymn(
  hymnId,
  target
) {
  const selector =
    getSelector(
      target
    );

  if (!selector) {
    return false;
  }

  const selectedIds =
    createOrderedSelection(
      selector
    ).filter(id =>
      id !== hymnId
    );

  updateSelection(
    selector,
    selectedIds
  );

  return true;
}

function moveHymn(
  hymnId,
  direction,
  target
) {
  const selector =
    getSelector(
      target
    );

  if (!selector) {
    return false;
  }

  const selectedIds =
    createOrderedSelection(
      selector
    );

  const currentIndex =
    selectedIds.indexOf(
      hymnId
    );

  if (currentIndex < 0) {
    return false;
  }

  const targetIndex =
    direction === 'up'
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >=
      selectedIds.length
  ) {
    return true;
  }

  const nextIds =
    [...selectedIds];

  [
    nextIds[currentIndex],
    nextIds[targetIndex]
  ] = [
    nextIds[targetIndex],
    nextIds[currentIndex]
  ];

  updateSelection(
    selector,
    nextIds
  );

  return true;
}

function initializeSelector() {
  const selector =
    getSelector();

  if (!selector) {
    return false;
  }

  const selectedIds =
    createOrderedSelection(
      selector
    );

  updateSelection(
    selector,
    selectedIds,
    {
      markDirty: false
    }
  );

  return true;
}

function getSelectedIds(
  form = null
) {
  const targetForm =
    form ||
    document.querySelector(
      FORM_SELECTOR
    );

  const selector =
    targetForm?.querySelector(
      SELECTOR
    );

  if (!selector) {
    return [];
  }

  return createOrderedSelection(
    selector
  );
}

const AdminOfficialPlaylistHymnSelectorController = {
  initialize:
    initializeSelector,

  getSelectedIds,

  handleInput(event) {
    const searchInput =
      event?.target?.closest?.(
        SEARCH_SELECTOR
      );

    if (!searchInput) {
      return false;
    }

    filterAvailableHymns(
      searchInput
    );

    return true;
  },

  handleChange(event) {
    const toggle =
      event?.target?.closest?.(
        TOGGLE_SELECTOR
      );

    if (!toggle) {
      return false;
    }

    toggleHymn(
      toggle
    );

    return true;
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

    const removeButton =
      target.closest(
        '[data-admin-official-playlist-hymn-remove]'
      );

    if (removeButton) {
      event.preventDefault();

      removeHymn(
        removeButton.dataset
          .adminOfficialPlaylistHymnRemove,
        removeButton
      );

      return true;
    }

    const upButton =
      target.closest(
        '[data-admin-official-playlist-hymn-up]'
      );

    if (upButton) {
      event.preventDefault();

      moveHymn(
        upButton.dataset
          .adminOfficialPlaylistHymnUp,
        'up',
        upButton
      );

      return true;
    }

    const downButton =
      target.closest(
        '[data-admin-official-playlist-hymn-down]'
      );

    if (downButton) {
      event.preventDefault();

      moveHymn(
        downButton.dataset
          .adminOfficialPlaylistHymnDown,
        'down',
        downButton
      );

      return true;
    }

    return false;
  }
};

export {
  SELECTOR,
  FORM_SELECTOR,
  normalizeIds,
  getSelectedIds,
  updateSelection,
  filterAvailableHymns,
  toggleHymn,
  removeHymn,
  moveHymn,
  initializeSelector
};

export default
  AdminOfficialPlaylistHymnSelectorController;
