/**
 * Cántico de Fe Music
 * V12.0 — Admin Sidebar
 */

import dashboardConfig
  from '../data/dashboardConfig.js';

import AdminRouter
  from '../services/AdminRouter.js';

function renderItem(item) {
  const active =
    AdminRouter.is(item.id)
      ? 'is-active'
      : '';

  return `
    <button
      type="button"
      class="admin-sidebar__item ${active}"
      data-admin-open="${item.id}"
    >
      <span
        class="admin-sidebar__icon"
        aria-hidden="true"
      >
        ${item.icon}
      </span>

      <span>
        ${item.title}
      </span>
    </button>
  `;
}

export function renderSidebar() {
  return `
    <aside class="admin-sidebar">

      <header
        class="admin-sidebar__header"
      >
        <h2>
          Admin Studio
        </h2>

        <p>
          Cántico de Fe Music
        </p>
      </header>

      <nav
        class="admin-sidebar__nav"
        aria-label="Panel de administración"
      >
        ${dashboardConfig
          .map(renderItem)
          .join('')}
      </nav>

    </aside>
  `;
}

export default renderSidebar;
