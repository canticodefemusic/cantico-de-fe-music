/**
 * Cántico de Fe Music
 * V12.0 — Admin Layout
 */

import renderSidebar
  from './renderSidebar.js';

import renderToolbar
  from './renderToolbar.js';

import renderDashboard
  from './renderDashboard.js';

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
        >

          ${renderDashboard()}

        </section>

      </main>

    </section>
  `;
}

export default renderAdminLayout;
