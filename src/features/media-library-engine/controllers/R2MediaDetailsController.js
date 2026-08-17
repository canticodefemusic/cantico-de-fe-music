/**
 * Cántico de Fe Music
 * V13.4.11 — R2 Media Details Controller
 *
 * Funciones:
 * - Abrir/cerrar detalles
 * - Copiar enlace
 * - Activar edición
 * - Cancelar edición
 * - Guardar metadatos persistentes en R2
 * - Refrescar biblioteca después de guardar
 */

import adaptR2MediaObject
  from '../services/R2MediaMetadataAdapter.js';

import r2MediaMetadataService
  from '../services/R2MediaMetadataService.js';

import renderR2MediaDetails
  from '../components/renderR2MediaDetails.js';

export class R2MediaDetailsController {

  constructor({
    root = null,
    host = null,
    libraryController = null
  } = {}) {
    this.root =
      root;

    this.host =
      host;

    this.libraryController =
      libraryController;

    this.currentKey =
      null;

    this.saving =
      false;

    this.handleClick =
      this.handleClick.bind(
        this
      );

    this.handleSubmit =
      this.handleSubmit.bind(
        this
      );

    this.handleKeyDown =
      this.handleKeyDown.bind(
        this
      );
  }

  init() {
    if (
      !this.root ||
      !this.host
    ) {
      return false;
    }

    this.root.addEventListener(
      'click',
      this.handleClick
    );

    this.host.addEventListener(
      'click',
      this.handleClick
    );

    this.host.addEventListener(
      'submit',
      this.handleSubmit
    );

    document.addEventListener(
      'keydown',
      this.handleKeyDown
    );

    return true;
  }

  getObjects() {
    const controller =
      this.libraryController;

    if (!controller) {
      return [];
    }

    if (
      typeof controller.getObjects ===
      'function'
    ) {
      const objects =
        controller.getObjects();

      return Array.isArray(
        objects
      )
        ? objects
        : [];
    }

    if (
      Array.isArray(
        controller.objects
      )
    ) {
      return controller.objects;
    }

    if (
      Array.isArray(
        controller.state?.objects
      )
    ) {
      return controller
        .state
        .objects;
    }

    return [];
  }

  getObjectByKey(
    key = ''
  ) {
    const cleanKey =
      String(
        key || ''
      ).trim();

    if (!cleanKey) {
      return null;
    }

    return (
      this.getObjects()
        .find(
          object =>
            object?.key ===
            cleanKey
        ) ||
      null
    );
  }

  open(
    key = ''
  ) {
    const cleanKey =
      String(
        key || ''
      ).trim();

    const object =
      this.getObjectByKey(
        cleanKey
      );

    if (!object) {
      console.error(
        '[R2MediaDetailsController] No se encontró el objeto R2:',
        cleanKey
      );

      return false;
    }

    const media =
      adaptR2MediaObject(
        object
      );

    if (!media) {
      console.error(
        '[R2MediaDetailsController] No se pudo adaptar el objeto R2:',
        cleanKey
      );

      return false;
    }

    this.currentKey =
      cleanKey;

    this.saving =
      false;

    this.host.innerHTML =
      renderR2MediaDetails({
        media
      });

    document.body
      .classList
      .add(
        'has-r2-media-details'
      );

    return true;
  }

  close() {
    if (
      this.saving
    ) {
      return false;
    }

    if (this.host) {
      this.host.innerHTML =
        '';
    }

    this.currentKey =
      null;

    document.body
      .classList
      .remove(
        'has-r2-media-details'
      );

    return true;
  }

  getForm() {
    return (
      this.host
        ?.querySelector(
          '[data-r2-media-metadata-form]'
        ) ||
      null
    );
  }

  getReadonlySection() {
    return (
      this.host
        ?.querySelector(
          '[data-r2-media-details-readonly]'
        ) ||
      null
    );
  }

