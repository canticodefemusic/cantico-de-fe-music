/**
 * Cántico de Fe Music
 * V12.0 — Admin Studio Initializer
 */

import AdminState
  from './services/AdminState.js';

import renderAdminContent
  from './components/renderAdminContent.js';

function updateActiveSidebar(section) {
  document
    .querySelectorAll(
      '[data-admin-section]'
    )
    .forEach(button => {
      button.classList.toggle(
        'is-active',
        button.dataset.adminSection === section
      );
    });
}

function renderSection(section) {
  const container =
    document.querySelector(
      '[data-admin-content]'
    );

  if (!container) {
    return;
  }

  AdminState.setSection(section);

  container.innerHTML =
    renderAdminContent(section);

  updateActiveSidebar(section);
}

export function initAdminStudio() {
  updateActiveSidebar(
    AdminState.getState().section
  );

  document
    .querySelectorAll(
      '[data-admin-section]'
    )
    .forEach(button => {
      button.addEventListener(
        'click',
        () => {
          renderSection(
            button.dataset.adminSection
          );
        }
      );
    });

  document
    .querySelectorAll(
      '[data-admin-open]'
    )
    .forEach(button => {
      button.addEventListener(
        'click',
        () => {
          renderSection(
            button.dataset.adminOpen
          );
        }
      );
    });
}

export default initAdminStudio;
