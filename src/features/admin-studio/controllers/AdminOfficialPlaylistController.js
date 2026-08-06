/**
 * Cántico de Fe Music
 * V12.6.10 — Admin Official Playlist Controller
 */

import AdminState
  from '../services/AdminState.js';

import AdminOfficialPlaylistService
  from '../services/AdminOfficialPlaylistService.js';

import AdminOfficialPlaylistHymnSelectorController
  from './AdminOfficialPlaylistHymnSelectorController.js';

import {
  ModalService
} from '../../modal-engine/index.js';

import {
  ToastService
} from '../../toast-engine/index.js';

const SECTION =
  'officialPlaylists';

const NEW_ITEM_ID =
  '__new__';

const FORM_SELECTOR =
  '[data-admin-official-playlist-editor-form]';

function normalizeText(value = '') {
  return String(
    value ?? ''
  ).trim();
}

function createSlug(value = '') {
  return normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(/ñ/g, 'n')
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    );
}

function getForm() {
  return document.querySelector(
    FORM_SELECTOR
  );
}

function getSelectedPlaylistId() {
  return AdminState
    .getState()
    .selectedItem;
}

function getFormText(
  formData,
  fieldName
) {
  return normalizeText(
    formData.get(
      fieldName
    )
  );
}

function getFormValues(form) {
  const formData =
    new FormData(form);

  const title =
    getFormText(
      formData,
      'title'
    );

  const typedId =
    getFormText(
      formData,
      'id'
    );

  const parsedOrder =
    Number.parseInt(
      getFormText(
        formData,
        'order'
      ),
      10
    );

  return {
    id:
      createSlug(
        typedId ||
        title
      ),

    title,

    description:
      getFormText(
        formData,
        'description'
      ),

    cover:
      getFormText(
        formData,
        'cover'
      ) ||
      '/assets/images/default-social-cover.png',

    order:
      Number.isNaN(
        parsedOrder
      )
        ? 0
        : Math.max(
            0,
            parsedOrder
          ),

    featured:
      formData.get(
        'featured'
      ) === 'true',

    originalId:
      getFormText(
        formData,
        'originalId'
     ),

hymnIds:
  AdminOfficialPlaylistHymnSelectorController
    .getSelectedIds(
      form
    )
  };
}

function validateValues(values) {
  if (!values.title) {
    return {
      valid: false,
      field: 'title',
      message:
        'El título de la playlist es obligatorio.'
    };
  }

  if (!values.id) {
    return {
      valid: false,
      field: 'id',
      message:
        'No se pudo generar un ID válido para la playlist.'
    };
  }

  if (
    values.id.length >
    120
  ) {
    return {
      valid: false,
      field: 'id',
      message:
        'El ID de la playlist es demasiado largo.'
    };
  }

  return {
    valid: true,
    field: null,
    message: ''
  };
}

function focusField(
  form,
  fieldName
) {
  if (
    !form ||
    !fieldName
  ) {
    return;
  }

  form
    .querySelector(
      `[name="${fieldName}"]`
    )
    ?.focus();
}

function dispatchRefresh(
  detail = {}
) {
  window.dispatchEvent(
    new CustomEvent(
      'cantico:admin-official-playlists-refresh',
      {
        detail
      }
    )
  );
}

function returnToManager() {
  AdminState.setSelectedItem(
    null
  );

  AdminState.setDirty(false);

  dispatchRefresh({
    section: SECTION,
    action: 'return'
  });
}

