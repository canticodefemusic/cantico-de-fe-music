/**
 * Cántico de Fe Music
 * V13.0.3 — Media Metadata Controller
 */

import MediaMetadataService
  from '../services/MediaMetadataService.js';

import MediaLibraryState
  from '../state/MediaLibraryState.js';

import renderMediaMetadataEditor
  from '../components/renderMediaMetadataEditor.js';

const EDITOR_SELECTOR =
  '[data-media-metadata-editor]';

const FORM_SELECTOR =
  '[data-media-metadata-form]';

const CLOSE_SELECTOR =
  '[data-media-metadata-close]';

const RESTORE_SELECTOR =
  '[data-media-metadata-restore]';

const SAVE_SELECTOR =
  '[data-media-metadata-save]';

const HOST_SELECTOR =
  '[data-media-metadata-host]';

let currentMediaId =
  null;

let dirty =
  false;

function normalizeText(
  value = ''
) {
  return String(
    value ?? ''
  ).trim();
}

function getHost(
  root = document
) {
  if (
    root?.matches?.(
      HOST_SELECTOR
    )
  ) {
    return root;
  }

  return root?.querySelector?.(
    HOST_SELECTOR
  ) || null;
}

function getEditor(
  root = document
) {
  if (
    root?.matches?.(
      EDITOR_SELECTOR
    )
  ) {
    return root;
  }

  return root?.querySelector?.(
    EDITOR_SELECTOR
  ) || null;
}

