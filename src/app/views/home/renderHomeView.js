import {
  hymnLibraryService
} from '../../../features/hymn-library-engine/index.js';

import {
  renderHymnCard
} from '../../../features/hymn-library-engine/components/renderHymnCard.js';

import {
  getFavorites
} from '../../../features/favorites-engine/index.js';

import {
  HistoryService
} from '../../../features/history-engine/index.js';

import {
  getPlaylists
} from '../../../features/playlist-engine/index.js';

import {
  PlayerPersistenceService
} from '../../../features/player-persistence/index.js';

import {
  devotionals
} from '../../data/devotionalsData.js';

function findHymnById(id) {
  return hymnCatalog.find(
    hymn => hymn.id === id
  ) || null;
}

function resolveHistoryHymns(history = []) {
  return history
    .map(item => findHymnById(item.id))
    .filter(Boolean);
}

function formatTime(seconds = 0) {
  const safeSeconds =
    Number.isFinite(Number(seconds))
      ? Math.max(0, Math.floor(Number(seconds)))
      : 0;

  const minutes =
    Math.floor(safeSeconds / 60);

  const remainingSeconds =
    safeSeconds % 60;

  return `${minutes}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
}

function renderHymnSection({
  kicker,
  title,
  hymns,
  link = '/?page=himnos',
  linkText = 'Ver todos'
}) {
  if (!Array.isArray(hymns) || !hymns.length) {
    return '';
  }

  return `
    <section class="cantico-section">
      <div class="cantico-section__header">
        <div>
          ${
            kicker
              ? `
                <p class="cantico-kicker">
                  ${kicker}
                </p>
              `
              : ''
          }

          <h2>${title}</h2>
        </div>

        <a href="${link}">
          ${linkText}
        </a>
      </div>

      <div class="hymn-library-grid">
        ${hymns
          .map(hymn => renderHymnCard(hymn))
          .join('')}
      </div>
    </section>
  `;
}

function renderContinueListening() {
  const session =
    PlayerPersistenceService.load();

  if (
    !session?.trackId ||
    !Number.isFinite(
      Number(session.currentTime)
    ) ||
    Number(session.currentTime) <= 0
  ) {
    return '';
  }

  const hymn =
    findHymnById(session.trackId);

  if (!hymn) {
    return '';
  }

  return `
    <section class="cantico-section">
      <div class="cantico-section__header">
        <div>
          <p class="cantico-kicker">
            Continúa donde te quedaste
          </p>

          <h2>Continuar escuchando</h2>
        </div>
      </div>

      <div class="cantico-continue-listening">
        <div>
          <strong>${hymn.title}</strong>

          <p>
            Retomar desde
            ${formatTime(session.currentTime)}
          </p>
        </div>

        <button
          type="button"
          class="cantico-button primary"
          data-hymn-play="${hymn.id}"
          aria-label="Continuar reproduciendo ${hymn.title}"
        >
          ▶ Continuar
        </button>
      </div>
    </section>
  `;
}

function renderPlaylistsSection(playlists = []) {
  if (
    !Array.isArray(playlists) ||
    !playlists.length
  ) {
    return '';
  }

  return `
    <section class="cantico-section">
      <div class="cantico-section__header">
        <div>
          <p class="cantico-kicker">
            Tu biblioteca personal
          </p>

          <h2>Tus playlists</h2>
        </div>

        <a href="/?page=playlists">
          Ver playlists
        </a>
      </div>

      <div class="cantico-card-grid">
        ${playlists
          .slice(0, 4)
          .map(playlist => `
            <article class="cantico-card">
              <h3>${playlist.name}</h3>

              <p>
                Tu selección personal de himnos.
              </p>

              <a
                class="cantico-button"
                href="/?page=playlists"
              >
                Abrir playlist
              </a>
            </article>
          `)
          .join('')}
      </div>
    </section>
  `;
}

export function renderHomeView() {
    const featuredHymns =
    hymnLibraryService
      .list()
      .filter(
        hymn =>
          hymn.featured === true
      )
      .slice(0, 3);

  const fallbackHymns =
    hymnLibraryService
      .list()
      .slice(0, 3);

  const homeFeaturedHymns =
    featuredHymns.length
      ? featuredHymns
      : fallbackHymns;

  const favoriteIds =
    getFavorites();

  const favoriteHymns =
    favoriteIds
      .map(id => findHymnById(id))
      .filter(Boolean)
      .slice(0, 4);

  const mostPlayedHymns =
    resolveHistoryHymns(
      HistoryService.getMostPlayed(4)
    );

  const recentHymns =
    resolveHistoryHymns(
      HistoryService.getRecent(4)
    );

  const playlists =
    getPlaylists();

  return `
    <section class="cantico-hero">
      <div>
        <p class="cantico-kicker">
          Himnos cristianos originales
        </p>

        <h1>Cántico de Fe Music</h1>

        <p>
          Canciones de fe, esperanza y amor para
          fortalecer el alma y compartir un mensaje de paz.
        </p>

        <div class="cantico-actions">
          <a
            class="cantico-button primary"
            href="/?page=himnos"
          >
            Explorar himnos
          </a>

          <a
            class="cantico-button"
            href="/?page=devocionales"
          >
            Leer devocionales
          </a>
        </div>
      </div>
    </section>

    ${renderContinueListening()}

    ${renderHymnSection({
      kicker: 'Selección destacada',
      title: 'Himnos destacados',
      hymns: homeFeaturedHymns,
      link: '/?page=himnos',
      linkText: 'Ver todos'
    })}

    ${renderHymnSection({
      kicker: 'Tu biblioteca personal',
      title: 'Tus favoritos',
      hymns: favoriteHymns,
      link: '/?page=favoritos',
      linkText: 'Ver favoritos'
    })}

    ${renderHymnSection({
      kicker: 'Basado en tu actividad',
      title: 'Más escuchados',
      hymns: mostPlayedHymns,
      link: '/?page=historial',
      linkText: 'Ver historial'
    })}

    ${renderHymnSection({
      kicker: 'Vuelve a escuchar',
      title: 'Escuchados recientemente',
      hymns: recentHymns,
      link: '/?page=historial',
      linkText: 'Ver historial'
    })}

    ${renderPlaylistsSection(playlists)}

    <section class="cantico-section">
      <h2>Devocional</h2>

      <div class="cantico-card-grid">
        ${devotionals
          .map(devotional => `
            <article class="cantico-card">
              <h3>${devotional.title}</h3>

              <p>
                <strong>
                  ${devotional.scripture}
                </strong>
              </p>

              <p>${devotional.content}</p>
            </article>
          `)
          .join('')}
      </div>
    </section>
  `;
}
