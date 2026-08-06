/**
 * Cántico de Fe Music
 * V12.0 — Admin Dashboard
 */

import dashboardConfig
  from '../data/dashboardConfig.js';

function renderCard(item) {
  return `
    <article
      class="admin-dashboard-card"
      data-admin-section="${item.id}"
    >
      <div
        class="admin-dashboard-card__icon"
        aria-hidden="true"
      >
        ${item.icon}
      </div>

      <h2>
        ${item.title}
      </h2>

      <p>
        ${item.description}
      </p>

      <button
        type="button"
        data-admin-open="${item.id}"
      >
        Abrir
      </button>
    </article>
  `;
}

export function renderDashboard() {
  return `
    <section class="admin-dashboard">

      <header
        class="admin-dashboard__header"
      >
        <p
          class="admin-dashboard__eyebrow"
        >
          ADMIN STUDIO
        </p>

        <h1>
          Panel de administración
        </h1>

        <p>
          Administra todo el contenido
          de Cántico de Fe Music desde
          un solo lugar.
        </p>
      </header>

      <section
        class="admin-dashboard__grid"
      >
        ${dashboardConfig
          .map(renderCard)
          .join('')}
      </section>

    </section>
  `;
}

export default renderDashboard;