  getActions() {
    return (
      this.host
        ?.querySelector(
          '[data-r2-media-details-actions]'
        ) ||
      null
    );
  }

  getStatus() {
    return (
      this.host
        ?.querySelector(
          '[data-r2-media-metadata-status]'
        ) ||
      null
    );
  }

  setStatus(
    message = '',
    {
      error = false
    } = {}
  ) {
    const status =
      this.getStatus();

    if (!status) {
      return;
    }

    status.textContent =
      message;

    status.dataset.state =
      error
        ? 'error'
        : (
            message
              ? 'success'
              : ''
          );
  }

  setSaving(
    value
  ) {
    this.saving =
      Boolean(
        value
      );

    const form =
      this.getForm();

    if (!form) {
      return;
    }

    form
      .querySelectorAll(
        'input, textarea, button'
      )
      .forEach(
        element => {
          element.disabled =
            this.saving;
        }
      );

    const saveButton =
      form.querySelector(
        '[data-r2-media-metadata-save]'
      );

    if (saveButton) {
      saveButton.textContent =
        this.saving
          ? 'Guardando...'
          : 'Guardar cambios';
    }
  }

  startEditing() {
    const form =
      this.getForm();

    const readonly =
      this.getReadonlySection();

    const actions =
      this.getActions();

    if (
      !form ||
      !readonly
    ) {
      return false;
    }

    readonly.hidden =
      true;

    form.hidden =
      false;

    if (actions) {
      actions.hidden =
        true;
    }

    this.setStatus('');

    form
      .querySelector(
        '[name="displayName"]'
      )
      ?.focus();

    return true;
  }

  cancelEditing() {
    if (
      this.saving
    ) {
      return false;
    }

    if (!this.currentKey) {
      return false;
    }

    return this.open(
      this.currentKey
    );
  }

  getFormValues(
    form
  ) {
    const formData =
      new FormData(
        form
      );

    const getText =
      name =>
        String(
          formData.get(
            name
          ) ?? ''
        ).trim();

    return {
      displayName:
        getText(
          'displayName'
        ),

      description:
        getText(
          'description'
        ),

      alt:
        getText(
          'alt'
        ),

      category:
        getText(
          'category'
        ),

      tags:
        getText(
          'tags'
        )
          .split(',')
          .map(
            tag =>
              tag.trim()
          )
          .filter(Boolean),

      featured:
        formData.get(
          'featured'
        ) === 'on',

      copyright: {
        author:
          getText(
            'copyrightAuthor'
          ),

        holder:
          getText(
            'copyrightHolder'
          ),

        license:
          getText(
            'copyrightLicense'
          ),

        source:
          getText(
            'copyrightSource'
          ),

        year:
          getText(
            'copyrightYear'
          )
      }
    };
  }

  async saveMetadata(
    form
  ) {
    if (
      this.saving ||
      !form
    ) {
      return false;
    }

    const key =
      String(
        form.getAttribute(
          'data-r2-media-key'
        ) ||
        this.currentKey ||
        ''
      ).trim();

    if (!key) {
      this.setStatus(
        'No se pudo identificar el archivo.',
        {
          error: true
        }
      );

      return false;
    }

    const values =
      this.getFormValues(
        form
      );

    if (!values.displayName) {
      this.setStatus(
        'El nombre visible es obligatorio.',
        {
          error: true
        }
      );

      form
        .querySelector(
          '[name="displayName"]'
        )
        ?.focus();

      return false;
    }

    this.setSaving(
      true
    );

    this.setStatus(
      'Guardando cambios...'
    );

    try {
      await r2MediaMetadataService
        .update(
          key,
          values
        );

      this.setStatus(
        'Metadatos guardados correctamente.'
      );

      if (
        typeof this
          .libraryController
          ?.refresh ===
        'function'
      ) {
        await this
          .libraryController
          .refresh();
      }

      this.currentKey =
        key;

      const reopened =
        this.open(
          key
        );

      if (!reopened) {
        this.close();
      }

      return true;

    } catch (error) {
      console.error(
        '[R2MediaDetailsController] No se pudieron guardar los metadatos:',
        error
      );

      this.setSaving(
        false
      );

      this.setStatus(
        error instanceof Error
          ? error.message
          : 'No se pudieron guardar los metadatos.',
        {
          error: true
        }
      );

      return false;
    }
  }

