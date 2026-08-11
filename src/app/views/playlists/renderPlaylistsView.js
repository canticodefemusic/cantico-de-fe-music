import {
  getPlaylists,
  SmartPlaylistEngine
} from '../../../features/playlist-engine/index.js';

import {
  getFavorites
} from '../../../features/favorites-engine/index.js';

import {
  HymnLibraryService
} from '../../../features/hymn-library-engine/index.js';

const hymnService =
  new HymnLibraryService();

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getSmartPlaylists() {
  const hymns =
    hymnService.list();

  const favoriteIds =
    getFavorites();

  const definitions =
    SmartPlaylistEngine
      .definitions()
      .map(definition => {
        if (
          definition.type !==
          'favorites'
        ) {
          return definition;
        }

        return {
          ...definition,

          rule: {
            ...definition.rule,
            favoriteIds
          }
        };
      });

  return SmartPlaylistEngine.generate(
    hymns,
    {
      definitions
    }
  );
}

function renderPlaylistDetail(
  playlist
) {
  const hymns =
    Array.isArray(playlist.hymns)
      ? playlist.hymns
      : (
          Array.isArray(
            playlist.hymnIds
          )
            ? playlist.hymnIds
            : []
        )
          .map(hymnId =>
            hymnService.findById(
              hymnId
            )
          )
          .filter(Boolean);

  const isSmartPlaylist =
    playlist.automatic === true;

  const safePlaylistId =
    escapeHtml(playlist.id);

  const safePlaylistName =
    escapeHtml(playlist.name);

  return `
    <section
      class="
        cantico-section
        playlist-detail
      "
    >
      <div
        class="playlist-detail__topbar"
      >
        <a
          class="
            cantico-button
            playlist-back-link
          "
          href="/?page=playlists"
        >
          ← Volver a playlists
        </a>

        ${
          isSmartPlaylist
            ? `
              <span
                class="
                  playlist-badge
                  playlist-badge--smart
                "
              >
                Playlist inteligente
              </span>
            `
            : `
              <span
                class="
                  playlist-badge
                  playlist-badge--manual
                "
              >
                Playlist personal
              </span>
            `
        }
      </div>

      <header
        class="playlist-detail__header"
      >
        <p
          class="playlist-page__kicker"
        >
          ${
            isSmartPlaylist
              ? 'Selección automática'
              : 'Tu colección personal'
          }
        </p>

        <h1>
          ${safePlaylistName}
        </h1>

        ${
          playlist.description
            ? `
              <p
                class="
                  playlist-detail__description
                "
              >
                ${escapeHtml(
                  playlist.description
                )}
              </p>
            `
            : ''
        }

        <div
          class="playlist-detail__meta"
        >
          <span>
            ${hymns.length}
            himno${
              hymns.length === 1
                ? ''
                : 's'
            }
          </span>

          ${
            isSmartPlaylist
              ? `
                <span>
                  Se actualiza
                  automáticamente
                </span>
              `
              : ''
          }
        </div>
      </header>

      ${
        hymns.length
          ? `
            <div
              class="
                cantico-grid
                playlist-hymn-grid
              "
            >
              ${hymns
                .map(hymn => {
                  const safeHymnId =
                    escapeHtml(
                      hymn.id
                    );

                  return `
                    <article
                      class="
                        cantico-card
                        playlist-hymn-card
                      "
                    >
                      <div
                        class="
                          playlist-hymn-card__icon
                        "
                        aria-hidden="true"
                      >
                        ♪
                      </div>

                      <div
                        class="
                          playlist-hymn-card__body
                        "
                      >
                        <h3>
                          ${escapeHtml(
                            hymn.title
                          )}
                        </h3>

                        ${
                          hymn.description
                            ? `
                              <p>
                                ${escapeHtml(
                                  hymn.description
                                )}
                              </p>
                            `
                            : ''
                        }

                        <div
                          class="
                            playlist-hymn-card__actions
                          "
                        >
                          <a
                            class="
                              cantico-button
                              playlist-button
                              playlist-button--secondary
                            "
                            href="/?page=himnos&id=${encodeURIComponent(
                              hymn.id
                            )}"
                          >
                            Ver letra
                          </a>

                          <button
                            type="button"
                            class="
                              cantico-button
                              playlist-button
                              playlist-button--primary
                            "
                            data-hymn-play="${safeHymnId}"
                          >
                            ▶ Escuchar
                          </button>

                          ${
                            isSmartPlaylist
                              ? ''
                              : `
                                <button
                                  type="button"
                                  class="
                                    cantico-button
                                    playlist-button
                                    playlist-button--danger
                                  "
                                  data-playlist-remove-hymn="${safeHymnId}"
                                  data-playlist-id="${safePlaylistId}"
                                >
                                  Quitar de la playlist
                                </button>
                              `
                          }
                        </div>
                      </div>
                    </article>
                  `;
                })
                .join('')}
            </div>
          `
          : `
            <div
              class="
                playlist-empty
                cantico-empty
              "
            >
              <h2>
                Esta playlist está vacía
              </h2>

              <p>
                ${
                  isSmartPlaylist
                    ? `
                      Todavía no hay himnos
                      que cumplan los criterios
                      de esta playlist.
                    `
                    : `
                      Agrega himnos desde la
                      biblioteca para comenzar
                      tu colección.
                    `
                }
              </p>

              <a
                class="
                  cantico-button
                  primary
                "
                href="/?page=himnos"
              >
                Explorar himnos
              </a>
            </div>
          `
      }
    </section>
  `;
}

