/**
 * Cántico de Fe Music
 * V12.0 — Admin Content Renderer
 */

import renderDashboard
  from './renderDashboard.js';

import AdminState
  from '../services/AdminState.js';

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

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

  return renderSectionPlaceholder(
    currentSection
  );
}

export default renderAdminContent;
