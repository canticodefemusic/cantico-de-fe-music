/**
 * Cántico de Fe Music
 * V13.14.5 — Professional R2 Media Library Controller
 *
 * Funciones:
 * - Carga paginada desde R2
 * - Cursor para cargar páginas siguientes
 * - Cargar más archivos
 * - Evitar objetos duplicados
 * - Estadísticas de archivos cargados
 * - Refrescar biblioteca
 * - Buscar en memoria
 * - Filtrar por tipo
 * - Ordenar resultados
 * - Selección múltiple
 * - Seleccionar visibles
 * - Limpiar selección
 * - Copiar enlace individual
 * - Eliminar archivo individual
 * - Copiar enlaces seleccionados
 * - Eliminar archivos seleccionados
 */

import r2MediaService
  from '../services/R2MediaService.js';

import r2MediaMetadataService
  from '../services/R2MediaMetadataService.js';

import {
  renderR2MediaLibrary
} from '../components/renderR2MediaLibrary.js';

import MediaViewModeController
  from './MediaViewModeController.js';

import MediaSelectionController
  from './MediaSelectionController.js';

function normalizeText(
  value = ''
) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .trim();
}

function getObjectName(
  object
) {
  return (
    object
      ?.customMetadata
      ?.displayName ||
    object
      ?.customMetadata
      ?.originalName ||
    String(
      object?.key || ''
    )
      .split('/')
      .pop() ||
    ''
  );
}

function getObjectContentType(
  object
) {
  return (
    object
      ?.httpMetadata
      ?.contentType ||
    'application/octet-stream'
  );
}

function getObjectMediaType(
  object
) {
  const contentType =
    getObjectContentType(
      object
    );

  if (
    contentType.startsWith(
      'image/'
    )
  ) {
    return 'image';
  }

  if (
    contentType.startsWith(
      'audio/'
    )
  ) {
    return 'audio';
  }

  if (
    contentType.startsWith(
      'video/'
    )
  ) {
    return 'video';
  }

  if (
    contentType ===
      'application/pdf'
  ) {
    return 'document';
  }

  return 'file';
}

function getUploadedTime(
  object
) {
  const value =
    object?.uploaded;

  if (!value) {
    return 0;
  }

  const time =
    new Date(
      value
    ).getTime();

  return Number.isFinite(
    time
  )
    ? time
    : 0;
}

function getObjectSize(
  object
) {
  return (
    Number(
      object?.size
    ) || 0
  );
}

function buildSearchText(
  object
) {
  const metadata =
    object?.customMetadata || {};

  const metadataValues =
    Object.values(
      metadata
    ).join(' ');

  return normalizeText(
    [
      getObjectName(
        object
      ),

      object?.key || '',

      getObjectContentType(
        object
      ),

      getObjectMediaType(
        object
      ),

      metadataValues
    ].join(' ')
  );
}

function sortObjects(
  objects,
  sortMode
) {
  const items = [
    ...objects
  ];

  if (
    sortMode === 'oldest'
  ) {
    return items.sort(
      (a, b) =>
        getUploadedTime(a) -
        getUploadedTime(b)
    );
  }

  if (
    sortMode === 'name'
  ) {
    return items.sort(
      (a, b) =>
        getObjectName(a)
          .localeCompare(
            getObjectName(b),
            'es',
            {
              sensitivity:
                'base'
            }
          )
    );
  }

  if (
    sortMode === 'size'
  ) {
    return items.sort(
      (a, b) =>
        getObjectSize(b) -
        getObjectSize(a)
    );
  }

  if (
    sortMode === 'type'
  ) {
    return items.sort(
      (a, b) => {
        const typeCompare =
          getObjectMediaType(a)
            .localeCompare(
              getObjectMediaType(b),
              'es',
              {
                sensitivity:
                  'base'
              }
            );

        if (
          typeCompare !== 0
        ) {
          return typeCompare;
        }

        return getObjectName(a)
          .localeCompare(
            getObjectName(b),
            'es',
            {
              sensitivity:
                'base'
            }
          );
      }
    );
  }

  return items.sort(
    (a, b) =>
      getUploadedTime(b) -
      getUploadedTime(a)
  );
}

