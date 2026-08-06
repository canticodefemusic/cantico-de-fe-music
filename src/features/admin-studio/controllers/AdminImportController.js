/**
 * Cántico de Fe Music
 * V12.5.1 — Admin Import Controller
 */

import AdminHymnImportService
  from '../services/AdminHymnImportService.js';

import AdminState
  from '../services/AdminState.js';

import {
  ModalService
} from '../../modal-engine/index.js';

import {
  ToastService
} from '../../toast-engine/index.js';

const FILE_INPUT_ID =
  'adminHymnImportFile';

let pendingInspection = null;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getOrCreateFileInput() {
  let input =
    document.getElementById(
      FILE_INPUT_ID
    );

  if (input) {
    return input;
  }

  input =
    document.createElement(
      'input'
    );

  input.id =
    FILE_INPUT_ID;

  input.type =
    'file';

  input.accept =
    '.json,application/json,text/json,text/plain';

  input.hidden = true;

  input.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.appendChild(
    input
  );

  return input;
}

function removeFileInput() {
  const input =
    document.getElementById(
      FILE_INPUT_ID
    );

  if (!input) {
    return;
  }

  input.remove();
}

function renderList(
  items = [],
  emptyMessage = ''
) {
  if (
    !Array.isArray(items) ||
    !items.length
  ) {
    return emptyMessage
      ? `
          <p>
            ${escapeHtml(
              emptyMessage
            )}
          </p>
        `
      : '';
  }

  return `
    <ul>
      ${items
        .map(item => `
          <li>
            ${escapeHtml(item)}
          </li>
        `)
        .join('')}
    </ul>
  `;
}

function renderInspectionSummary(
  inspection
) {
  const validation =
    inspection.validation || {};

  const comparison =
    inspection.comparison || {
      added: [],
      updated: [],
      unchanged: [],
      total: 0
    };

  return `
    <section
      class="admin-import-summary"
    >
      <p>
        Archivo:
        <strong>
          ${escapeHtml(
            inspection.fileName ||
            'Sin nombre'
          )}
        </strong>
      </p>

      <div
        class="admin-import-summary__stats"
      >
        <article>
          <span>
            Total
          </span>

          <strong>
            ${comparison.total || 0}
          </strong>
        </article>

        <article>
          <span>
            Nuevos
          </span>

          <strong>
            ${comparison.added?.length || 0}
          </strong>
        </article>

        <article>
          <span>
            Actualizados
          </span>

          <strong>
            ${comparison.updated?.length || 0}
          </strong>
        </article>

        <article>
          <span>
            Sin cambios
          </span>

          <strong>
            ${comparison.unchanged?.length || 0}
          </strong>
        </article>
      </div>

      ${
        validation.warnings?.length
          ? `
              <div
                class="admin-import-summary__warnings"
              >
                <h3>
                  Advertencias
                </h3>

                ${renderList(
                  validation.warnings
                )}
              </div>
            `
          : ''
      }

      <div
        class="admin-import-summary__mode"
      >
        <p>
          Selecciona cómo deseas importar
          los himnos:
        </p>

        <label>
          <input
            type="radio"
            name="adminImportMode"
            value="merge"
            checked
          >

          <span>
            <strong>
              Combinar
            </strong>

            Conserva los borradores actuales
            y agrega o actualiza los del archivo.
          </span>
        </label>

        <label>
          <input
            type="radio"
            name="adminImportMode"
            value="replace"
          >

          <span>
            <strong>
              Reemplazar
            </strong>

            Elimina los borradores actuales
            y utiliza únicamente los del archivo.
          </span>
        </label>
      </div>
    </section>
  `;
}

function renderInspectionErrors(
  inspection
) {
  const errors =
    inspection.validation?.errors ||
    [];

  return `
    <section
      class="admin-import-errors"
    >
      <p>
        No se puede importar este archivo.
      </p>

      ${renderList(
        errors,
        'No se encontraron detalles adicionales.'
      )}
    </section>
  `;
}

