/**
 * Cántico de Fe Music
 * V12.8.4 — Media Toolbar
 */

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderTypeOptions(
  selectedType = 'all'
) {
  const options = [
    {
      value: 'all',
      label: 'Todos los tipos'
    },
    {
      value: 'image',
      label: 'Imágenes'
    },
    {
      value: 'audio',
      label: 'Audio'
    },
    {
      value: 'video',
      label: 'Videos'
    },
    {
      value: 'document',
      label: 'Documentos'
    },
    {
      value: 'other',
      label: 'Otros'
    }
  ];

  return options
    .map(option => `
      <option
        value="${escapeHtml(
          option.value
        )}"
        ${
          selectedType === option.value
            ? 'selected'
            : ''
        }
      >
        ${escapeHtml(
          option.label
        )}
      </option>
    `)
    .join('');
}

function renderCategoryOptions(
  categories = [],
  selectedCategory = 'all'
) {
  const normalizedCategories =
    Array.isArray(categories)
      ? categories
      : [];

  return [
    `
      <option
        value="all"
        ${
          selectedCategory === 'all'
            ? 'selected'
            : ''
        }
      >
        Todas las categorías
      </option>
    `,
    ...normalizedCategories.map(category => `
      <option
        value="${escapeHtml(
          category
        )}"
        ${
          selectedCategory === category
            ? 'selected'
            : ''
        }
      >
        ${escapeHtml(
          category
        )}
      </option>
    `)
  ].join('');
}

function renderSortOptions(
  selectedSort = 'order'
) {
  const options = [
    {
      value: 'order',
      label: 'Orden del catálogo'
    },
    {
      value: 'name-asc',
      label: 'Nombre A–Z'
    },
    {
      value: 'name-desc',
      label: 'Nombre Z–A'
    },
    {
      value: 'type',
      label: 'Tipo'
    },
    {
      value: 'category',
      label: 'Categoría'
    }
  ];

  return options
    .map(option => `
      <option
        value="${escapeHtml(
          option.value
        )}"
        ${
          selectedSort === option.value
            ? 'selected'
            : ''
        }
      >
        ${escapeHtml(
          option.label
        )}
      </option>
    `)
    .join('');
}

export default function renderMediaToolbar({
  query = '',
  type = 'all',
  category = 'all',
  sort = 'order',
  categories = []
} = {}) {
  return `
    <section
      class="media-toolbar"
      aria-label="Herramientas de biblioteca multimedia"
      data-media-toolbar
    >
      <label
        class="media-toolbar__search"
        for="mediaLibrarySearch"
      >
        <span>
          Buscar archivos
        </span>

        <input
          id="mediaLibrarySearch"
          type="search"
          autocomplete="off"
          placeholder="Buscar por nombre, descripción, categoría o etiqueta..."
          value="${escapeHtml(
            query
          )}"
          data-media-search
        >
      </label>

      <label
        class="media-toolbar__filter"
        for="mediaLibraryType"
      >
        <span>
          Tipo
        </span>

        <select
          id="mediaLibraryType"
          data-media-type
        >
          ${renderTypeOptions(
            type
          )}
        </select>
      </label>

      <label
        class="media-toolbar__filter"
        for="mediaLibraryCategory"
      >
        <span>
          Categoría
        </span>

        <select
          id="mediaLibraryCategory"
          data-media-category
        >
          ${renderCategoryOptions(
            categories,
            category
          )}
        </select>
      </label>

      <label
        class="media-toolbar__filter"
        for="mediaLibrarySort"
      >
        <span>
          Ordenar
        </span>

        <select
          id="mediaLibrarySort"
          data-media-sort
        >
          ${renderSortOptions(
            sort
          )}
        </select>
      </label>

      <button
        type="button"
        class="media-toolbar__reset"
        data-media-reset
      >
        Limpiar filtros
      </button>
    </section>
  `;
}

export {
  renderTypeOptions,
  renderCategoryOptions,
  renderSortOptions
};
