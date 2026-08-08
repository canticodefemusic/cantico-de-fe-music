/**
 * Cántico de Fe Music
 * V13.6.3 — Media Library
 * Search + Filters + Sorting + Selection Toolbar
 */

import {
  renderR2MediaItem
} from './renderR2MediaItem.js';

/* ------------------------------------------------------------------ */
/* Utilidades                                                         */
/* ------------------------------------------------------------------ */

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

/* ------------------------------------------------------------------ */
/* Toolbar selección                                                  */
/* ------------------------------------------------------------------ */

function renderSelectionToolbar({
  selectedCount = 0
} = {}) {

  if (!selectedCount) {
    return '';
  }

  return `
    <section
      class="media-selection-toolbar"
      data-media-selection-toolbar
    >

      <strong>
        ${selectedCount}
        archivo${
          selectedCount === 1
            ? ''
            : 's'
        } seleccionado${
          selectedCount === 1
            ? ''
            : 's'
        }
      </strong>

      <div
        class="
          media-selection-toolbar__actions
        "
      >

        <button
          type="button"
          data-media-select-all
        >
          Seleccionar todos
        </button>

        <button
          type="button"
          data-media-selection-clear
        >
          Limpiar selección
        </button>

      </div>

    </section>
  `;
}
