/**
 * Cántico de Fe Music
 * V12.4.1 — Admin Export Controller
 */

import AdminHymnExportService
  from '../services/AdminHymnExportService.js';

import {
  ModalService
} from '../../modal-engine/index.js';

import {
  ToastService
} from '../../toast-engine/index.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderValidationErrors(
  errors = []
) {
  if (
    !Array.isArray(errors) ||
    !errors.length
  ) {
    return `
      <p>
        No se encontraron detalles
        adicionales sobre el error.
      </p>
    `;
  }

  return `
    <div
      class="admin-export-errors"
    >
      <p>
        Corrige los siguientes problemas
        antes de exportar:
      </p>

      <ul>
        ${errors
          .map(error => `
            <li>
              ${escapeHtml(error)}
            </li>
          `)
          .join('')}
      </ul>
    </div>
  `;
}

async function showExportErrors(
  errors = []
) {
  ModalService.open({
    title:
      'No se puede exportar',

    message:
      renderValidationErrors(
        errors
      ),

    actions: `
      <button
        type="button"
        data-admin-export-errors-close
      >
        Cerrar
      </button>
    `
  });

  const closeButton =
    document.querySelector(
      '[data-admin-export-errors-close]'
    );

  if (!closeButton) {
    return;
  }

  closeButton.addEventListener(
    'click',
    () => {
      ModalService.close();
    },
    {
      once: true
    }
  );
}

function exportHymnCatalog() {
  const result =
    AdminHymnExportService
      .exportCatalog();

  if (!result.success) {
    ToastService.error(
      result.message,
      {
        title:
          'Exportación detenida'
      }
    );

    showExportErrors(
      result.errors
    );

    return result;
  }

  ToastService.success(
    result.message,
    {
      title:
        'Catálogo exportado'
    }
  );

  return result;
}

function exportHymnBackup() {
  const result =
    AdminHymnExportService
      .exportJsonBackup();

  if (!result.success) {
    ToastService.error(
      result.message,
      {
        title:
          'No se pudo descargar'
      }
    );

    return result;
  }

  ToastService.success(
    result.message,
    {
      title:
        'Respaldo descargado'
    }
  );

  return result;
}

const AdminExportController = {
  exportHymnCatalog,

  exportHymnBackup,

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
        [
          '[data-admin-hymn-export]',
          '[data-admin-hymn-backup]'
        ].join(', ')
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

    const catalogButton =
      target.closest(
        '[data-admin-hymn-export]'
      );

    if (catalogButton) {
      event.preventDefault();

      exportHymnCatalog();

      return true;
    }

    const backupButton =
      target.closest(
        '[data-admin-hymn-backup]'
      );

    if (backupButton) {
      event.preventDefault();

      exportHymnBackup();

      return true;
    }

    return false;
  }
};

export {
  exportHymnCatalog,
  exportHymnBackup
};

export default AdminExportController;
