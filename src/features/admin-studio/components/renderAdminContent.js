/**
 * Cántico de Fe Music
 * V12.2 — Admin Content Renderer
 */

import renderDashboard
  from './renderDashboard.js';

import renderHymnEditor
  from './renderHymnEditor.js';

import AdminState
  from '../services/AdminState.js';

import AdminHymnService
  from '../services/AdminHymnService.js';

const SECTION_CONFIG = {
  hymns: {
    eyebrow: 'GESTIÓN DE CONTENIDO',
    title: 'Administrador de himnos',
    description:
      'Crea, edita, organiza y prepara los himnos para su publicación.',
    icon: '🎵',
    actionLabel: 'Nuevo himno'
  },

  albums: {
    eyebrow: 'COLECCIONES MUSICALES',
    title: 'Administrador de álbumes',
    description:
      'Organiza himnos en álbumes y administra sus portadas y metadatos.',
    icon: '💿',
    actionLabel: 'Nuevo álbum'
  },

  videos: {
    eyebrow: 'CONTENIDO AUDIOVISUAL',
    title: 'Administrador de videos',
    description:
      'Agrega videos, enlaces, miniaturas y datos relacionados.',
    icon: '🎥',
    actionLabel: 'Nuevo video'
  },

  devotionals: {
    eyebrow: 'CONTENIDO DEVOCIONAL',
    title: 'Administrador de devocionales',
    description:
      'Crea y organiza mensajes devocionales y referencias bíblicas.',
    icon: '📖',
    actionLabel: 'Nuevo devocional'
  },

  media: {
    eyebrow: 'ARCHIVOS DEL PROYECTO',
    title: 'Biblioteca multimedia',
    description:
      'Administra audios, imágenes, portadas y otros recursos.',
    icon: '🖼️',
    actionLabel: 'Agregar archivo'
  },

  settings: {
    eyebrow: 'PREFERENCIAS',
    title: 'Configuración',
    description:
      'Administra las preferencias generales del Admin Studio.',
    icon: '⚙️',
    actionLabel: null
  }
};

const HYMN_STATUS_LABELS = {
  published: 'Publicado',
  draft: 'Borrador',
  override: 'Modificado'
};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getHymnStatus(hymn = {}) {
  if (
    hymn.admin?.source ===
    'override'
  ) {
    return 'override';
  }

  return (
    hymn.admin?.status ||
    'published'
  );
}

function getHymnStatusLabel(
  hymn = {}
) {
  const status =
    getHymnStatus(hymn);

  return (
    HYMN_STATUS_LABELS[status] ||
    'Sin estado'
  );
}

function renderHymnStats() {
  const counts =
    AdminHymnService.getCounts();

  return `
    <section
      class="admin-hymns__stats"
      aria-label="Resumen de himnos"
    >
      <article
        class="admin-hymns-stat"
      >
        <span>
          Total
        </span>

        <strong>
          ${counts.total}
        </strong>
      </article>

      <article
        class="admin-hymns-stat"
      >
        <span>
          Publicados
        </span>

        <strong>
          ${counts.published}
        </strong>
      </article>

      <article
        class="admin-hymns-stat"
      >
        <span>
          Borradores
        </span>

        <strong>
          ${counts.drafts}
        </strong>
      </article>

      <article
        class="admin-hymns-stat"
      >
        <span>
          Modificados
        </span>

        <strong>
          ${counts.overrides}
        </strong>
      </article>
    </section>
  `;
}

function renderHymnScriptures(
  scriptures = []
) {
  if (
    !Array.isArray(scriptures) ||
    !scriptures.length
  ) {
    return `
      <span>
        Sin referencia bíblica
      </span>
    `;
  }

  return scriptures
    .map(scripture => `
      <span>
        ${escapeHtml(scripture)}
      </span>
    `)
    .join('');
}

function renderHymnRow(hymn) {
  const status =
    getHymnStatus(hymn);

  const hasDraft =
    hymn.admin?.source === 'draft' ||
    hymn.admin?.source === 'override';

  const isPublishedOverride =
    hymn.admin?.source === 'override';

  return `
    <article
      class="admin-hymn-row"
      data-admin-hymn-id="${escapeHtml(
        hymn.id
      )}"
    >
      <div
        class="admin-hymn-row__main"
      >
        <div
          class="admin-hymn-row__icon"
          aria-hidden="true"
        >
          ♪
        </div>

        <div
          class="admin-hymn-row__content"
        >
          <div
            class="admin-hymn-row__title-line"
          >
            <h3>
              ${escapeHtml(
                hymn.title ||
                'Himno sin título'
              )}
            </h3>

            <span
              class="
                admin-hymn-status
                admin-hymn-status--${escapeHtml(
                  status
                )}
              "
            >
              ${escapeHtml(
                getHymnStatusLabel(
                  hymn
                )
              )}
            </span>
          </div>

          ${
            hymn.subtitle
              ? `
                <p
                  class="admin-hymn-row__subtitle"
                >
                  ${escapeHtml(
                    hymn.subtitle
                  )}
                </p>
              `
              : ''
          }

          <div
            class="admin-hymn-row__meta"
          >
            <span>
              ${escapeHtml(
                hymn.category ||
                'Sin categoría'
              )}
            </span>

            <span>
              ${escapeHtml(
                hymn.theme ||
                'Sin tema'
              )}
            </span>
          </div>

          <div
            class="admin-hymn-row__scriptures"
          >
            ${renderHymnScriptures(
              hymn.scriptures
            )}
          </div>
        </div>
      </div>

      <div
        class="admin-hymn-row__actions"
      >
        <button
          type="button"
          data-admin-hymn-edit="${escapeHtml(
            hymn.id
          )}"
        >
          Editar
        </button>

        <button
          type="button"
          data-admin-hymn-duplicate="${escapeHtml(
            hymn.id
          )}"
        >
          Duplicar
        </button>

        ${
          hasDraft
            ? `
              <button
                type="button"
                data-admin-hymn-remove-draft="${escapeHtml(
                  hymn.id
                )}"
                data-admin-hymn-restore="${String(
                  isPublishedOverride
                )}"
              >
                ${
                  isPublishedOverride
                    ? 'Restaurar publicado'
                    : 'Eliminar borrador'
                }
              </button>
            `
            : ''
        }
      </div>
    </article>
  `;
}