function getMediaUrl(
  key
) {
  return (
    '/api/media/file?key=' +
    encodeURIComponent(
      key
    )
  );
}

function getAbsoluteMediaUrl(
  key
) {
  return new URL(
    getMediaUrl(
      key
    ),
    window.location.origin
  ).href;
}

function mergeUniqueObjects(
  currentObjects = [],
  newObjects = []
) {
  const map =
    new Map();

  currentObjects.forEach(
    object => {
      if (
        object?.key
      ) {
        map.set(
          object.key,
          object
        );
      }
    }
  );

  newObjects.forEach(
    object => {
      if (
        object?.key
      ) {
        map.set(
          object.key,
          object
        );
      }
    }
  );

  return [
    ...map.values()
  ];
}

export class R2MediaLibraryController {

  constructor({
    root,
    service = r2MediaService,
    prefix = '',
    pageSize = 50
  } = {}) {
    this.root = root;
    this.service = service;
    this.prefix = prefix;

    this.pageSize =
      Math.max(
        1,
        Number(
          pageSize
        ) || 50
      );

    this.cursor = null;
    this.hasMore = false;

    this.objects = [];
    this.filteredObjects = [];

    this.lastSelectedKey =
      null;

    this.searchQuery = '';
    this.activeFilter = 'all';
    this.sortMode = 'newest';
    this.viewMode =
      'grid';

    this.viewModeController =
      null;

    this.selectionController =
      new MediaSelectionController();

    this.selectedKeys =
      new Set();

    this.bulkBusy = false;

    this.loading = false;
    this.loadingMore = false;

    this.error = null;

    this.handleClick =
      this.handleClick.bind(
        this
      );

    this.handleInput =
      this.handleInput.bind(
        this
      );

    this.handleChange =
      this.handleChange.bind(
        this
      );
    
    this.handleKeyDown =
      this.handleKeyDown.bind(
        this
      );
  }

  init() {
    if (!this.root) {
      return false;
    }

    this.root.addEventListener(
      'click',
      this.handleClick
    );

    this.root.addEventListener(
      'input',
      this.handleInput
    );

    this.root.addEventListener(
      'change',
      this.handleChange
    );

    document.addEventListener(
      'keydown',
      this.handleKeyDown
    );
    
    this.load();

    this.viewModeController =
      new MediaViewModeController({
        root:
          this.root,

        onChange:
          mode => {
            this.viewMode =
              mode;

            this.render();
          }
      });

    this.viewMode =
      this.viewModeController
        .getMode();

    this.viewModeController
      .init();

    return true;
  }

  async load() {
    if (
      !this.root ||
      this.loading
    ) {
      return;
    }

    this.loading = true;
    this.loadingMore = false;

    this.error = null;

    this.cursor = null;
    this.hasMore = false;

    this.render();

    try {
      const result =
        await this.service.listFirstPage({
          prefix:
            this.prefix,

          limit:
            this.pageSize
        });

      this.objects =
        Array.isArray(
          result?.objects
        )
          ? result.objects
          : [];

      this.cursor =
        result?.cursor || null;

      this.hasMore =
        Boolean(
          result?.truncated &&
          this.cursor
        );

      this.pruneSelection();

      this.applyViewState();

      this.error = null;

    } catch (error) {
      console.error(
        '[R2MediaLibraryController]',
        error
      );

      this.objects = [];
      this.filteredObjects = [];

      this.cursor = null;
      this.hasMore = false;

      this.selectionController
        ?.clear({
          emitChange:
            false
        });

      this.selectedKeys.clear();

      this.lastSelectedKey =
        null;

      this.error =
        error?.message ||
        'No se pudo cargar la biblioteca multimedia.';

    } finally {
      this.loading = false;

          this.render();
    }
  }

