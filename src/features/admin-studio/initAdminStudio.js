/**
 * Cántico de Fe Music
 * V12.1 — Admin Studio Initializer
 */

import AdminRouter
  from './services/AdminRouter.js';

import AdminState
  from './services/AdminState.js';

import AdminHymnService
  from './services/AdminHymnService.js';

import renderAdminContent
  from './components/renderAdminContent.js';

import renderToolbar
  from './components/renderToolbar.js';

import {
  ModalService
} from '../modal-engine/index.js';

import {
  ToastService
} from '../toast-engine/index.js';

const SEARCH_DELAY = 180;

const initializedRoots =
  new WeakSet();

let searchTimeout = null;

function getAdminRoot() {
  return document.querySelector(
    '.admin-layout'
  );
}

function getContentContainer() {
  return document.querySelector(
    '[data-admin-content]'
  );
}

function updateActiveSidebar(section) {
  document
    .querySelectorAll(
      '.admin-sidebar__item'
    )
    .forEach(button => {
      const buttonSection =
        button.dataset.adminOpen ||
        button.dataset.adminSection ||
        '';

      const active =
        buttonSection === section;

      button.classList.toggle(
        'is-active',
        active
      );

      button.setAttribute(
        'aria-current',
        active
          ? 'page'
          : 'false'
      );
    });
}

function updateToolbar() {
  const currentToolbar =
    document.querySelector(
      '.admin-toolbar'
    );

  if (!currentToolbar) {
    return;
  }

  currentToolbar.outerHTML =
    renderToolbar();
}

function restoreSearchFocus(
  searchValue = ''
) {
  window.setTimeout(() => {
    const input =
      document.querySelector(
        '[data-admin-hymn-search]'
      );

    if (!input) {
      return;
    }

    input.focus();

    const cursorPosition =
      String(searchValue).length;

    input.setSelectionRange(
      cursorPosition,
      cursorPosition
    );
  }, 0);
}

function renderSection(
  section,
  {
    preserveSearchFocus = false
  } = {}
) {
  const container =
    getContentContainer();

  if (!container) {
    return;
  }

  const targetSection =
    String(
      section ||
      'dashboard'
    );

  if (
    AdminRouter.getCurrentSection() !==
    targetSection
  ) {
    AdminRouter.navigate(
      targetSection
    );
  }

  container.innerHTML =
    renderAdminContent(
      targetSection
    );

  updateActiveSidebar(
    targetSection
  );

  updateToolbar();

  if (
    preserveSearchFocus &&
    targetSection === 'hymns'
  ) {
    restoreSearchFocus(
      AdminState
        .getState()
        .search
    );
  }
}

async function createHymnDraft() {
  const title =
    await ModalService.prompt({
      title: 'Nuevo himno',
      message:
        'Escribe el título del nuevo himno.',
      placeholder:
        'Título del himno',
      confirmText:
        'Crear borrador',
      cancelText:
        'Cancelar',
      maxLength: 120
    });

  if (!title) {
    return;
  }

  const result =
    AdminHymnService.createDraft({
      title
    });

  if (!result.success) {
    ToastService.error(
      result.message,
      {
        title:
          'No se pudo crear'
      }
    );

    return;
  }

  AdminState.setSelectedItem(
    result.hymn.id
  );

  AdminState.setDirty(true);

  renderSection('hymns');

  ToastService.success(
    result.message,
    {
      title:
        'Borrador creado'
    }
  );
}

async function editHymnDraft(
  hymnId
) {
  const hymn =
    AdminHymnService.findById(
      hymnId
    );

  if (!hymn) {
    ToastService.error(
      'No se encontró el himno seleccionado.',
      {
        title: 'Error'
      }
    );

    return;
  }

  const newTitle =
    await ModalService.prompt({
      title: 'Editar himno',
      message:
        'Edita el título del himno. El editor completo se añadirá en la siguiente etapa.',
      value:
        hymn.title,
      placeholder:
        'Título del himno',
      confirmText:
        'Guardar cambios',
      cancelText:
        'Cancelar',
      maxLength: 120
    });

  if (!newTitle) {
    return;
  }

  const result =
    AdminHymnService.updateDraft(
      hymnId,
      {
        title: newTitle
      }
    );

  if (!result.success) {
    ToastService.error(
      result.message,
      {
        title:
          'No se pudo guardar'
      }
    );

    return;
  }

  AdminState.setSelectedItem(
    result.hymn.id
  );

  AdminState.setDirty(true);

  renderSection('hymns');

  ToastService.success(
    result.message,
    {
      title:
        'Himno actualizado'
    }
  );
}

