/**
 * Cántico de Fe Music
 * V13.8.1 — Media List View
 *
 * Vista compacta de archivos multimedia.
 *
 * Funciones:
 * - Reutiliza renderR2MediaItem()
 * - Mantiene selección múltiple
 * - Mantiene menú de acciones
 * - Mantiene Lightbox
 * - Mantiene copiar / descargar / eliminar
 * - Encabezados de lista
 * - Estado vacío seguro
 */

import {
  renderR2MediaItem
} from './renderR2MediaItem.js';

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
      aria-hidden="true"
    >

      <div
        class="
          media-list-view__heading
          media-list-view__heading--select
        "
      >
      </div>

      <div
        class="
          media-list-view__heading
          media-list-view__heading--name
        "
      >
        Nombre
      </div>

      <div
        class="
          media-list-view__heading
          media-list-view__heading--type
        "
      >
        Tipo
      </div>

      <div
        class="
          media-list-view__heading
          media-list-view__heading--size
        "
      >
        Tamaño
      </div>

      <div
        class="
          media-list-view__heading
          media-list-view__heading--date
        "
      >
        Fecha
      </div>

      <div
        class="
          media-list-view__heading
          media-list-view__heading--actions
        "
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
    >

      ${renderListHeader()}

      <div
        class="media-list-view__body"
        role="rowgroup"
      >
        ${safeObjects
          .map(
            object =>
              renderR2MediaItem(
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