  async loadMore() {
    if (
      !this.root ||
      this.loading ||
      this.loadingMore ||
      !this.hasMore ||
      !this.cursor
    ) {
      return false;
    }

    this.loadingMore = true;
    this.error = null;

    this.render();

    try {
      const result =
        await this.service.listNextPage({
          prefix:
            this.prefix,

          cursor:
            this.cursor,

          limit:
            this.pageSize
        });

      const newObjects =
        Array.isArray(
          result?.objects
        )
          ? result.objects
          : [];

      this.objects =
        mergeUniqueObjects(
          this.objects,
          newObjects
        );

      this.cursor =
        result?.cursor || null;

      this.hasMore =
        Boolean(
          result?.truncated &&
          this.cursor
        );

      this.pruneSelection();

      this.applyViewState();

      return true;

    } catch (error) {
      console.error(
        '[R2MediaLibraryController] Load more failed:',
        error
      );

      this.error =
        error?.message ||
        'No se pudieron cargar más archivos.';

      return false;

    } finally {
      this.loadingMore = false;

      this.render();
    }
  }

  async refresh() {
    /*
     * Una actualización vuelve a empezar
     * desde la primera página de R2.
     *
     * Esto mantiene los datos sincronizados
     * después de una nueva subida.
     */
    return this.load();
  }

  setPrefix(
    prefix = ''
  ) {
    this.prefix =
      String(prefix);

    this.searchQuery = '';
    this.activeFilter = 'all';
    this.sortMode = 'newest';

    this.cursor = null;
    this.hasMore = false;

    this.selectionController
      ?.clear({
        emitChange:
          false
      });

    this.selectedKeys.clear();

    this.lastSelectedKey =
      null;

    return this.load();
  }

  handleInput(
    event
  ) {
    const searchInput =
      event.target.closest(
        '[data-media-search]'
      );

    if (!searchInput) {
      return;
    }

    this.searchQuery =
      searchInput.value || '';

    this.applyViewState();

    this.render();

    this.restoreSearchFocus();
  }

    handleChange(
    event
  ) {
    const sortSelect =
      event.target.closest(
        '[data-media-sort]'
      );

    if (sortSelect) {
      this.setSortMode(
        sortSelect.value
      );

      return;
    }

    const checkbox =
      event.target.closest(
        '[data-media-select]'
      );

    if (!checkbox) {
      return;
    }

    const key =
      checkbox.getAttribute(
        'data-media-select'
      );

    if (!key) {
      return;
    }

    const shiftSelection =
      checkbox.getAttribute(
        'data-media-shift-select'
      ) === 'true';

    const additiveSelection =
      checkbox.getAttribute(
        'data-media-additive-select'
      ) === 'true';

    checkbox.removeAttribute(
      'data-media-shift-select'
    );

    checkbox.removeAttribute(
      'data-media-additive-select'
    );

    /*
     * Shift + Click
     * Selecciona un rango desde
     * el último archivo usado como ancla.
     *
     * Cmd/Ctrl + Shift conserva además
     * la selección anterior.
     */
    if (
      shiftSelection &&
      this.lastSelectedKey &&
      this.lastSelectedKey !== key
    ) {
      const anchorKey =
        this.lastSelectedKey;

      const success =
        this.selectionController
          ?.selectRange(
            key,
            {
              fromKey:
                anchorKey,

              additive:
                additiveSelection,

              preserveAnchor:
                true
            }
          );

      if (success) {
        this.syncSelectedKeysFromSelectionController();

        this.lastSelectedKey =
          anchorKey;

        this.render();

        return;
      }
    }

    /*
     * Cmd en macOS / Ctrl en Windows
     * mantiene las selecciones anteriores
     * y agrega o quita solamente este archivo.
     */
    if (
      additiveSelection
    ) {
      this.setSelected(
        key,
        checkbox.checked
      );

      return;
    }

    /*
     * Click normal del checkbox.
     *
     * Conservamos el comportamiento actual
     * para no romper la selección múltiple
     * que ya comprobamos que funciona.
     */
    this.setSelected(
      key,
      checkbox.checked
    );
  }