  async copyLink(
    button
  ) {
    const mediaUrl =
      button?.getAttribute(
        'data-r2-media-url'
      ) || '';

    if (!mediaUrl) {
      return false;
    }

    const absoluteUrl =
      new URL(
        mediaUrl,
        window.location.origin
      ).href;

    try {
      await navigator
        .clipboard
        .writeText(
          absoluteUrl
        );

      const originalText =
        button.textContent;

      button.textContent =
        '✓ Copiado';

      button.disabled =
        true;

      window.setTimeout(
        () => {
          if (
            !button.isConnected
          ) {
            return;
          }

          button.textContent =
            originalText;

          button.disabled =
            false;
        },
        1500
      );

      return true;

    } catch (error) {
      console.error(
        '[R2MediaDetailsController] No se pudo copiar el enlace:',
        error
      );

      return false;
    }
  }

  async handleSubmit(
    event
  ) {
    const form =
      event?.target?.closest?.(
        '[data-r2-media-metadata-form]'
      );

    if (!form) {
      return;
    }

    event.preventDefault();

    await this.saveMetadata(
      form
    );
  }

  async handleClick(
    event
  ) {
    const target =
      event?.target;

    if (
      !target ||
      typeof target.closest !==
        'function'
    ) {
      return;
    }

    const detailsButton =
      target.closest(
        '[data-media-details]'
      );

    if (detailsButton) {
      event.preventDefault();
      event.stopPropagation();

      const key =
        detailsButton.getAttribute(
          'data-media-details'
        );

      const menu =
        detailsButton.closest(
          'details'
        );

      if (menu) {
        menu.open =
          false;
      }

      this.open(
        key
      );

      return;
    }

    const editButton =
      target.closest(
        '[data-r2-media-metadata-edit]'
      );

    if (editButton) {
      event.preventDefault();

      this.startEditing();

      return;
    }

    const cancelButton =
      target.closest(
        '[data-r2-media-metadata-cancel]'
      );

    if (cancelButton) {
      event.preventDefault();

      this.cancelEditing();

      return;
    }

    const closeButton =
      target.closest(
        '[data-r2-media-details-close]'
      );

    if (closeButton) {
      event.preventDefault();

      this.close();

      return;
    }

    const copyButton =
      target.closest(
        '[data-r2-media-details-copy]'
      );

    if (copyButton) {
      event.preventDefault();

      await this.copyLink(
        copyButton
      );
    }
  }

  handleKeyDown(
    event
  ) {
    if (
      event.key !==
      'Escape'
    ) {
      return;
    }

    if (
      !this.host?.querySelector(
        '[data-r2-media-details]'
      )
    ) {
      return;
    }

    event.preventDefault();

    if (
      !this.getForm()?.hidden
    ) {
      this.cancelEditing();

      return;
    }

    this.close();
  }

  destroy() {
    if (this.root) {
      this.root.removeEventListener(
        'click',
        this.handleClick
      );
    }

    if (this.host) {
      this.host.removeEventListener(
        'click',
        this.handleClick
      );

      this.host.removeEventListener(
        'submit',
        this.handleSubmit
      );
    }

    document.removeEventListener(
      'keydown',
      this.handleKeyDown
    );

    this.saving =
      false;

    this.close();

    this.root =
      null;

    this.host =
      null;

    this.libraryController =
      null;

    this.currentKey =
      null;
  }

}

export default
  R2MediaDetailsController;