async function confirmDiscardChanges() {
  const state =
    AdminState.getState();

  if (!state.dirty) {
    return true;
  }

  return ModalService.confirm({
    title:
      'Cambios sin guardar',

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
    return false;
  }

  returnToManager();

  return true;
}

function updateSlugFromTitle(
  titleInput
) {
  const form =
    titleInput.closest(
      FORM_SELECTOR
    );

  const idInput =
    form?.querySelector(
      '[data-admin-official-playlist-id]'
    );

  if (
    !idInput ||
    idInput.dataset
      .adminSlugEdited ===
      'true'
  ) {
    return;
  }

  idInput.value =
    createSlug(
      titleInput.value
    );
}

function normalizeSlugInput(
  idInput
) {
  idInput.dataset
    .adminSlugEdited =
      'true';

  idInput.value =
    createSlug(
      idInput.value
    );
}

function savePlaylist({
  returnToList = false
} = {}) {
  const form =
    getForm();

  const selectedId =
    getSelectedPlaylistId();

  if (!form) {
    ToastService.error(
      'No se pudo encontrar el formulario de la playlist.',
      {
        title:
          'No se pudo guardar'
      }
    );

    return false;
  }

  const values =
    getFormValues(form);

  const validation =
    validateValues(values);

  if (!validation.valid) {
    focusField(
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

  const isNew =
    !selectedId ||
    selectedId ===
      NEW_ITEM_ID;

  if (
    isNew &&
    AdminOfficialPlaylistService
      .exists(values.id)
  ) {
    focusField(
      form,
      'id'
    );

    ToastService.warning(
      'Ya existe una playlist con ese ID.',
      {
        title:
          'ID duplicado'
      }
    );

    return false;
  }

  AdminState.setSaving(true);

  const result =
    isNew
      ? AdminOfficialPlaylistService
          .createDraft({
            id:
              values.id,

            title:
              values.title,

            description:
              values.description,

            cover:
              values.cover,

            hymnIds:
              values.hymnIds,

            featured:
              values.featured,

            order:
              values.order
          })
      : AdminOfficialPlaylistService
          .updateDraft(
            selectedId,
            {
              title:
                values.title,

              description:
                values.description,

              cover:
                values.cover,

              hymnIds:
                values.hymnIds,
              
              featured:
                values.featured,

              order:
                values.order
            }
          );

  if (!result.success) {
    AdminState.setSaving(false);

    ToastService.error(
      result.message ||
      'No se pudo guardar la playlist.',
      {
        title:
          'No se pudo guardar'
      }
    );

    return false;
  }

  const savedItem =
    result.item;

  if (!savedItem?.id) {
    AdminState.setSaving(false);

    ToastService.error(
      'La playlist se guardó sin un identificador válido.',
      {
        title:
          'Error de guardado'
      }
    );

    return false;
  }

  AdminState.setSelectedItem(
    savedItem.id
  );

  AdminState.markSaved();

  ToastService.success(
    result.message ||
    'La playlist fue guardada correctamente.',
    {
      title:
        isNew
          ? 'Playlist creada'
          : 'Borrador guardado'
    }
  );

  dispatchRefresh({
    section: SECTION,
    action:
      isNew
        ? 'create'
        : 'update',
    playlistId:
      savedItem.id,
    returnToList
  });

  return true;
}

async function removeCurrentDraft() {
  const selectedId =
    getSelectedPlaylistId();

  if (
    !selectedId ||
    selectedId ===
      NEW_ITEM_ID
  ) {
    returnToManager();
    return;
  }

  const playlist =
    AdminOfficialPlaylistService
      .findById(
        selectedId
      );

  if (!playlist) {
    ToastService.error(
      'No se encontró la playlist seleccionada.',
      {
        title: 'Error'
      }
    );

    return;
  }

  const isOverride =
    playlist.admin?.source ===
      'override';

  const confirmed =
    await ModalService.confirm({
      title:
        isOverride
          ? 'Restaurar playlist publicada'
          : 'Eliminar borrador',

      message:
        isOverride
          ? `¿Deseas descartar los cambios de "${playlist.title}" y restaurar la versión publicada?`
          : `¿Deseas eliminar el borrador "${playlist.title}"?`,

      confirmText:
        isOverride
          ? 'Restaurar'
          : 'Eliminar',

      cancelText:
        'Cancelar',

      destructive:
        !isOverride
    });

  if (!confirmed) {
    return;
  }

  const result =
    isOverride
      ? AdminOfficialPlaylistService
          .restorePublished(
            selectedId
          )
      : AdminOfficialPlaylistService
          .removeDraft(
            selectedId
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

  ToastService.success(
    result.message,
    {
      title:
        isOverride
          ? 'Playlist restaurada'
          : 'Borrador eliminado'
    }
  );

  returnToManager();
}

function duplicateCurrentPlaylist() {
  const selectedId =
    getSelectedPlaylistId();

  if (
    !selectedId ||
    selectedId ===
      NEW_ITEM_ID
  ) {
    return;
  }

  const result =
    AdminOfficialPlaylistService
      .duplicate(
        selectedId
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
    result.item.id
  );

  AdminState.setDirty(false);

  ToastService.success(
    result.message,
    {
      title:
        'Playlist duplicada'
    }
  );

  dispatchRefresh({
    section: SECTION,
    action: 'duplicate',
    playlistId:
      result.item.id
  });
}

const AdminOfficialPlaylistController = {
  savePlaylist,

  returnFromEditor,

  returnToManager,

  duplicateCurrentPlaylist,

  removeCurrentDraft,

  canHandleClick(target) {
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
          '[data-admin-official-playlist-editor-back]',
          '[data-admin-official-playlist-editor-duplicate]',
          '[data-admin-official-playlist-editor-remove-draft]'
        ].join(', ')
      )
    );
  },

  async handleClick(event) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    const backButton =
      target.closest(
        '[data-admin-official-playlist-editor-back]'
      );

    if (backButton) {
      event.preventDefault();

      await returnFromEditor();

      return true;
    }

    const duplicateButton =
      target.closest(
        '[data-admin-official-playlist-editor-duplicate]'
      );

    if (duplicateButton) {
      event.preventDefault();

      duplicateCurrentPlaylist();

      return true;
    }

    const removeButton =
      target.closest(
        '[data-admin-official-playlist-editor-remove-draft]'
      );

    if (removeButton) {
      event.preventDefault();

      await removeCurrentDraft();

      return true;
    }

    return false;
  },

  handleInput(event) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    const form =
      target.closest(
        FORM_SELECTOR
      );

    if (!form) {
      return false;
    }

    const titleInput =
      target.closest(
        '[data-admin-official-playlist-title]'
      );

    if (titleInput) {
      updateSlugFromTitle(
        titleInput
      );
    }

    const idInput =
      target.closest(
        '[data-admin-official-playlist-id]'
      );

    if (idInput) {
      normalizeSlugInput(
        idInput
      );
    }

    AdminState.setDirty(true);

    return true;
  },

  handleChange(event) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return false;
    }

    const form =
      target.closest(
        FORM_SELECTOR
      );

    if (!form) {
      return false;
    }

    AdminState.setDirty(true);

    return true;
  },

  handleSubmit(event) {
    const form =
      event?.target?.closest?.(
        FORM_SELECTOR
      );

    if (!form) {
      return false;
    }

    event.preventDefault();

    savePlaylist();

    return true;
  }
};

export {
  NEW_ITEM_ID,
  FORM_SELECTOR,
  createSlug,
  getFormValues,
  validateValues,
  savePlaylist,
  returnFromEditor,
  returnToManager
};

export default
  AdminOfficialPlaylistController;
