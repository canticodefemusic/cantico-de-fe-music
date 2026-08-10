/**
 * Cántico de Fe Music
 * V13.14.9 — Media Selection Action Bar
 *
 * Funciones:
 * - Mostrar cantidad seleccionada
 * - Copiar enlaces
 * - Descargar seleccionados
 * - Eliminar seleccionados
 * - Limpiar selección
 * - Compatible con estado busy
 */

function formatSelectedCount(
  count = 0
) {
  const safeCount =
    Math.max(
      0,
      Number(count) || 0
    );

  return `${safeCount} archivo${
    safeCount === 1
      ? ''
      : 's'
  } seleccionado${
    safeCount === 1
      ? ''
      : 's'
  }`;
}

export function renderMediaSelectionBar({
  selectedCount = 0,
  bulkBusy = false
} = {}) {
  const count =
    Math.max(
      0,
      Number(
        selectedCount
      ) || 0
    );

  if (!count) {
    return '';
  }

  const disabled =
    bulkBusy
      ? 'disabled'
      : '';

  return `
    <div
      class="
        media-selection-bar
        ${
          bulkBusy
            ? 'is-busy'
            : ''
        }
      "
      data-media-selection-bar
      role="region"
      aria-label="Acciones de selección múltiple"
    >

      <div
        class="media-selection-bar__summary"
      >
        <span
          class="media-selection-bar__check"
          aria-hidden="true"
        >
          ✓
        </span>

        <strong
          class="media-selection-bar__count"
        >
          ${formatSelectedCount(
            count
          )}
        </strong>
      </div>

      <div
        class="media-selection-bar__actions"
      >

        <button
          type="button"
          class="
            media-selection-bar__button
            media-selection-bar__button--copy
          "
          data-media-bulk-copy
          ${disabled}
        >
          Copiar enlaces
        </button>

        <button
          type="button"
          class="
            media-selection-bar__button
            media-selection-bar__button--download
          "
          data-media-bulk-download
          ${disabled}
        >
          Descargar
        </button>

        <button
          type="button"
          class="
            media-selection-bar__button
            media-selection-bar__button--danger
          "
          data-media-bulk-delete
          ${disabled}
        >
          Eliminar
        </button>

        <button
          type="button"
          class="
            media-selection-bar__button
            media-selection-bar__button--clear
          "
          data-media-selection-clear
          ${disabled}
        >
          Limpiar selección
        </button>

      </div>

    </div>
  `;
}

export default
  renderMediaSelectionBar;
