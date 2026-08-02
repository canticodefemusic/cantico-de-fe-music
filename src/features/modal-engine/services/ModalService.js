/**
 * Cántico de Fe Music
 * V10.7 Modal Service
 */

import { renderModal } from '../components/renderModal.js';

class ModalService {
  static open(options = {}) {
    this.close();

    document.body.insertAdjacentHTML(
      'beforeend',
      renderModal(options)
    );
  }

  static close() {
    document
      .querySelector('.cantico-modal-backdrop')
      ?.remove();
  }
}

export default ModalService;
