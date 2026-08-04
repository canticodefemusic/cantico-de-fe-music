/**
 * Cántico de Fe Music
 * V12.3 — Admin Studio Initializer
 */

import AdminExportController
  from './controllers/AdminExportController.js';

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
let keyboardShortcutsInitialized = false;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

function getHymnEditorForm() {
  return document.querySelector(
    '[data-admin-hymn-editor-form]'
  );
}

function getSelectedHymnId() {
  return AdminState
    .getState()
    .selectedItem;
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

      if (active) {
        button.setAttribute(
          'aria-current',
          'page'
        );
      } else {
        button.removeAttribute(
          'aria-current'
        );
      }
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

function focusFirstEditorField() {
  window.setTimeout(() => {
    document
      .querySelector(
        '[data-admin-hymn-editor-form] input[name="title"]'
      )
      ?.focus();
  }, 0);
}

function renderSection(
  section,
  {
    preserveSearchFocus = false,
    focusEditor = false
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

  if (
    focusEditor &&
    targetSection === 'hymns'
  ) {
    focusFirstEditorField();
  }
}

function openHymnEditor(
  hymnId,
  {
    focusEditor = true
  } = {}
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

  AdminState.setSelectedItem(
    hymn.id
  );

  AdminState.setDirty(false);

  renderSection(
    'hymns',
    {
      focusEditor
    }
  );
}

function returnToHymnManager() {
  AdminState.setSelectedItem(
    null
  );

  AdminState.setDirty(false);

  renderSection('hymns');
}

async function confirmDiscardChanges() {
  const state =
    AdminState.getState();

  if (!state.dirty) {
    return true;
  }

  return ModalService.confirm({
    title: 'Cambios sin guardar',
    message:
      'Hay cambios sin guardar. ¿Deseas salir del editor y descartarlos?',
    confirmText:
      'Descartar cambios',
    cancelText:
      'Continuar editando',
    destructive: true
  });
}

async function returnFromEditor() {
  const confirmed =
    await confirmDiscardChanges();

  if (!confirmed) {
    return;
  }

  returnToHymnManager();
}

function getFormText(
  formData,
  fieldName
) {
  return String(
    formData.get(fieldName) ||
    ''
  ).trim();
}

function getHymnFormValues(form) {
  const formData =
    new FormData(form);

  const audio =
    getFormText(
      formData,
      'audio'
    );

  return {
    title:
      getFormText(
        formData,
        'title'
      ),

    subtitle:
      getFormText(
        formData,
        'subtitle'
      ),

    category:
      getFormText(
        formData,
        'category'
      ),

    theme:
      getFormText(
        formData,
        'theme'
      ),

    artist:
      getFormText(
        formData,
        'artist'
      ),

    scriptures:
      getFormText(
        formData,
        'scriptures'
      ),

    description:
      getFormText(
        formData,
        'description'
      ),

    lyrics:
      String(
        formData.get('lyrics') ||
        ''
      ).replace(
        /\r\n/g,
        '\n'
      ),

    tags:
      getFormText(
        formData,
        'tags'
      ),

    audio,

    src: audio,

    cover:
      getFormText(
        formData,
        'cover'
      ),

    duration:
      getFormText(
        formData,
        'duration'
      ),

    copyright: {
      holder:
        getFormText(
          formData,
          'copyrightHolder'
        ),

      license:
        getFormText(
          formData,
          'copyrightLicense'
        )
    }
  };
}

function validateHymnValues(
  values
) {
  if (!values.title) {
    return {
      valid: false,
      field: 'title',
      message:
        'El título del himno es obligatorio.'
    };
  }

  return {
    valid: true,
    field: null,
    message: ''
  };
}

function focusInvalidField(
  form,
  fieldName
) {
  if (!fieldName) {
    return;
  }

  form
    .querySelector(
      `[name="${fieldName}"]`
    )
    ?.focus();
}

function saveHymnEditor({
  returnToList = false
} = {}) {
  const form =
    getHymnEditorForm();

  const hymnId =
    getSelectedHymnId();

  if (!form || !hymnId) {
    ToastService.error(
      'No se pudo encontrar el formulario del himno.',
      {
        title:
          'No se pudo guardar'
      }
    );

    return false;
  }

  const values =
    getHymnFormValues(
      form
    );

  const validation =
    validateHymnValues(
      values
    );

  if (!validation.valid) {
    focusInvalidField(
      form,
      validation.field
    );

    ToastService.warning(
      validation.message,
      {
        title:
          'Revisa el formulario'
      }
    );

    return false;
  }

  AdminState.setSaving(true);

  const result =
    AdminHymnService.updateDraft(
      hymnId,
      values
    );

  if (!result.success) {
    AdminState.setSaving(false);

    ToastService.error(
      result.message,
      {
        title:
          'No se pudo guardar'
      }
    );

    updateToolbar();

    return false;
  }

  AdminState.setSelectedItem(
    result.hymn.id
  );

  AdminState.markSaved();

  ToastService.success(
    result.message,
    {
      title:
        'Borrador guardado'
    }
  );

  if (returnToList) {
    returnToHymnManager();
  } else {
    renderSection('hymns');
  }

  return true;
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

  ToastService.success(
    result.message,
    {
      title:
        'Borrador creado'
    }
  );

  openHymnEditor(
    result.hymn.id
  );
}

function duplicateHymn(
  hymnId,
  {
    openEditor = false
  } = {}
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

  ToastService.success(
    result.message,
    {
      title:
        'Himno duplicado'
    }
  );

  if (openEditor) {
    openHymnEditor(
      result.hymn.id
    );

    return;
  }

  AdminState.setSelectedItem(
    null
  );

  AdminState.setDirty(false);

  renderSection('hymns');
}

async function removeHymnDraft({
  hymnId,
  restorePublished = false,
  returnToList = true
}) {
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

  AdminState.setDirty(false);

  ToastService.success(
    result.message,
    {
      title:
        restorePublished
          ? 'Versión restaurada'
          : 'Borrador eliminado'
    }
  );

  if (returnToList) {
    renderSection('hymns');
  }
}

function renderPreviewLine(
  label,
  value
) {
  if (!value) {
    return '';
  }

  return `
    <p>
      <strong>
        ${escapeHtml(label)}:
      </strong>

      ${escapeHtml(value)}
    </p>
  `;
}

function renderLyricsPreview(
  lyrics = ''
) {
  const cleanLyrics =
    String(lyrics || '').trim();

  if (!cleanLyrics) {
    return `
      <p>
        La letra del himno todavía
        está vacía.
      </p>
    `;
  }

  return cleanLyrics
    .split('\n')
    .map(line =>
      line.trim()
        ? `
          <p>
            ${escapeHtml(line)}
          </p>
        `
        : '<br>'
    )
    .join('');
}

function previewHymnEditor() {
  const form =
    getHymnEditorForm();

  if (!form) {
    return;
  }

  const values =
    getHymnFormValues(
      form
    );

  ModalService.open({
    title:
      values.title ||
      'Vista previa del himno',

    message: `
      <section
        class="admin-hymn-preview"
      >
        ${
          values.subtitle
            ? `
              <p>
                <strong>
                  ${escapeHtml(
                    values.subtitle
                  )}
                </strong>
              </p>
            `
            : ''
        }

        ${renderPreviewLine(
          'Categoría',
          values.category
        )}

        ${renderPreviewLine(
          'Tema',
          values.theme
        )}

        ${renderPreviewLine(
          'Artista',
          values.artist
        )}

        ${renderPreviewLine(
          'Referencias bíblicas',
          values.scriptures
        )}

        ${
          values.description
            ? `
              <hr>

              <p>
                ${escapeHtml(
                  values.description
                )}
              </p>
            `
            : ''
        }

        <hr>

        <div
          class="admin-hymn-preview__lyrics"
        >
          ${renderLyricsPreview(
            values.lyrics
          )}
        </div>
      </section>
    `,

    actions: `
      <button
        type="button"
        data-modal-cancel
      >
        Cerrar
      </button>
    `
  });

  document
    .querySelector(
      '[data-modal-cancel]'
    )
    ?.addEventListener(
      'click',
      () => {
        ModalService.close();
      },
      {
        once: true
      }
    );
}

function handleNavigationButton(
  button
) {
  const section =
    button.dataset.adminOpen;

  if (!section) {
    return;
  }

  AdminState.setSelectedItem(
    null
  );

  AdminState.setDirty(false);

  renderSection(section);
}

function handleCreateButton(
  button
) {
  const section =
    button.dataset.adminCreate;

  if (section === 'hymns') {
    createHymnDraft();

    return;
  }

  ToastService.info(
    'Este módulo se habilitará en una próxima etapa.',
    {
      title:
        'Sección preparada'
    }
  );
}

async function handleAdminClick(event) {
  
  if (
    AdminExportController.handleClick(
      event
    )
  ) {
    return;
  }
  
  const editorBackButton =
    event.target.closest(
      '[data-admin-hymn-editor-back]'
    );

  if (editorBackButton) {
    await returnFromEditor();
    return;
  }

  const editorPreviewButton =
    event.target.closest(
      '[data-admin-hymn-editor-preview]'
    );

  if (editorPreviewButton) {
    previewHymnEditor();
    return;
  }

  const editorDuplicateButton =
    event.target.closest(
      '[data-admin-hymn-editor-duplicate]'
    );

  if (editorDuplicateButton) {
    const hymnId =
      getSelectedHymnId();

    if (hymnId) {
      duplicateHymn(
        hymnId,
        {
          openEditor: true
        }
      );
    }

    return;
  }

  const editorRemoveButton =
    event.target.closest(
      '[data-admin-hymn-editor-remove-draft]'
    );

  if (editorRemoveButton) {
    const hymnId =
      getSelectedHymnId();

    if (!hymnId) {
      return;
    }

    await removeHymnDraft({
      hymnId,

      restorePublished:
        editorRemoveButton
          .dataset
          .adminHymnEditorRestore ===
        'true'
    });

    return;
  }

  const navigationButton =
    event.target.closest(
      '[data-admin-open]'
    );

  if (navigationButton) {
    handleNavigationButton(
      navigationButton
    );

    return;
  }

  const createButton =
    event.target.closest(
      '[data-admin-create]'
    );

  if (createButton) {
    handleCreateButton(
      createButton
    );

    return;
  }

  const editButton =
    event.target.closest(
      '[data-admin-hymn-edit]'
    );

  if (editButton) {
    openHymnEditor(
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
    await removeHymnDraft({
      hymnId:
        removeDraftButton
          .dataset
          .adminHymnRemoveDraft,

      restorePublished:
        removeDraftButton
          .dataset
          .adminHymnRestore ===
        'true'
    });
  }
}

function handleAdminInput(event) {
  const editorForm =
    event.target.closest(
      '[data-admin-hymn-editor-form]'
    );

  if (editorForm) {
    AdminState.setDirty(true);
    updateToolbar();

    return;
  }

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

  if (statusSelect) {
    const currentState =
      AdminState.getState();

    AdminState.setFilters({
      ...currentState.filters,

      hymnStatus:
        statusSelect.value
    });

    renderSection('hymns');

    return;
  }

  const editorForm =
    event.target.closest(
      '[data-admin-hymn-editor-form]'
    );

  if (editorForm) {
    AdminState.setDirty(true);
    updateToolbar();
  }
}

function handleAdminSubmit(event) {
  const form =
    event.target.closest(
      '[data-admin-hymn-editor-form]'
    );

  if (!form) {
    return;
  }

  event.preventDefault();

  saveHymnEditor();
}

function handleKeyboardShortcut(event) {
  const usesSaveShortcut =
    (
      event.ctrlKey ||
      event.metaKey
    ) &&
    event.key.toLowerCase() === 's';

  if (!usesSaveShortcut) {
    return;
  }

  const form =
    getHymnEditorForm();

  if (!form) {
    return;
  }

  event.preventDefault();

  saveHymnEditor();
}

function bindKeyboardShortcuts() {
  if (keyboardShortcutsInitialized) {
    return;
  }

  document.addEventListener(
    'keydown',
    handleKeyboardShortcut
  );

  keyboardShortcutsInitialized = true;
}

function bindAdminEvents(root) {
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

  root.addEventListener(
    'submit',
    handleAdminSubmit
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
  bindKeyboardShortcuts();

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
