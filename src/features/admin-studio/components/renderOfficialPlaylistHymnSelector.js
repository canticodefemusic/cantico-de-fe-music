/**
 * Cántico de Fe Music
 * V12.7 — Official Playlist Hymn Selector
 */

import {
  HymnLibraryService
} from '../../hymn-library-engine/services/HymnLibraryService.js';

const hymnLibraryService =
  new HymnLibraryService();

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeText(value = '') {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(/ñ/g, 'n');
}

function normalizeSelectedIds(
  selectedIds = []
) {
  if (!Array.isArray(selectedIds)) {
    return [];
  }

  return [
    ...new Set(
      selectedIds
        .map(id =>
          String(id ?? '').trim()
        )
        .filter(Boolean)
    )
  ];
}

function getHymnSearchText(
  hymn = {}
) {
  return normalizeText(
    [
      hymn.title,
      hymn.subtitle,
      hymn.category,
      hymn.theme,
      hymn.artist,
      ...(Array.isArray(
        hymn.scriptures
      )
        ? hymn.scriptures
        : []),
      ...(Array.isArray(
        hymn.tags
      )
        ? hymn.tags
        : [])
    ].join(' ')
  );
}

function filterHymns(
  hymns = [],
  query = ''
) {
  const term =
    normalizeText(query);

  if (!term) {
    return hymns;
  }

  return hymns.filter(hymn =>
    getHymnSearchText(
      hymn
    ).includes(term)
  );
}

function renderHymnMetadata(
  hymn = {}
) {
  const metadata = [
    hymn.category,
    hymn.theme
  ].filter(Boolean);

  if (!metadata.length) {
    return `
      <span>
        Sin categoría
      </span>
    `;
  }

  return metadata
    .map(value => `
      <span>
        ${escapeHtml(value)}
      </span>
    `)
    .join('');
}

function renderAvailableHymn({
  hymn,
  selectedIds
}) {
  const selected =
    selectedIds.includes(
      hymn.id
    );

  return `
    <label
      class="
        admin-playlist-hymn-selector__item
        ${
          selected
            ? 'is-selected'
            : ''
        }
      "
      data-admin-official-playlist-hymn-item
      data-hymn-search-text="${escapeHtml(
        getHymnSearchText(
          hymn
        )
      )}"
    >
      <input
        type="checkbox"
        name="hymnIds"
        value="${escapeHtml(
          hymn.id
        )}"
        ${
          selected
            ? 'checked'
            : ''
        }
        data-admin-official-playlist-hymn-toggle
      >

      <span
        class="admin-playlist-hymn-selector__check"
        aria-hidden="true"
      >
        ✓
      </span>

      <span
        class="admin-playlist-hymn-selector__content"
      >
        <strong>
          ${escapeHtml(
            hymn.title ||
            'Himno sin título'
          )}
        </strong>

        ${
          hymn.subtitle
            ? `
              <small>
                ${escapeHtml(
                  hymn.subtitle
                )}
              </small>
            `
            : ''
        }

        <span
          class="admin-playlist-hymn-selector__meta"
        >
          ${renderHymnMetadata(
            hymn
          )}
        </span>
      </span>
    </label>
  `;
}

function renderSelectedHymn({
  hymn,
  position
}) {
  return `
    <article
      class="admin-playlist-selected-hymn"
      data-admin-official-playlist-selected-hymn="${escapeHtml(
        hymn.id
      )}"
    >
      <span
        class="admin-playlist-selected-hymn__position"
      >
        ${position}
      </span>

      <div
        class="admin-playlist-selected-hymn__content"
      >
        <strong>
          ${escapeHtml(
            hymn.title ||
            'Himno sin título'
          )}
        </strong>

        <small>
          ${escapeHtml(
            hymn.category ||
            'Sin categoría'
          )}
        </small>
      </div>

      <div
        class="admin-playlist-selected-hymn__actions"
      >
        <button
          type="button"
          aria-label="Subir ${escapeHtml(
            hymn.title
          )}"
          title="Subir"
          data-admin-official-playlist-hymn-up="${escapeHtml(
            hymn.id
          )}"
        >
          ↑
        </button>

        <button
          type="button"
          aria-label="Bajar ${escapeHtml(
            hymn.title
          )}"
          title="Bajar"
          data-admin-official-playlist-hymn-down="${escapeHtml(
            hymn.id
          )}"
        >
          ↓
        </button>

        <button
          type="button"
          aria-label="Quitar ${escapeHtml(
            hymn.title
          )}"
          title="Quitar"
          data-admin-official-playlist-hymn-remove="${escapeHtml(
            hymn.id
          )}"
        >
          Quitar
        </button>
      </div>
    </article>
  `;
}