function renderSmartPlaylistCard(
  playlist
) {
  const hymnIds =
    Array.isArray(
      playlist.hymnIds
    )
      ? playlist.hymnIds
      : [];

  return `
    <article
      class="
        cantico-card
        playlist-card
        playlist-card--smart
      "
    >
      <div
        class="playlist-card__header"
      >
        <div
          class="playlist-card__icon"
          aria-hidden="true"
        >
          ✦
        </div>

        <span
          class="
            playlist-badge
            playlist-badge--smart
          "
        >
          Playlist inteligente
        </span>
      </div>

      <div
        class="playlist-card__body"
      >
        <h3>
          ${escapeHtml(
            playlist.name
          )}
        </h3>

        <p
          class="
            playlist-card__description
          "
        >
          ${escapeHtml(
            playlist.description || ''
          )}
        </p>

        <p
          class="playlist-card__count"
        >
          ${hymnIds.length}
          himno${
            hymnIds.length === 1
              ? ''
              : 's'
          }
        </p>
      </div>

      <div
        class="playlist-card__actions"
      >
        <a
          class="
            cantico-button
            playlist-button
            playlist-button--secondary
          "
          href="/?page=playlists&id=${encodeURIComponent(
            playlist.id
          )}"
        >
          Abrir playlist
        </a>
      </div>
    </article>
  `;
}

function renderManualPlaylistCard(
  playlist
) {
  const hymnIds =
    Array.isArray(
      playlist.hymnIds
    )
      ? playlist.hymnIds
      : [];

  const safeId =
    escapeHtml(playlist.id);

  const safeName =
    escapeHtml(playlist.name);

  return `
    <article
      class="
        cantico-card
        playlist-card
        playlist-card--manual
      "
    >
      <div
        class="playlist-card__header"
      >
        <div
          class="playlist-card__icon"
          aria-hidden="true"
        >
          ♫
        </div>

        <span
          class="
            playlist-badge
            playlist-badge--manual
          "
        >
          Playlist personal
        </span>
      </div>

      <div
        class="playlist-card__body"
      >
        <h3>
          ${safeName}
        </h3>

        <p
          class="playlist-card__count"
        >
          ${hymnIds.length}
          himno${
            hymnIds.length === 1
              ? ''
              : 's'
          }
        </p>
      </div>

      <div
        class="playlist-card__actions"
      >
        <a
          class="
            cantico-button
            playlist-button
            playlist-button--secondary
          "
          href="/?page=playlists&id=${encodeURIComponent(
            playlist.id
          )}"
        >
          Abrir playlist
        </a>

        <button
          type="button"
          class="
            cantico-button
            playlist-button
          "
          data-playlist-rename="${safeId}"
          data-playlist-name="${safeName}"
        >
          Renombrar
        </button>

        <button
          type="button"
          class="
            cantico-button
            playlist-button
          "
          data-playlist-duplicate="${safeId}"
        >
          Duplicar
        </button>

        <button
          type="button"
          class="
            cantico-button
            playlist-button
            playlist-button--danger
          "
          data-playlist-delete="${safeId}"
        >
          Eliminar
        </button>
      </div>
    </article>
  `;
}

