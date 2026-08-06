/**
 * Cántico de Fe Music
 * V12.6.1 — Official Playlist Manager
 */

import AdminOfficialPlaylistService
  from '../services/AdminOfficialPlaylistService.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPlaylistStatus(
  playlist = {}
) {
  if (
    playlist.admin?.source ===
    'override'
  ) {
    return 'override';
  }

  return (
    playlist.admin?.status ||
    'published'
  );
}

function getPlaylistStatusLabel(
  playlist = {}
) {
  const status =
    getPlaylistStatus(
      playlist
    );

  const labels = {
    published: 'Publicada',
    draft: 'Borrador',
    override: 'Modificada'
  };

  return (
    labels[status] ||
    'Sin estado'
  );
}

function renderStats() {
  const counts =
    AdminOfficialPlaylistService
      .getCounts();

  return `
    <section
      class="admin-hymns__stats"
      aria-label="Resumen de playlists oficiales"
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
          Publicadas
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
          Modificadas
        </span>

        <strong>
          ${counts.overrides}
        </strong>
      </article>
    </section>
  `;
}

function renderPlaylistRow(
  playlist
) {
  const status =
    getPlaylistStatus(
      playlist
    );

  const hasDraft =
    playlist.admin?.source ===
      'draft' ||
    playlist.admin?.source ===
      'override';

  const isOverride =
    playlist.admin?.source ===
    'override';

  const hymnCount =
    Array.isArray(
      playlist.hymnIds
    )
      ? playlist.hymnIds.length
      : 0;

  return `
    <article
      class="admin-hymn-row"
      data-admin-official-playlist-id="${escapeHtml(
        playlist.id
      )}"
    >
      <div
        class="admin-hymn-row__main"
      >
        <img
          class="admin-hymn-row__cover"
          src="${escapeHtml(
            playlist.cover ||
            '/assets/images/default-social-cover.png'
          )}"
          alt="Portada de ${escapeHtml(
            playlist.title ||
            'playlist oficial'
          )}"
          loading="lazy"
        >

        <div
          class="admin-hymn-row__content"
        >
          <div
            class="admin-hymn-row__title-line"
          >
            <h3>
              ${escapeHtml(
                playlist.title ||
                'Playlist sin título'
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
                getPlaylistStatusLabel(
                  playlist
                )
              )}
            </span>
          </div>

          ${
            playlist.description
              ? `
                <p
                  class="admin-hymn-row__subtitle"
                >
                  ${escapeHtml(
                    playlist.description
                  )}
                </p>
              `
              : ''
          }

          <div
            class="admin-hymn-row__meta"
          >
            <span>
              ${hymnCount}
              ${
                hymnCount === 1
                  ? 'himno'
                  : 'himnos'
              }
            </span>

            <span>
              Orden:
              ${Number(
                playlist.order || 0
              )}
            </span>

            ${
              playlist.featured
                ? `
                  <span>
                    Destacada
                  </span>
                `
                : ''
            }
          </div>
        </div>
      </div>

      <div
        class="admin-hymn-row__actions"
      >
        <button
          type="button"
          data-admin-official-playlist-edit="${escapeHtml(
            playlist.id
          )}"
        >
          Editar
        </button>

        <button
          type="button"
          data-admin-official-playlist-duplicate="${escapeHtml(
            playlist.id
          )}"
        >
          Duplicar
        </button>

        ${
          hasDraft
            ? `
              <button
                type="button"
                data-admin-official-playlist-remove-draft="${escapeHtml(
                  playlist.id
                )}"
                data-admin-official-playlist-restore="${String(
                  isOverride
                )}"
              >
                ${
                  isOverride
                    ? 'Restaurar publicada'
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

function renderPlaylistList(
  playlists = []
) {
  if (!playlists.length) {
    return `
      <div
        class="admin-section__empty"
      >
        <div
          class="admin-section__empty-icon"
          aria-hidden="true"
        >
          🎶
        </div>

        <h2>
          Aún no hay playlists oficiales
        </h2>

        <p>
          Crea la primera playlist para
          organizar y recomendar tus himnos.
        </p>
      </div>
    `;
  }

  return `
    <div
      class="admin-hymns__list"
      data-admin-official-playlist-list
    >
      ${playlists
        .map(
          renderPlaylistRow
        )
        .join('')}
    </div>
  `;
}

export function renderOfficialPlaylistManager({
  query = '',
  status = 'all'
} = {}) {
  const playlists =
    AdminOfficialPlaylistService
      .list({
        query,
        status
      });

  return `
    <section
      class="admin-section admin-hymns"
      data-admin-current-section="official-playlists"
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
            ORGANIZACIÓN MUSICAL
          </p>

          <h1>
            Playlists oficiales
          </h1>

          <p>
            Crea selecciones oficiales de
            himnos visibles para todos los
            visitantes del sitio.
          </p>
        </div>

        <div
          class="admin-section__actions"
        >
          <button
            type="button"
            data-admin-official-playlist-import
          >
            Importar respaldo
          </button>

          <button
            type="button"
            data-admin-official-playlist-export
          >
            Exportar catálogo
          </button>

          <button
            type="button"
            data-admin-official-playlist-backup
          >
            Descargar respaldo
          </button>

          <button
            type="button"
            class="admin-section__primary-action"
            data-admin-create="officialPlaylists"
          >
            <span
              aria-hidden="true"
            >
              +
            </span>

            <span>
              Nueva playlist
            </span>
          </button>
        </div>
      </header>

      ${renderStats()}

      <section
        class="admin-hymns__tools"
        aria-label="Herramientas de playlists oficiales"
      >
        <label
          class="admin-hymns__search"
          for="adminOfficialPlaylistSearch"
        >
          <span>
            Buscar playlists
          </span>

          <input
            id="adminOfficialPlaylistSearch"
            type="search"
            autocomplete="off"
            placeholder="Buscar por título, descripción o himno..."
            value="${escapeHtml(
              query
            )}"
            data-admin-official-playlist-search
          >
        </label>

        <label
          class="admin-hymns__filter"
          for="adminOfficialPlaylistStatus"
        >
          <span>
            Estado
          </span>

          <select
            id="adminOfficialPlaylistStatus"
            data-admin-official-playlist-status
          >
            <option
              value="all"
              ${
                status === 'all'
                  ? 'selected'
                  : ''
              }
            >
              Todas
            </option>

            <option
              value="published"
              ${
                status === 'published'
                  ? 'selected'
                  : ''
              }
            >
              Publicadas
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

            <option
              value="override"
              ${
                status === 'override'
                  ? 'selected'
                  : ''
              }
            >
              Modificadas
            </option>
          </select>
        </label>
      </section>

      ${renderPlaylistList(
        playlists
      )}
    </section>
  `;
}

export default renderOfficialPlaylistManager;
