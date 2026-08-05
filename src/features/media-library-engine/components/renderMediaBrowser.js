/**
 * Cántico de Fe Music
 * V12.8.5 — Media Browser
 */

import MediaLibraryService
  from '../services/MediaLibraryService.js';

import renderMediaToolbar
  from './renderMediaToolbar.js';

import renderMediaGrid
  from './renderMediaGrid.js';

function normalizeText(value = '') {
  return String(
    value ?? ''
  ).trim();
}

function getCategories(
  items = []
) {
  return [
    ...new Set(
      items
        .map(item =>
          normalizeText(
            item.category
          )
        )
        .filter(Boolean)
    )
  ].sort(
    (first, second) =>
      first.localeCompare(
        second,
        'es',
        {
          sensitivity: 'base'
        }
      )
  );
}

function sortItems(
  items = [],
  sort = 'order'
) {
  const sortedItems =
    [...items];

  switch (sort) {
    case 'name-asc':
      return sortedItems.sort(
        (first, second) =>
          String(
            first.name || ''
          ).localeCompare(
            String(
              second.name || ''
            ),
            'es',
            {
              sensitivity: 'base'
            }
          )
      );

    case 'name-desc':
      return sortedItems.sort(
        (first, second) =>
          String(
            second.name || ''
          ).localeCompare(
            String(
              first.name || ''
            ),
            'es',
            {
              sensitivity: 'base'
            }
          )
      );

    case 'type':
      return sortedItems.sort(
        (first, second) =>
          String(
            first.type || ''
          ).localeCompare(
            String(
              second.type || ''
            ),
            'es',
            {
              sensitivity: 'base'
            }
          )
      );

    case 'category':
      return sortedItems.sort(
        (first, second) =>
          String(
            first.category || ''
          ).localeCompare(
            String(
              second.category || ''
            ),
            'es',
            {
              sensitivity: 'base'
            }
          )
      );

    case 'order':
    default:
      return sortedItems.sort(
        (first, second) => {
          const firstOrder =
            Number(
              first.order || 0
            );

          const secondOrder =
            Number(
              second.order || 0
            );

          if (
            firstOrder !==
            secondOrder
          ) {
            return (
              firstOrder -
              secondOrder
            );
          }

          return String(
            first.name || ''
          ).localeCompare(
            String(
              second.name || ''
            ),
            'es',
            {
              sensitivity: 'base'
            }
          );
        }
      );
  }
}

function filterItems({
  items = [],
  query = '',
  type = 'all',
  category = 'all'
} = {}) {
  const cleanQuery =
    normalizeText(
      query
    );

  let filteredItems =
    cleanQuery
      ? MediaLibraryService.search(
          cleanQuery
        )
      : [...items];

  if (
    type &&
    type !== 'all'
  ) {
    filteredItems =
      filteredItems.filter(
        item =>
          item.type === type
      );
  }

  if (
    category &&
    category !== 'all'
  ) {
    filteredItems =
      filteredItems.filter(
        item =>
          item.category ===
          category
      );
  }

  return filteredItems;
}

export default function renderMediaBrowser({
  query = '',
  type = 'all',
  category = 'all',
  sort = 'order',
  selectable = true,
  title =
    'Biblioteca multimedia',
  description =
    'Explora imágenes, audios, videos y otros recursos del proyecto.'
} = {}) {
  const allItems =
    MediaLibraryService.getAll();

  const categories =
    getCategories(
      allItems
    );

  const filteredItems =
    filterItems({
      items:
        allItems,
      query,
      type,
      category
    });

  const sortedItems =
    sortItems(
      filteredItems,
      sort
    );

  return `
    <section
      class="media-browser"
      data-media-browser
      data-media-selectable="${String(
        selectable
      )}"
    >
      <header
        class="media-browser__header"
      >
        <div>
          <p
            class="admin-section__eyebrow"
          >
            RECURSOS DEL PROYECTO
          </p>

          <h1>
            ${title}
          </h1>

          <p>
            ${description}
          </p>
        </div>

        <strong
          data-media-result-count
        >
          ${sortedItems.length}
          ${
            sortedItems.length === 1
              ? 'archivo'
              : 'archivos'
          }
        </strong>
      </header>

      ${renderMediaToolbar({
        query,
        type,
        category,
        sort,
        categories
      })}

      <div
        class="media-browser__content"
        data-media-browser-content
      >
        ${renderMediaGrid(
          sortedItems
        )}
      </div>
    </section>
  `;
}

export {
  getCategories,
  sortItems,
  filterItems
};
