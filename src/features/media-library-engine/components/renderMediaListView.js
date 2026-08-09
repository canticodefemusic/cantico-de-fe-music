/**
 * Cántico de Fe Music
 * V13.8.3 — Media List View
 *
 * Funciones:
 * - Vista compacta tipo tabla
 * - Usa renderR2MediaListRow()
 * - Mantiene selección múltiple
 * - Mantiene menú de acciones
 * - Mantiene Lightbox
 * - Mantiene copiar / descargar / eliminar
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
/* Encabezado                                                         */
/* ------------------------------------------------------------------ */

function renderListHeader() {
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

      <div
        class="
          media-list-view__heading
          media-list-view__heading--name
        "
        role="columnheader"
      >
        Nombre
      </div>

      <div
        class="
          media-list-view__heading
          media-list-view__heading--type
        "
        role="columnheader"
      >
        Tipo
      </div>

      <div
        class="
          media-list-view__heading
          media-list-view__heading--size
        "
        role="columnheader"
      >
        Tamaño
      </div>

      <div
        class="
          media-list-view__heading
          media-list-view__heading--date
        "
        role="columnheader"
      >
        Fecha
      </div>

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
  selectedKeys = []
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

      ${renderListHeader()}

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