  async handleClick(
    event
  ) {
    const selectionCheckbox =
  event.target.closest(
    '[data-media-select]'
  );

if (selectionCheckbox) {
  selectionCheckbox.setAttribute(
    'data-media-shift-select',
    event.shiftKey
      ? 'true'
      : 'false'
  );

  selectionCheckbox.setAttribute(
    'data-media-additive-select',
    (
      event.metaKey ||
      event.ctrlKey
    )
      ? 'true'
      : 'false'
  );

  return;
}

        const mediaItem =
      event.target.closest(
        '[data-media-key]'
      );

    const interactiveElement =
      event.target.closest(
        [
          'button',
          'a',
          'input',
          'select',
          'textarea',
          'summary',
          'details',
          'audio',
          'video',
          '[data-media-menu]',
          '[data-media-preview]',
          '[data-media-home-feature]',
          '[data-media-copy]',
          '[data-media-download]',
          '[data-media-delete]'
        ].join(',')
      );

    if (
      mediaItem &&
      !interactiveElement
    ) {
      const key =
        mediaItem.getAttribute(
          'data-media-key'
        );

      if (!key) {
        return;
      }

      const additive =
        event.metaKey ||
        event.ctrlKey;

      const range =
        event.shiftKey;

      if (
        range &&
        this.lastSelectedKey &&
        this.lastSelectedKey !== key
      ) {
        const success =
          this.selectionController
            ?.selectRange(
              key,
              {
                fromKey:
                  this.lastSelectedKey,

                additive,

                preserveAnchor:
                  true
              }
            );

        if (success) {
          this.syncSelectedKeysFromSelectionController();

          this.render();
        }

        return;
      }

      if (additive) {
        const selected =
          !this.selectedKeys.has(
            key
          );

        this.setSelected(
          key,
          selected
        );

        return;
      }

      this.selectionController
        ?.clear({
          emitChange:
            false
        });

      this.selectedKeys.clear();

      this.setSelected(
        key,
        true
      );

      this.lastSelectedKey =
        key;

      return;
    }
    
    const loadMoreButton =
      event.target.closest(
        '[data-media-load-more]'
      );

    if (loadMoreButton) {
      await this.loadMore();

      return;
    }

    const clearButton =
      event.target.closest(
        '[data-media-search-clear]'
      );

    if (clearButton) {
      this.clearSearch();

      return;
    }

    const filterButton =
      event.target.closest(
        '[data-media-filter]'
      );

    if (filterButton) {
      this.setFilter(
        filterButton.getAttribute(
          'data-media-filter'
        )
      );

      return;
    }

    const selectAllButton =
      event.target.closest(
        '[data-media-select-all]'
      );

    if (selectAllButton) {
      this.selectVisible();

      return;
    }

    const clearSelectionButton =
      event.target.closest(
        '[data-media-selection-clear]'
      );

    if (clearSelectionButton) {
      this.clearSelection();

      return;
    }

    const bulkCopyButton =
      event.target.closest(
        '[data-media-bulk-copy]'
      );

    if (bulkCopyButton) {
      await this.copySelectedLinks(
        bulkCopyButton
      );

      return;
    }

    const bulkDownloadButton =
      event.target.closest(
        '[data-media-bulk-download]'
      );

    if (bulkDownloadButton) {
      await this.downloadSelected(
        bulkDownloadButton
      );

      return;
    }
    
    const bulkDeleteButton =
      event.target.closest(
        '[data-media-bulk-delete]'
      );

    if (bulkDeleteButton) {
      await this.deleteSelected();

      return;
    }

    const homeFeatureButton =
      event.target.closest(
        '[data-media-home-feature]'
      );

    if (homeFeatureButton) {
      await this.setHomeFeaturedMedia(
        homeFeatureButton
      );

      return;
    }
    
    const copyButton =
      event.target.closest(
        '[data-media-copy]'
      );

    if (copyButton) {
      await this.copyMediaLink(
        copyButton
      );

      return;
    }

    const deleteButton =
      event.target.closest(
        '[data-media-delete]'
      );

    if (deleteButton) {
      await this.deleteMedia(
        deleteButton
      );
    }
  }

