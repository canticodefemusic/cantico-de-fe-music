/**
 * Cántico de Fe Music
 * V13.8.5 — Professional Media List View
 *
 * Funciones:
 * - Vista compacta tipo tabla
 * - Usa renderR2MediaListRow()
 * - Selección múltiple
 * - Encabezados ordenables
 * - Indicador de orden activo
 * - Compatible con menú, Lightbox y acciones existentes
 */

import {
  renderR2MediaListRow
} from './renderR2MediaListRow.js';

/* ------------------------------------------------------------------ */
/* Utilidades                                                         */
/* ------------------------------------------------------------------ */

function normalizeSelectedKeys(
  selectedKeys = []
) {
  if (
    selectedKeys instanceof Set
  ) {
    return selectedKeys;
  }

  if (
    Array.isArray(
      selectedKeys
    )
  ) {
    return new Set(
      selectedKeys
    );
  }

  return new Set();
}

/* ------------------------------------------------------------------ */
/* Ordenamiento                                                       */
/* ------------------------------------------------------------------ */

function getSortIndicator({
  column,
  sortMode
}) {
  if (
    column === 'name' &&
    sortMode === 'name'
  ) {
    return '▲';
  }

  if (
    column === 'type' &&
    sortMode === 'type'
  ) {
    return '▲';
  }

  if (
    column === 'size' &&
    sortMode === 'size'
  ) {
    return '▼';
  }

  if (
    column === 'date' &&
    sortMode === 'newest'
  ) {
    return '▼';
  }

  if (
    column === 'date' &&
    sortMode === 'oldest'
  ) {
    return '▲';
  }

  return '';
}

function renderSortableHeading({
  column,
  label,
  sortMode,
  className = ''
}) {
  const indicator =
    getSortIndicator({
      column,
      sortMode
    });

  const active =
    Boolean(
      indicator
    );

  return `
    <div
      class="
        media-list-view__heading
        ${className}
      "
      role="columnheader"
    >
      <button
        type="button"
        class="
          media-list-view__sort-button
          ${
            active
              ? 'is-active'
              : ''
          }
        "
        data-media-list-sort="${column}"
        aria-label="Ordenar por ${label}"
        aria-pressed="${
          active
            ? 'true'
            : 'false'
        }"
      >
        <span>
          ${label}
        </span>

        <span
          class="media-list-view__sort-indicator"
          aria-hidden="true"
        >
          ${indicator}
        </span>
      </button>
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Encabezado                                                         */
/* ------------------------------------------------------------------ */

function renderListHeader({
  sortMode = 'newest'
} = {}) {
  return `
    <div
      class="media-list-view__header"
      role="row"
    >

      <div
        class="
          media-list-view__heading
          media-list-view__heading--select
        "
        role="columnheader"
      >
      </div>

      ${renderSortableHeading({
        column:
          'name',

        label:
          'Nombre',

        sortMode,

        className:
          'media-list-view__heading--name'
      })}

      ${renderSortableHeading({
        column:
          'type',

        label:
          'Tipo',

        sortMode,

        className:
          'media-list-view__heading--type'
      })}

      ${renderSortableHeading({
        column:
          'size',

        label:
          'Tamaño',

        sortMode,

        className:
          'media-list-view__heading--size'
      })}

      ${renderSortableHeading({
        column:
          'date',

        label:
          'Fecha',

        sortMode,

        className:
          'media-list-view__heading--date'
      })}

      <div
        class="
          media-list-view__heading
          media-list-view__heading--actions
        "
        role="columnheader"
      >
        Acciones
      </div>

    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Estado vacío                                                       */
/* ------------------------------------------------------------------ */

function renderEmptyList() {
  return `
    <div
      class="media-list-view__empty"
    >
      <p>
        No hay archivos para mostrar.
      </p>
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Render principal                                                   */
/* ------------------------------------------------------------------ */

export function renderMediaListView({
  objects = [],
  selectedKeys = [],
  sortMode = 'newest'
} = {}) {

  const safeObjects =
    Array.isArray(
      objects
    )
      ? objects
      : [];

  const safeSelectedKeys =
    normalizeSelectedKeys(
      selectedKeys
    );

  if (
    !safeObjects.length
  ) {
    return renderEmptyList();
  }

  return `
    <div
      class="media-list-view"
      data-media-list-view
      role="table"
      aria-label="Lista de archivos multimedia"
    >

      ${renderListHeader({
        sortMode
      })}

      <div
        class="media-list-view__body"
        role="rowgroup"
      >
        ${safeObjects
          .map(
            object =>
              renderR2MediaListRow(
                object,
                {
                  selected:
                    safeSelectedKeys.has(
                      object?.key
                    )
                }
              )
          )
          .join('')}
      </div>

    </div>
  `;
}

export default
  renderMediaListView;