function renderAvailableList({
  hymns,
  selectedIds
}) {
  if (!hymns.length) {
    return `
      <div
        class="admin-section__empty"
        data-admin-official-playlist-hymn-empty
      >
        <p>
          No se encontraron himnos.
        </p>
      </div>
    `;
  }

  return hymns
    .map(hymn =>
      renderAvailableHymn({
        hymn,
        selectedIds
      })
    )
    .join('');
}

function renderSelectedList({
  hymns,
  selectedIds
}) {
  const hymnsById =
    new Map(
      hymns.map(hymn => [
        hymn.id,
        hymn
      ])
    );

  const selectedHymns =
    selectedIds
      .map(id =>
        hymnsById.get(id)
      )
      .filter(Boolean);

  if (!selectedHymns.length) {
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

  return selectedHymns
    .map((hymn, index) =>
      renderSelectedHymn({
        hymn,
        position:
          index + 1
      })
    )
    .join('');
}

export function renderOfficialPlaylistHymnSelector({
  selectedIds = [],
  query = ''
} = {}) {
  const hymns =
    hymnLibraryService.list();

  const normalizedSelectedIds =
    normalizeSelectedIds(
      selectedIds
    );

  const filteredHymns =
    filterHymns(
      hymns,
      query
    );

  return `
    <section
      class="admin-playlist-hymn-selector"
      data-admin-official-playlist-hymn-selector
    >
      <div
        class="admin-playlist-hymn-selector__available"
      >
        <header
          class="admin-playlist-hymn-selector__header"
        >
          <div>
            <h3>
              Biblioteca de himnos
            </h3>

            <p>
              Selecciona los himnos que
              formarán parte de la playlist.
            </p>
          </div>

          <span
            data-admin-official-playlist-available-count
          >
            ${hymns.length}
            ${
              hymns.length === 1
                ? 'himno'
                : 'himnos'
            }
          </span>
        </header>

        <label
          class="admin-playlist-hymn-selector__search"
          for="adminOfficialPlaylistHymnSearch"
        >
          <span>
            Buscar himnos
          </span>

          <input
            id="adminOfficialPlaylistHymnSearch"
            type="search"
            autocomplete="off"
            placeholder="Buscar por título, categoría, tema o referencia..."
            value="${escapeHtml(
              query
            )}"
            data-admin-official-playlist-hymn-search
          >
        </label>

        <div
          class="admin-playlist-hymn-selector__available-list"
          data-admin-official-playlist-hymn-list
        >
          ${renderAvailableList({
            hymns:
              filteredHymns,
            selectedIds:
              normalizedSelectedIds
          })}
        </div>
      </div>

      <aside
        class="admin-playlist-hymn-selector__selected"
      >
        <header
          class="admin-playlist-hymn-selector__header"
        >
          <div>
            <h3>
              Himnos seleccionados
            </h3>

            <p>
              El orden de esta lista será el
              orden público de reproducción.
            </p>
          </div>

          <strong
            data-admin-official-playlist-selected-count
          >
            ${normalizedSelectedIds.length}
          </strong>
        </header>

        <div
          class="admin-playlist-hymn-selector__selected-list"
          data-admin-official-playlist-selected-list
        >
          ${renderSelectedList({
            hymns,
            selectedIds:
              normalizedSelectedIds
          })}
        </div>
      </aside>
    </section>
  `;
}

export {
  normalizeSelectedIds,
  getHymnSearchText,
  filterHymns,
  renderAvailableHymn,
  renderSelectedHymn
};

export default
  renderOfficialPlaylistHymnSelector;