  handleKeyDown(
  event
) {
  if (
    !this.root ||
    this.bulkBusy
  ) {
    return;
  }

  const target =
    event.target;

  const typing =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable;

  if (typing) {
    return;
  }

  const selectAllShortcut =
    (
      event.metaKey ||
      event.ctrlKey
    ) &&
    event.key.toLowerCase() ===
      'a';

  if (selectAllShortcut) {
    event.preventDefault();

    this.selectVisible();

    return;
  }

  if (
    event.key ===
      'Escape' &&
    this.selectedKeys.size
  ) {
    event.preventDefault();

    this.clearSelection();
  }
}
  
  applyViewState() {
    const query =
      normalizeText(
        this.searchQuery
      );

    const filtered =
      this.objects.filter(
        object => {
          const matchesSearch =
            !query ||
            buildSearchText(
              object
            ).includes(
              query
            );

          const mediaType =
            getObjectMediaType(
              object
            );

          const matchesType =
            this.activeFilter ===
              'all' ||
            mediaType ===
              this.activeFilter;

          return (
            matchesSearch &&
            matchesType
          );
        }
      );

    this.filteredObjects =
      sortObjects(
        filtered,
        this.sortMode
      );

    const orderedKeys =
      this.filteredObjects
        .map(
          object =>
            object?.key
        )
        .filter(
          Boolean
        );

    this.selectionController
      ?.setOrderedKeys(
        orderedKeys
      );
  }

  setFilter(
    filter = 'all'
  ) {
    const allowedFilters = [
      'all',
      'image',
      'audio',
      'video',
      'document',
      'file'
    ];

    this.activeFilter =
      allowedFilters.includes(
        filter
      )
        ? filter
        : 'all';

    this.applyViewState();

    this.render();

    this.restoreSearchFocus();
  }

  setSortMode(
    sortMode = 'newest'
  ) {
    const allowedSortModes = [
      'newest',
      'oldest',
      'name',
      'size',
      'type'
    ];

    const nextSortMode =
      allowedSortModes.includes(
        sortMode
      )
        ? sortMode
        : 'newest';

    if (
      this.sortMode ===
      nextSortMode
    ) {
      return;
    }

    this.sortMode =
      nextSortMode;

    this.applyViewState();

    this.render();
  }

  clearSearch() {
    if (
      !this.searchQuery
    ) {
      return;
    }

    this.searchQuery = '';

    this.applyViewState();

    this.render();

    this.restoreSearchFocus();
  }

  setSelected(
    key,
    selected
  ) {
    if (
      !key ||
      this.bulkBusy
    ) {
      return;
    }

    if (
      this.selectionController
    ) {
      this.selectionController
        .setSelected(
          key,
          selected,
          {
            additive:
              true,

            emitChange:
              true
          }
        );

      this.syncSelectedKeysFromSelectionController();

      this.render();

      return;
    }

    /*
     * Compatibilidad de seguridad.
     * Solo se usa si el Selection Controller
     * no está disponible.
     */
    if (selected) {
      this.selectedKeys.add(
        key
      );

      this.lastSelectedKey =
        key;
    } else {
      this.selectedKeys.delete(
        key
      );

      if (
        this.lastSelectedKey ===
        key
      ) {
        this.lastSelectedKey =
          null;
      }
    }

    this.render();
  }

