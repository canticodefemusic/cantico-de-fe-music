/**
 * Cántico de Fe Music
 * V12.0 — Admin Layout
 */

import renderSidebar
  from './renderSidebar.js';

import renderToolbar
  from './renderToolbar.js';

import renderAdminContent
  from './renderAdminContent.js';

export function renderAdminLayout() {
  return `
    <section
      class="admin-layout"
    >
      ${renderSidebar()}

      <main
        class="admin-layout__main"
      >
        ${renderToolbar()}

        <section
          class="admin-layout__content"
          data-admin-content
        >
          ${renderAdminContent()}
        </section>
      </main>
    </section>
  `;
}

export default renderAdminLayout;
