import {
  appConfig
} from './config/appConfig.js';

import {
  resolveRoute
} from './router/routeResolver.js';

import {
  renderNavigation
} from './components/navigation/renderNavigation.js';

import {
  setPageSEO
} from './seo/setPageSEO.js';

import {
  renderHomeView
} from './views/home/renderHomeView.js';

import {
  renderFavoritesView,
  initFavoritesView
} from './views/favorites/renderFavoritesView.js';

import {
  renderAlbumsView
} from './views/albums/renderAlbumsView.js';

import {
  renderPlaylistsView
} from './views/playlists/renderPlaylistsView.js';

import {
  initPlaylistsView
} from './views/playlists/initPlaylistsView.js';

import {
  renderHistoryView
} from './views/history/renderHistoryView.js';

import {
  initHistoryView
} from './views/history/initHistoryView.js';

import {
  renderRecommendationsView
} from './views/recommendations/renderRecommendationsView.js';

import {
  initRecommendationsView
} from './views/recommendations/initRecommendationsView.js';

import {
  renderDevotionalsView
} from './views/devotionals/renderDevotionalsView.js';

import {
  renderVideosView
} from './views/videos/renderVideosView.js';

import {
  renderContactView
} from './views/contact/renderContactView.js';

import {
  renderMusicPlayerPro,
  initMusicPlayerPro
} from '../features/music-player-pro/index.js';

import {
  QueueService
} from '../features/queue-engine/index.js';

import {
  HymnLibraryService
} from '../features/hymn-library-engine/services/HymnLibraryService.js';

import {
  renderHymnLibrary,
  renderHymnDetail,
  initHymnLibrary,
  initHymnCardInteractions,
  initShareButtons
} from '../features/hymn-library-engine/index.js';

import {
  initGlobalSearch
} from '../features/global-search-engine/index.js';

import {
  renderAdminLayout,
  initAdminStudio
} from '../features/admin-studio/index.js';

const views = {
  home: renderHomeView,

  himnos: route =>
    route.id
      ? renderHymnDetail(route.id)
      : renderHymnLibrary(),

  favoritos: renderFavoritesView,
  albumes: renderAlbumsView,
  playlists: renderPlaylistsView,
  historial: renderHistoryView,
  recomendados: renderRecommendationsView,
  devocionales: renderDevotionalsView,
  videos: renderVideosView,
  contacto: renderContactView,
  admin: renderAdminLayout
};

const queueService =
  new QueueService();

const hymnLibraryService =
  new HymnLibraryService();

let playlistRefreshHandler = null;

function createHymnPlayHandler() {
  return hymn => {
    if (!hymn) {
      return;
    }

    const hymns =
      hymnLibraryService.list();

    const startIndex =
      hymns.findIndex(
        item =>
          item.id === hymn.id
      );

    queueService.load(
      hymns,
      startIndex >= 0
        ? startIndex
        : 0
    );

    window.dispatchEvent(
      new CustomEvent(
        'cantico:hymn-play',
        {
          detail: hymn
        }
      )
    );
  };
}

function registerPlaylistRefresh({
  root,
  handleHymnPlay
}) {
  if (playlistRefreshHandler) {
    window.removeEventListener(
      'cantico:playlists-refresh',
      playlistRefreshHandler
    );
  }

  playlistRefreshHandler = () => {
    const currentRoute =
      resolveRoute();

    if (
      currentRoute.page !==
      'playlists'
    ) {
      return;
    }

    const main =
      root.querySelector(
        '.cantico-main'
      );

    if (!main) {
      return;
    }

    setPageSEO(
      currentRoute
    );

    main.innerHTML =
      renderPlaylistsView(
        currentRoute
      );

    initPlaylistsView();

    initHymnCardInteractions({
      onPlay: handleHymnPlay
    });
  };

  window.addEventListener(
    'cantico:playlists-refresh',
    playlistRefreshHandler
  );
}

function initializeCurrentView({
  route,
  handleHymnPlay
}) {
  initGlobalSearch();

  initHymnCardInteractions({
    onPlay: handleHymnPlay
  });

  if (
    route.page === 'himnos' &&
    !route.id
  ) {
    initHymnLibrary({
      onPlay: handleHymnPlay
    });
  }

  initShareButtons();

  if (
    route.page === 'favoritos'
  ) {
    initFavoritesView({
      onPlay: handleHymnPlay
    });
  }

  if (
    route.page === 'playlists'
  ) {
    initPlaylistsView();
  }

  if (
    route.page === 'historial'
  ) {
    initHistoryView();
  }

  if (
    route.page === 'recomendados'
  ) {
    initRecommendationsView();
  }

  if (
    route.page === 'admin'
  ) {
    initAdminStudio();
  }
}

export function startUnifiedCanticoApp(
  rootSelector = '#app'
) {
  const root =
    document.querySelector(
      rootSelector
    );

  if (!root) {
    console.error(
      '[Cántico] Root element not found:',
      rootSelector
    );

    return;
  }

  const route =
    resolveRoute();

  const renderView =
    views[route.page] ||
    views.home;

  setPageSEO(route);

  root.innerHTML = `
    <div class="cantico-app-shell">
      ${renderNavigation(
        appConfig.navigation,
        route.page
      )}

      <main class="cantico-main">
        ${renderView(route)}
      </main>

      ${renderMusicPlayerPro()}

      <footer class="cantico-footer">
        <p>
          © 2026 Cántico de Fe Music.
          Todos los derechos reservados.
        </p>
      </footer>
    </div>
  `;

  window.setTimeout(() => {
    initMusicPlayerPro();
    queueService.restore();

    const handleHymnPlay =
      createHymnPlayHandler();

    registerPlaylistRefresh({
      root,
      handleHymnPlay
    });

    initializeCurrentView({
      route,
      handleHymnPlay
    });
  }, 0);
}