  selectVisible() {
    if (
      this.bulkBusy
    ) {
      return;
    }

    const visibleKeys =
      this.filteredObjects
        .map(
          object =>
            object?.key
        )
        .filter(
          Boolean
        );

    if (
      this.selectionController
    ) {
      this.selectionController
        .setOrderedKeys(
          visibleKeys
        );

      this.selectionController
        .selectVisible({
          replace:
            false,

          emitChange:
            true
        });

      this.syncSelectedKeysFromSelectionController();

      this.render();

      return;
    }

    visibleKeys.forEach(
      key => {
        this.selectedKeys.add(
          key
        );
      }
    );

    this.render();
  }

  clearSelection() {
    if (
      this.bulkBusy
    ) {
      return;
    }

    if (
      this.selectionController
    ) {
      this.selectionController
        .clear({
          emitChange:
            true
        });

      this.syncSelectedKeysFromSelectionController();

      this.render();

      return;
    }

    this.selectedKeys.clear();

    this.lastSelectedKey =
      null;

    this.render();
  }

  pruneSelection() {
    const validKeys =
      this.objects
        .map(
          object =>
            object?.key
        )
        .filter(
          Boolean
        );

    if (
      this.selectionController
    ) {
      this.selectionController
        .prune(
          validKeys,
          {
            emitChange:
              false
          }
        );

      this.syncSelectedKeysFromSelectionController();

      return;
    }

    const validKeySet =
      new Set(
        validKeys
      );

    this.selectedKeys.forEach(
      key => {
        if (
          !validKeySet.has(
            key
          )
        ) {
          this.selectedKeys.delete(
            key
          );
        }
      }
    );

    if (
      this.lastSelectedKey &&
      !validKeySet.has(
        this.lastSelectedKey
      )
    ) {
      this.lastSelectedKey =
        null;
    }
  }

  syncSelectedKeysFromSelectionController() {
    if (
      !this.selectionController
    ) {
      return this.selectedKeys;
    }

    const selectedKeys =
      this.selectionController
        .getSelectedKeys();

    this.selectedKeys.clear();

    selectedKeys.forEach(
      key => {
        this.selectedKeys.add(
          key
        );
      }
    );

    this.lastSelectedKey =
      this.selectionController
        .getLastSelectedKey() ||
      null;

    return this.selectedKeys;
  }

  restoreSearchFocus() {
    window.requestAnimationFrame(
      () => {
        if (!this.root) {
          return;
        }

        const input =
          this.root.querySelector(
            '[data-media-search]'
          );

        if (!input) {
          return;
        }

        input.focus();

        const length =
          input.value.length;

        input.setSelectionRange?.(
          length,
          length
        );
      }
    );
  }

  async copyMediaLink(
    button
  ) {
    const mediaUrl =
      button.getAttribute(
        'data-media-url'
      );

    if (!mediaUrl) {
      return false;
    }

    const absoluteUrl =
      new URL(
        mediaUrl,
        window.location.origin
      ).href;

    const originalText =
      button.textContent;

    try {
      await navigator
        .clipboard
        .writeText(
          absoluteUrl
        );

      button.textContent =
        '✓ Copiado';

      button.disabled =
        true;

      window.setTimeout(
        () => {
          if (
            !button.isConnected
          ) {
            return;
          }

          button.textContent =
            originalText;

          button.disabled =
            false;
        },
        1800
      );

      return true;

    } catch (error) {
      console.error(
        '[R2MediaLibraryController] Copy failed:',
        error
      );

      return false;
    }
  }

