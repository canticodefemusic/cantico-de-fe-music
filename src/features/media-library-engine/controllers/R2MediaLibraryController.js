/**
 * Cántico de Fe Music
 * V13.6.3 — R2 Media Library Controller
 *
 * Funciones:
 * - Cargar biblioteca R2
 * - Refrescar biblioteca
 * - Buscar en memoria
 * - Filtrar por tipo
 * - Ordenar resultados
 * - Selección múltiple
 * - Seleccionar visibles
 * - Limpiar selección
 * - Copiar enlace
 * - Eliminar archivo de R2
 */

import r2MediaService
  from '../services/R2MediaService.js';

import {
  renderR2MediaLibrary
} from '../components/renderR2MediaLibrary.js';

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

export class R2MediaLibraryController {

  constructor({
    root,
    service = r2MediaService,
    prefix = ''
  } = {}) {
    this.root = root;
    this.service = service;
    this.prefix = prefix;

    this.objects = [];
    this.filteredObjects = [];

    this.searchQuery = '';
    this.activeFilter = 'all';
    this.sortMode = 'newest';

    this.selectedKeys =
      new Set();

    this.loading = false;
    this.error = null;

    this.handleClick =
      this.handleClick.bind(this);

    this.handleInput =
      this.handleInput.bind(this);

    this.handleChange =
      this.handleChange.bind(this);
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

    this.load();

    return true;
  }

  async load() {
    if (!this.root) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.render();

    try {
      this.objects =
        await this.service.listAll({
          prefix:
            this.prefix
        });

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
      this.selectedKeys.clear();

      this.error =
        error?.message ||
        'No se pudo cargar la biblioteca multimedia.';
    } finally {
      this.loading = false;

      this.render();
    }
  }

  async refresh() {
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

    this.selectedKeys.clear();

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

    if (checkbox) {
      const key =
        checkbox.getAttribute(
          'data-media-select'
        );

      this.setSelected(
        key,
        checkbox.checked
      );
    }
  }

  async handleClick(
    event
  ) {
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

    this.sortMode =
      allowedSortModes.includes(
        sortMode
      )
        ? sortMode
        : 'newest';

    this.applyViewState();

    this.render();
  }

  clearSearch() {
    this.searchQuery = '';

    this.applyViewState();

    this.render();

    this.restoreSearchFocus();
  }

  setSelected(
    key,
    selected
  ) {
    if (!key) {
      return;
    }

    if (selected) {
      this.selectedKeys.add(
        key
      );
    } else {
      this.selectedKeys.delete(
        key
      );
    }

    this.render();
  }

  selectVisible() {
    this.filteredObjects.forEach(
      object => {
        if (
          object?.key
        ) {
          this.selectedKeys.add(
            object.key
          );
        }
      }
    );

    this.render();
  }

  clearSelection() {
    this.selectedKeys.clear();

    this.render();
  }

  pruneSelection() {
    const validKeys =
      new Set(
        this.objects
          .map(
            object =>
              object?.key
          )
          .filter(Boolean)
      );

    this.selectedKeys.forEach(
      key => {
        if (
          !validKeys.has(
            key
          )
        ) {
          this.selectedKeys.delete(
            key
          );
        }
      }
    );
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
      await navigator.clipboard.writeText(
        absoluteUrl
      );

      button.textContent =
        '✓ Copiado';

      button.disabled =
        true;

      window.setTimeout(
        () => {
          if (!button.isConnected) {
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

      button.textContent =
        'No se pudo copiar';

      window.setTimeout(
        () => {
          if (!button.isConnected) {
            return;
          }

          button.textContent =
            originalText;
        },
        1800
      );

      return false;
    }
  }

  async deleteMedia(
    button
  ) {
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
      const response =
        await fetch(
          '/api/media/delete',
          {
            method: 'POST',

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
        throw new Error(
          'La API de eliminación devolvió una respuesta inválida.'
        );
      }

      if (
        !response.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.error ||
          `No se pudo eliminar el archivo. HTTP ${response.status}`
        );
      }

      this.objects =
        this.objects.filter(
          item =>
            item.key !== key
        );

      this.selectedKeys.delete(
        key
      );

      this.applyViewState();

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
          'Error al eliminar';

        window.setTimeout(
          () => {
            if (
              !button.isConnected
            ) {
              return;
            }

            button.textContent =
              originalText;
          },
          2000
        );
      }

      return false;
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
    }

    this.root = null;

    this.objects = [];
    this.filteredObjects = [];

    this.selectedKeys.clear();

    this.searchQuery = '';
    this.activeFilter = 'all';
    this.sortMode = 'newest';

    this.loading = false;
    this.error = null;
  }

}
