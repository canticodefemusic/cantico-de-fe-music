/**
 * Cántico de Fe Music
 * V12.0 — Admin Toolbar
 */

import AdminState
  from '../services/AdminState.js';

export function renderToolbar() {
  const state =
    AdminState.getState();

  return `
    <header
      class="admin-toolbar"
    >

      <div
        class="admin-toolbar__left"
      >
        <h1>
          Admin Studio
        </h1>

        <p>
          ${
            state.section
              .charAt(0)
              .toUpperCase() +
            state.section.slice(1)
          }
        </p>
      </div>

      <div
        class="admin-toolbar__right"
      >

        ${
          state.dirty
            ? `
              <span
                class="admin-toolbar__badge
                admin-toolbar__badge--warning"
              >
                Cambios sin guardar
              </span>
            `
            : `
              <span
                class="admin-toolbar__badge"
              >
                Todo guardado
              </span>
            `
        }

      </div>

    </header>
  `;
}

export default renderToolbar;