  async copySelectedLinks(
    button
  ) {
    if (
      this.bulkBusy ||
      !this.selectedKeys.size
    ) {
      return false;
    }

    const selectedObjects =
      this.getSelectedObjects();

    if (
      !selectedObjects.length
    ) {
      return false;
    }

    const links =
      selectedObjects.map(
        object =>
          getAbsoluteMediaUrl(
            object.key
          )
      );

    const text =
      links.join(
        '\n'
      );

    const originalText =
      button.textContent;

    try {
      await navigator
        .clipboard
        .writeText(
          text
        );

      button.textContent =
        '✓ Enlaces copiados';

      button.disabled =
        true;

      window.setTimeout(
        () => {
          if (
            !button.isConnected
          ) {
            return;
          }

          button.textContent =
            originalText;

          button.disabled =
            false;
        },
        1800
      );

      return true;

    } catch (error) {
      console.error(
        '[R2MediaLibraryController] Bulk copy failed:',
        error
      );

      return false;
    }
  }

  async downloadSelected(
  button
) {
  if (
    this.bulkBusy ||
    !this.selectedKeys.size
  ) {
    return false;
  }

  const selectedObjects =
    this.getSelectedObjects();

  if (
    !selectedObjects.length
  ) {
    return false;
  }

  const originalText =
    button?.textContent ||
    'Descargar seleccionados';

  if (button) {
    button.disabled = true;
    button.textContent =
      'Preparando descargas...';
  }

  try {
    for (
      const object
      of selectedObjects
    ) {
      const key =
        object?.key;

      if (!key) {
        continue;
      }

      const link =
        document.createElement(
          'a'
        );

      link.href =
        getMediaUrl(
          key
        );

      link.download =
        getObjectName(
          object
        ) || '';

      link.style.display =
        'none';

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      await new Promise(
        resolve =>
          window.setTimeout(
            resolve,
            150
          )
      );
    }

    return true;

  } catch (error) {
    console.error(
      '[R2MediaLibraryController] Bulk download failed:',
      error
    );

    return false;

  } finally {
    if (
      button &&
      button.isConnected
    ) {
      button.disabled =
        false;

      button.textContent =
        originalText;
    }
  }
}
  
  async deleteMedia(
    button
  ) {
    if (
      this.bulkBusy
    ) {
      return false;
    }

    const key =
      button.getAttribute(
        'data-media-delete'
      );

    if (!key) {
      return false;
    }

    const object =
      this.objects.find(
        item =>
          item.key === key
      );

    const originalName =
      getObjectName(
        object
      ) ||
      'este archivo';

    const confirmed =
      window.confirm(
        `¿Eliminar "${originalName}" permanentemente?`
      );

    if (!confirmed) {
      return false;
    }

    const originalText =
      button.textContent;

    button.disabled =
      true;

    button.textContent =
      'Eliminando...';

    try {
      const success =
        await this.deleteObjectByKey(
          key
        );

      if (!success) {
        throw new Error(
          'No se pudo eliminar el archivo.'
        );
      }

      this.removeObjectFromState(
        key
      );

      this.render();

      return true;

    } catch (error) {
      console.error(
        '[R2MediaLibraryController] Delete failed:',
        error
      );

      if (
        button.isConnected
      ) {
        button.disabled =
          false;

        button.textContent =
          originalText;
      }

      return false;
    }
  }

  async deleteSelected() {
    if (
      this.bulkBusy ||
      !this.selectedKeys.size
    ) {
      return false;
    }

    const selectedObjects =
      this.getSelectedObjects();

    if (
      !selectedObjects.length
    ) {
      return false;
    }

    const count =
      selectedObjects.length;

    const confirmed =
      window.confirm(
        `¿Eliminar permanentemente ${count} archivo${
          count === 1
            ? ''
            : 's'
        } seleccionado${
          count === 1
            ? ''
            : 's'
        }?`
      );

    if (!confirmed) {
      return false;
    }

    this.bulkBusy = true;

    this.render();

    const failedKeys = [];

    try {
      for (
        const object
        of selectedObjects
      ) {
        const key =
          object?.key;

        if (!key) {
          continue;
        }

        const success =
          await this.deleteObjectByKey(
            key
          );

        if (success) {
          this.removeObjectFromState(
            key,
            {
              render:
                false
            }
          );
        } else {
          failedKeys.push(
            key
          );
        }
      }

      this.applyViewState();

      if (
        failedKeys.length
      ) {
        console.error(
          '[R2MediaLibraryController] Some bulk deletes failed:',
          failedKeys
        );
      }

      return (
        failedKeys.length === 0
      );

    } finally {
      this.bulkBusy = false;

      this.render();
    }
  }