function renderHymnList({
  query = '',
  status = 'all'
} = {}) {
  const hymns =
    AdminHymnService.list({
      query,
      status
    });

  if (!hymns.length) {
    return `
      <div
        class="admin-section__empty"
      >
        <div
          class="admin-section__empty-icon"
          aria-hidden="true"
        >
          🎵
        </div>

        <h2>
          No se encontraron himnos
        </h2>

        <p>
          Cambia la búsqueda o el filtro
          para mostrar otros resultados.
        </p>
      </div>
    `;
  }

  return `
    <div
      class="admin-hymns__list"
      data-admin-hymn-list
    >
      ${hymns
        .map(renderHymnRow)
        .join('')}
    </div>
  `;
}

function renderHymnManager() {
  const state =
    AdminState.getState();

  const query =
    String(
      state.search || ''
    );

  const status =
    String(
      state.filters?.hymnStatus ||
      'all'
    );

  return `
    <section
      class="admin-section admin-hymns"
      data-admin-current-section="hymns"
    >
      <header
        class="admin-section__header"
      >
        <div
          class="admin-section__heading"
        >
          <p
            class="admin-section__eyebrow"
          >
            GESTIÓN DE CONTENIDO
          </p>

          <h1>
            Administrador de himnos
          </h1>

          <p>
            Crea, edita, organiza y prepara
            los himnos para su publicación.
          </p>
        </div>

        <div
  class="admin-section__actions"
>
  <button
  type="button"
  data-admin-hymn-import
>
  Importar respaldo
</button>

<button
  type="button"
  data-admin-hymn-export
>
  Exportar catálogo
</button>

<button
  type="button"
  data-admin-hymn-backup
>
  Descargar respaldo
</button>

<button
  type="button"
  class="admin-section__primary-action"
  data-admin-create="hymns"
>
  <span
    aria-hidden="true"
  >
    +
  </span>

  <span>
    Nuevo himno
  </span>
</button>
</div>
      </header>

      ${renderHymnStats()}

      <section
        class="admin-hymns__tools"
        aria-label="Herramientas de himnos"
      >
        <label
          class="admin-hymns__search"
          for="adminHymnSearch"
        >
          <span>
            Buscar himnos
          </span>

          <input
            id="adminHymnSearch"
            type="search"
            autocomplete="off"
            placeholder="Buscar por título, categoría, tema o referencia bíblica..."
            value="${escapeHtml(
              query
            )}"
            data-admin-hymn-search
          >
        </label>

        <label
          class="admin-hymns__filter"
          for="adminHymnStatus"
        >
          <span>
            Estado
          </span>

          <select
            id="adminHymnStatus"
            data-admin-hymn-status
          >
            <option
              value="all"
              ${
                status === 'all'
                  ? 'selected'
                  : ''
              }
            >
              Todos
            </option>

            <option
              value="published"
              ${
                status === 'published'
                  ? 'selected'
                  : ''
              }
            >
              Publicados
            </option>

            <option
              value="draft"
              ${
                status === 'draft'
                  ? 'selected'
                  : ''
              }
            >
              Borradores
            </option>
          </select>
        </label>
      </section>

      ${renderHymnList({
        query,
        status
      })}
    </section>
  `;
}

function renderSectionPlaceholder(
  section
) {
  const config =
    SECTION_CONFIG[section];

  if (!config) {
    return renderDashboard();
  }

  return `
    <section
      class="admin-section"
      data-admin-current-section="${escapeHtml(
        section
      )}"
    >
      <header
        class="admin-section__header"
      >
        <div
          class="admin-section__heading"
        >
          <p
            class="admin-section__eyebrow"
          >
            ${escapeHtml(
              config.eyebrow
            )}
          </p>

          <h1>
            ${escapeHtml(
              config.title
            )}
          </h1>

          <p>
            ${escapeHtml(
              config.description
            )}
          </p>
        </div>

        ${
          config.actionLabel
            ? `
              <button
                type="button"
                class="admin-section__primary-action"
                data-admin-create="${escapeHtml(
                  section
                )}"
              >
                <span
                  aria-hidden="true"
                >
                  +
                </span>

                <span>
                  ${escapeHtml(
                    config.actionLabel
                  )}
                </span>
              </button>
            `
            : ''
        }
      </header>

      <div
        class="admin-section__empty"
      >
        <div
          class="admin-section__empty-icon"
          aria-hidden="true"
        >
          ${escapeHtml(
            config.icon
          )}
        </div>

        <h2>
          Esta sección está preparada
        </h2>

        <p>
          El módulo se conectará durante
          las siguientes etapas del
          Admin Studio.
        </p>
      </div>
    </section>
  `;
}

export function renderAdminContent(
  section = null
) {
  const state =
    AdminState.getState();

  const currentSection =
    section ||
    state.section ||
    'dashboard';

  if (
    currentSection ===
    'dashboard'
  ) {
    return renderDashboard();
  }

  if (
    currentSection ===
    'hymns'
  ) {
    if (state.selectedItem) {
      return renderHymnEditor(
        state.selectedItem
      );
    }

    return renderHymnManager();
  }

  return renderSectionPlaceholder(
    currentSection
  );
}

export default renderAdminContent;
