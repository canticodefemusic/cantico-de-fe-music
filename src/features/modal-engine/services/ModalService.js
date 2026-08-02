let activeModal = null;

function createModalId() {
  return [
    'cantico-modal',
    Date.now(),
    Math.random()
      .toString(16)
      .slice(2)
  ].join('-');
}

const ModalService = {
  open(options = {}) {
    const modal = {
      id: options.id || createModalId(),
      type: options.type || 'dialog',
      title: options.title || '',
      message: options.message || '',
      value: options.value || '',
      placeholder: options.placeholder || '',
      confirmText:
        options.confirmText || 'Aceptar',
      cancelText:
        options.cancelText || 'Cancelar',
      destructive:
        options.destructive === true,
      closeOnBackdrop:
        options.closeOnBackdrop !== false
    };

    activeModal = modal;

    window.dispatchEvent(
      new CustomEvent(
        'cantico:modal-open',
        {
          detail: modal
        }
      )
    );

    return modal;
  },

  close(result = null) {
    const modal = activeModal;

    activeModal = null;

    window.dispatchEvent(
      new CustomEvent(
        'cantico:modal-close',
        {
          detail: {
            modal,
            result
          }
        }
      )
    );

    return result;
  },

  getActive() {
    return activeModal;
  },

  isOpen() {
    return Boolean(activeModal);
  }
};

export default ModalService;