function getForm(
  root = document
) {
  const editor =
    getEditor(
      root
    );

  return editor?.querySelector(
    FORM_SELECTOR
  ) || null;
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

function getFormValues(
  form
) {
  const formData =
    new FormData(
      form
    );

  return {
    mediaId:
      getFormText(
        formData,
        'mediaId'
      ),

    name:
      getFormText(
        formData,
        'name'
      ),

    description:
      getFormText(
        formData,
        'description'
      ),

    alt:
      getFormText(
        formData,
        'alt'
      ),

    category:
      getFormText(
        formData,
        'category'
      ),

    tags:
      getFormText(
        formData,
        'tags'
      ),

    featured:
      formData.get(
        'featured'
      ) === 'true',

    copyright: {
      author:
        getFormText(
          formData,
          'copyrightAuthor'
        ),

      holder:
        getFormText(
          formData,
          'copyrightHolder'
        ),

      license:
        getFormText(
          formData,
          'copyrightLicense'
        ),

      source:
        getFormText(
          formData,
          'copyrightSource'
        ),

      year:
        getFormText(
          formData,
          'copyrightYear'
        )
    }
  };
}

function validateValues(
  values
) {
  if (!values.mediaId) {
    return {
      valid: false,
      field: null,
      message:
        'No se pudo identificar el archivo multimedia.'
    };
  }

  if (!values.name) {
    return {
      valid: false,
      field: 'name',
      message:
        'El nombre del archivo es obligatorio.'
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

function dispatchEditorEvent(
  eventName,
  detail = {}
) {
  window.dispatchEvent(
    new CustomEvent(
      eventName,
      {
        detail
      }
    )
  );
}

function renderEditor(
  mediaId,
  {
    host = null
  } = {}
) {
  const cleanId =
    normalizeText(
      mediaId
    );

  const targetHost =
    host ||
    getHost();

  if (
    !cleanId ||
    !targetHost
  ) {
    return false;
  }

  const media =
    MediaMetadataService
      .getById(
        cleanId
      );

  targetHost.innerHTML =
    renderMediaMetadataEditor({
      media
    });

  currentMediaId =
    media?.id ||
    null;

  dirty =
    false;

  if (currentMediaId) {
    MediaLibraryState
      .setSelectedMediaId(
        currentMediaId
      );
  }

  dispatchEditorEvent(
    'cantico:media-metadata-editor-open',
    {
      media
    }
  );

  return Boolean(
    media
  );
}

function closeEditor({
  clearHost = true
} = {}) {
  const host =
    getHost();

  const mediaId =
    currentMediaId;

  if (
    clearHost &&
    host
  ) {
    host.innerHTML =
      '';
  }

  currentMediaId =
    null;

  dirty =
    false;

  dispatchEditorEvent(
    'cantico:media-metadata-editor-close',
    {
      mediaId
    }
  );

  return true;
}

function markDirty(
  value = true
) {
  dirty =
    Boolean(
      value
    );

  dispatchEditorEvent(
    'cantico:media-metadata-editor-dirty',
    {
      dirty,
      mediaId:
        currentMediaId
    }
  );

  return dirty;
}

function saveMetadata(
  form = null
) {
  const targetForm =
    form ||
    getForm();

  if (!targetForm) {
    return {
      success: false,
      media: null,
      message:
        'No se encontró el formulario de metadatos.'
    };
  }

  const values =
    getFormValues(
      targetForm
    );

  const validation =
    validateValues(
      values
    );

  if (!validation.valid) {
    focusField(
      targetForm,
      validation.field
    );

    dispatchEditorEvent(
      'cantico:media-metadata-save-error',
      {
        message:
          validation.message,
        field:
          validation.field
      }
    );

    return {
      success: false,
      media: null,
      message:
        validation.message
    };
  }

  const result =
    MediaMetadataService
      .update(
        values.mediaId,
        {
          name:
            values.name,

          description:
            values.description,

          alt:
            values.alt,

          category:
            values.category,

          tags:
            values.tags,

          featured:
            values.featured,

          copyright:
            values.copyright
        }
      );

  if (!result.success) {
    dispatchEditorEvent(
      'cantico:media-metadata-save-error',
      {
        message:
          result.message
      }
    );

    return result;
  }

  currentMediaId =
    result.media.id;

  markDirty(false);

  renderEditor(
    result.media.id
  );

  dispatchEditorEvent(
    'cantico:media-metadata-saved',
    {
      media:
        result.media,
      message:
        result.message
    }
  );

  return result;
}

function restoreMetadata(
  mediaId = null
) {
  const cleanId =
    normalizeText(
      mediaId ||
      currentMediaId
    );

  if (!cleanId) {
    return {
      success: false,
      media: null,
      message:
        'No se pudo identificar el archivo multimedia.'
    };
  }

  const result =
    MediaMetadataService
      .restore(
        cleanId
      );

  if (!result.success) {
    dispatchEditorEvent(
      'cantico:media-metadata-restore-error',
      {
        message:
          result.message
      }
    );

    return result;
  }

  markDirty(false);

  renderEditor(
    result.media.id
  );

  dispatchEditorEvent(
    'cantico:media-metadata-restored',
    {
      media:
        result.media,
      message:
        result.message
    }
  );

  return result;
}

function initialize(
  root = document
) {
  const editor =
    getEditor(
      root
    );

  if (!editor) {
    return false;
  }

  currentMediaId =
    editor.dataset
      .mediaMetadataId ||
    null;

  dirty =
    false;

  return true;
}

const MediaMetadataController = {
  initialize,

  renderEditor,

  closeEditor,

  saveMetadata,

  restoreMetadata,

  markDirty,

  isDirty() {
    return dirty;
  },

  getCurrentMediaId() {
    return currentMediaId;
  },

  getCurrentMedia() {
    if (!currentMediaId) {
      return null;
    }

    return MediaMetadataService
      .getById(
        currentMediaId
      );
  },

  handleInput(event) {
    const form =
      event?.target?.closest?.(
        FORM_SELECTOR
      );

    if (!form) {
      return false;
    }

    markDirty(true);

    return true;
  },

  handleChange(event) {
    const form =
      event?.target?.closest?.(
        FORM_SELECTOR
      );

    if (!form) {
      return false;
    }

    markDirty(true);

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

    saveMetadata(
      form
    );

    return true;
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

    const closeButton =
      target.closest(
        CLOSE_SELECTOR
      );

    if (closeButton) {
      event.preventDefault();

      closeEditor();

      return true;
    }

    const restoreButton =
      target.closest(
        RESTORE_SELECTOR
      );

    if (restoreButton) {
      event.preventDefault();

      if (
        restoreButton.disabled
      ) {
        return true;
      }

      restoreMetadata();

      return true;
    }

    const saveButton =
      target.closest(
        SAVE_SELECTOR
      );

    if (saveButton) {
      const form =
        saveButton.closest(
          FORM_SELECTOR
        );

      if (form) {
        event.preventDefault();

        saveMetadata(
          form
        );
      }

      return true;
    }

    return false;
  }
};

export {
  EDITOR_SELECTOR,
  FORM_SELECTOR,
  CLOSE_SELECTOR,
  RESTORE_SELECTOR,
  SAVE_SELECTOR,
  HOST_SELECTOR,
  getHost,
  getEditor,
  getForm,
  getFormValues,
  validateValues,
  renderEditor,
  closeEditor,
  saveMetadata,
  restoreMetadata
};

export default
  MediaMetadataController;