function duplicateHymn(
  hymnId
) {
  const result =
    AdminHymnService.duplicate(
      hymnId
    );

  if (!result.success) {
    ToastService.error(
      result.message,
      {
        title:
          'No se pudo duplicar'
      }
    );

    return;
  }

  AdminState.setSelectedItem(
    result.hymn.id
  );

  AdminState.setDirty(true);

  renderSection('hymns');

  ToastService.success(
    result.message,
    {
      title:
        'Himno duplicado'
    }
  );
}

async function removeHymnDraft(
  button
) {
  const hymnId =
    button.dataset
      .adminHymnRemoveDraft;

  const restorePublished =
    button.dataset
      .adminHymnRestore ===
    'true';

  const hymn =
    AdminHymnService.findById(
      hymnId
    );

  if (!hymn) {
    ToastService.error(
      'No se encontró el himno seleccionado.',
      {
        title: 'Error'
      }
    );

    return;
  }

  const confirmed =
    await ModalService.confirm({
      title:
        restorePublished
          ? 'Restaurar versión publicada'
          : 'Eliminar borrador',

      message:
        restorePublished
          ? `¿Deseas descartar los cambios de "${hymn.title}" y restaurar la versión publicada?`
          : `¿Deseas eliminar el borrador "${hymn.title}"?`,

      confirmText:
        restorePublished
          ? 'Restaurar'
          : 'Eliminar',

      cancelText:
        'Cancelar',

      destructive:
        !restorePublished
    });

  if (!confirmed) {
    return;
  }

  const result =
    restorePublished
      ? AdminHymnService
          .restorePublished(
            hymnId
          )
      : AdminHymnService
          .removeDraft(
            hymnId
          );

  if (!result.success) {
    ToastService.error(
      result.message,
      {
        title:
          'No se pudo completar'
      }
    );

    return;
  }

  AdminState.setSelectedItem(
    null
  );

  AdminState.setDirty(true);

  renderSection('hymns');

  ToastService.success(
    result.message,
    {
      title:
        restorePublished
          ? 'Versión restaurada'
          : 'Borrador eliminado'
    }
  );
}

function handleAdminClick(event) {
  const navigationButton =
    event.target.closest(
      '[data-admin-open]'
    );

  if (navigationButton) {
    const section =
      navigationButton.dataset
        .adminOpen;

    if (section) {
      renderSection(section);
    }

    return;
  }

  const createButton =
    event.target.closest(
      '[data-admin-create]'
    );

  if (createButton) {
    const section =
      createButton.dataset
        .adminCreate;

    if (section === 'hymns') {
      createHymnDraft();
    } else {
      ToastService.info(
        'Este módulo se habilitará en una próxima etapa.',
        {
          title:
            'Sección preparada'
        }
      );
    }

    return;
  }

  const editButton =
    event.target.closest(
      '[data-admin-hymn-edit]'
    );

  if (editButton) {
    editHymnDraft(
      editButton.dataset
        .adminHymnEdit
    );

    return;
  }

  const duplicateButton =
    event.target.closest(
      '[data-admin-hymn-duplicate]'
    );

  if (duplicateButton) {
    duplicateHymn(
      duplicateButton.dataset
        .adminHymnDuplicate
    );

    return;
  }

  const removeDraftButton =
    event.target.closest(
      '[data-admin-hymn-remove-draft]'
    );

  if (removeDraftButton) {
    removeHymnDraft(
      removeDraftButton
    );
  }
}

function handleAdminInput(event) {
  const searchInput =
    event.target.closest(
      '[data-admin-hymn-search]'
    );

  if (!searchInput) {
    return;
  }

  const query =
    searchInput.value;

  AdminState.setSearch(
    query
  );

  window.clearTimeout(
    searchTimeout
  );

  searchTimeout =
    window.setTimeout(() => {
      renderSection(
        'hymns',
        {
          preserveSearchFocus:
            true
        }
      );
    }, SEARCH_DELAY);
}

function handleAdminChange(event) {
  const statusSelect =
    event.target.closest(
      '[data-admin-hymn-status]'
    );

  if (!statusSelect) {
    return;
  }

  const currentState =
    AdminState.getState();

  AdminState.setFilters({
    ...currentState.filters,
    hymnStatus:
      statusSelect.value
  });

  renderSection('hymns');
}

function bindAdminEvents(
  root
) {
  if (
    initializedRoots.has(root)
  ) {
    return;
  }

  root.addEventListener(
    'click',
    handleAdminClick
  );

  root.addEventListener(
    'input',
    handleAdminInput
  );

  root.addEventListener(
    'change',
    handleAdminChange
  );

  initializedRoots.add(root);
}

export function initAdminStudio() {
  const root =
    getAdminRoot();

  if (!root) {
    return;
  }

  bindAdminEvents(root);

  const currentSection =
    AdminState
      .getState()
      .section ||
    'dashboard';

  updateActiveSidebar(
    currentSection
  );

  updateToolbar();
}

export default initAdminStudio;