function getSelectedImportMode() {
  return (
    document.querySelector(
      'input[name="adminImportMode"]:checked'
    )?.value ||
    'merge'
  );
}

function dispatchImportComplete(
  detail = {}
) {
  window.dispatchEvent(
    new CustomEvent(
      'cantico:admin-hymns-imported',
      {
        detail
      }
    )
  );
}

function resetPendingInspection() {
  pendingInspection = null;
  removeFileInput();
}

function showInspectionError(
  inspection
) {
  ModalService.open({
    title:
      'Archivo no válido',

    message:
      renderInspectionErrors(
        inspection
      ),

    actions: `
      <button
        type="button"
        data-admin-import-close
      >
        Cerrar
      </button>
    `
  });

  document
    .querySelector(
      '[data-admin-import-close]'
    )
    ?.addEventListener(
      'click',
      () => {
        ModalService.close();
        resetPendingInspection();
      },
      {
        once: true
      }
    );

  ToastService.error(
    inspection.message ||
    'No se pudo validar el archivo.',
    {
      title:
        'Importación detenida'
    }
  );
}

function completeImport({
  mode
}) {
  if (!pendingInspection) {
    ToastService.error(
      'No hay ningún archivo preparado para importar.',
      {
        title:
          'Importación no disponible'
      }
    );

    return;
  }

  const result =
    AdminHymnImportService
      .importHymns(
        pendingInspection.hymns,
        {
          mode
        }
      );

  if (!result.success) {
    ToastService.error(
      result.message,
      {
        title:
          'No se pudo importar'
      }
    );

    return;
  }

  AdminState.setSelectedItem(
    null
  );

  AdminState.setDirty(false);

  ModalService.close();

  dispatchImportComplete({
    mode,
    imported:
      result.imported,
    fileName:
      pendingInspection.fileName
  });

  ToastService.success(
    result.message,
    {
      title:
        'Importación completada'
    }
  );

  resetPendingInspection();
}

function showInspectionSummary(
  inspection
) {
  pendingInspection =
    inspection;

  ModalService.open({
    title:
      'Importar himnos',

    message:
      renderInspectionSummary(
        inspection
      ),

    actions: `
      <button
        type="button"
        data-admin-import-cancel
      >
        Cancelar
      </button>

      <button
        type="button"
        data-admin-import-confirm
      >
        Importar himnos
      </button>
    `
  });

  document
    .querySelector(
      '[data-admin-import-cancel]'
    )
    ?.addEventListener(
      'click',
      () => {
        ModalService.close();
        resetPendingInspection();
      },
      {
        once: true
      }
    );

  document
    .querySelector(
      '[data-admin-import-confirm]'
    )
    ?.addEventListener(
      'click',
      () => {
        completeImport({
          mode:
            getSelectedImportMode()
        });
      },
      {
        once: true
      }
    );
}

async function inspectSelectedFile(
  file
) {
  ToastService.info(
    'Validando el archivo seleccionado...',
    {
      title:
        'Importación de himnos'
    }
  );

  const inspection =
    await AdminHymnImportService
      .inspectFile(file);

  if (!inspection.success) {
    showInspectionError(
      inspection
    );

    return;
  }

  showInspectionSummary(
    inspection
  );
}

function openFileSelector() {
  resetPendingInspection();

  const input =
    getOrCreateFileInput();

  input.addEventListener(
    'change',
    async () => {
      const file =
        input.files?.[0];

      if (!file) {
        resetPendingInspection();
        return;
      }

      await inspectSelectedFile(
        file
      );
    },
    {
      once: true
    }
  );

  input.click();
}

const AdminImportController = {
  openFileSelector,

  canHandle(target) {
    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    return Boolean(
      target.closest(
        '[data-admin-hymn-import]'
      )
    );
  },

  handleClick(event) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    const importButton =
      target.closest(
        '[data-admin-hymn-import]'
      );

    if (!importButton) {
      return false;
    }

    event.preventDefault();

    openFileSelector();

    return true;
  }
};

export {
  openFileSelector,
  inspectSelectedFile
};

export default AdminImportController;