  async deleteObjectByKey(
    key
  ) {
    try {
      const response =
        await fetch(
          '/api/media/delete',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json'
            },

            body:
              JSON.stringify({
                key
              })
          }
        );

      let data = null;

      try {
        data =
          await response.json();
      } catch {
        return false;
      }

      return Boolean(
        response.ok &&
        data?.success
      );

    } catch (error) {
      console.error(
        '[R2MediaLibraryController] Delete request failed:',
        error
      );

      return false;
    }
  }

  removeObjectFromState(
    key,
    {
      render = false
    } = {}
  ) {
    this.objects =
      this.objects.filter(
        item =>
          item.key !== key
      );

    if (
      this.selectionController
    ) {
      this.selectionController
        .deselect(
          key,
          {
            emitChange:
              false
          }
        );

      this.syncSelectedKeysFromSelectionController();
    } else {
      this.selectedKeys.delete(
        key
      );
    }

    this.applyViewState();

    if (render) {
      this.render();
    }
  }

  render() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML =
      renderR2MediaLibrary({
        objects:
          this.filteredObjects,

        /*
         * Las estadísticas se calculan
         * sobre todos los objetos que ya
         * han sido cargados desde R2.
         */
        allObjects:
          this.objects,

        viewMode:
          this.viewMode,

        totalCount:
          this.objects.length,

        searchQuery:
          this.searchQuery,

        activeFilter:
          this.activeFilter,

        sortMode:
          this.sortMode,

        selectedKeys:
          this.selectedKeys,

        selectedCount:
          this.selectedKeys.size,

        bulkBusy:
          this.bulkBusy,

        /*
         * V13.6.6 — Pagination state
         */
        hasMore:
          this.hasMore,

        loadingMore:
          this.loadingMore,

        loading:
          this.loading,

        error:
          this.error
      });
  }

  getObjects() {
    return [
      ...this.objects
    ];
  }

  getFilteredObjects() {
    return [
      ...this.filteredObjects
    ];
  }

  getSelectedKeys() {
    return [
      ...this.selectedKeys
    ];
  }

  getSelectedObjects() {
    return this.objects.filter(
      object =>
        this.selectedKeys.has(
          object.key
        )
    );
  }

  getActiveFilter() {
    return this.activeFilter;
  }

  getSortMode() {
    return this.sortMode;
  }

  getPaginationState() {
    return {
      pageSize:
        this.pageSize,

      cursor:
        this.cursor,

      hasMore:
        this.hasMore,

      loadingMore:
        this.loadingMore,

      loadedCount:
        this.objects.length
    };
  }

  destroy() {
    if (this.root) {
      this.root.removeEventListener(
        'click',
        this.handleClick
      );

      this.root.removeEventListener(
        'input',
        this.handleInput
      );

      this.root.removeEventListener(
        'change',
        this.handleChange
      );

      document.removeEventListener(
        'keydown',
        this.handleKeyDown
      );
    }

    this.root = null;

    this.viewModeController
      ?.destroy();

    this.viewModeController =
      null;

    this.selectionController
      ?.clear({
        emitChange:
          false
      });

    this.selectionController
      ?.destroy();

    this.selectionController =
      null;

    this.objects = [];
    this.filteredObjects = [];

    this.selectedKeys.clear();

    this.lastSelectedKey =
      null;

    this.searchQuery = '';
    this.activeFilter = 'all';
    this.sortMode = 'newest';

    this.cursor = null;
    this.hasMore = false;

    this.bulkBusy = false;

    this.loading = false;
    this.loadingMore = false;

    this.error = null;
  }

}