export function renderPlaylistsView(
  route = {}
) {
  const manualPlaylists =
    getPlaylists();

  const smartPlaylists =
    getSmartPlaylists();

  const allPlaylists = [
    ...smartPlaylists,
    ...manualPlaylists
  ];

  if (route.id) {
    const selectedPlaylist =
      allPlaylists.find(
        playlist =>
          playlist.id ===
          route.id
      );

    if (!selectedPlaylist) {
      return `
        <section
          class="
            cantico-section
            playlist-not-found
          "
        >
          <div
            class="
              playlist-empty
              cantico-empty
            "
          >
            <h1>
              Playlist no encontrada
            </h1>

            <p>
              La playlist solicitada
              no existe o fue eliminada.
            </p>

            <a
              class="
                cantico-button
                primary
              "
              href="/?page=playlists"
            >
              ← Volver a playlists
            </a>
          </div>
        </section>
      `;
    }

    return renderPlaylistDetail(
      selectedPlaylist
    );
  }

  return `
    <section
      class="
        cantico-section
        playlist-page
      "
    >
      <header
        class="playlist-page__header"
      >
        <p
          class="playlist-page__kicker"
        >
          Tu biblioteca personal
        </p>

        <h1>
          Playlists
        </h1>

        <p
          class="playlist-page__description"
        >
          Organiza tus himnos,
          crea tus propias colecciones
          y accede a selecciones
          inteligentes.
        </p>
      </header>

      <div
        class="
          playlist-management-actions
        "
      >
        <button
          id="create-playlist-button"
          type="button"
          class="
            cantico-button
            primary
            playlist-management-button
          "
        >
          ＋ Nueva playlist
        </button>

        <button
          id="export-playlists-button"
          type="button"
          class="
            cantico-button
            playlist-management-button
          "
        >
          Exportar playlists
        </button>

        <button
          id="import-playlists-button"
          type="button"
          class="
            cantico-button
            playlist-management-button
          "
        >
          Importar playlists
        </button>

        <input
          id="import-playlists-file"
          type="file"
          accept=".json,application/json"
          hidden
        >
      </div>

      <section
        class="playlist-group"
      >
        <div
          class="
            playlist-group__header
          "
        >
          <div>
            <p
              class="
                playlist-group__kicker
              "
            >
              Selecciones automáticas
            </p>

            <h2>
              Playlists inteligentes
            </h2>
          </div>

          <span
            class="
              playlist-group__count
            "
          >
            ${smartPlaylists.length}
          </span>
        </div>

        ${
          smartPlaylists.length
            ? `
              <div
                class="
                  cantico-grid
                  playlist-grid
                "
              >
                ${smartPlaylists
                  .map(
                    renderSmartPlaylistCard
                  )
                  .join('')}
              </div>
            `
            : `
              <div
                class="
                  playlist-empty
                  cantico-empty
                "
              >
                <h3>
                  No hay playlists
                  inteligentes disponibles
                </h3>

                <p>
                  Las selecciones automáticas
                  aparecerán aquí cuando haya
                  contenido disponible.
                </p>
              </div>
            `
        }
      </section>

      <section
        class="playlist-group"
      >
        <div
          class="
            playlist-group__header
          "
        >
          <div>
            <p
              class="
                playlist-group__kicker
              "
            >
              Tus colecciones
            </p>

            <h2>
              Mis playlists
            </h2>
          </div>

          <span
            class="
              playlist-group__count
            "
          >
            ${manualPlaylists.length}
          </span>
        </div>

        ${
          manualPlaylists.length
            ? `
              <div
                class="
                  cantico-grid
                  playlist-grid
                "
              >
                ${manualPlaylists
                  .map(
                    renderManualPlaylistCard
                  )
                  .join('')}
              </div>
            `
            : `
              <div
                class="
                  playlist-empty
                  cantico-empty
                "
              >
                <h3>
                  Aún no has creado
                  ninguna playlist
                </h3>

                <p>
                  Crea tu primera playlist
                  para organizar tus himnos
                  favoritos.
                </p>

                <button
                  type="button"
                  class="
                    cantico-button
                    primary
                  "
                  data-create-playlist-shortcut
                >
                  Crear una playlist
                </button>
              </div>
            `
        }
      </section>
    </section>
  `;
}
