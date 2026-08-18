/**
 * Cántico de Fe Music
 * V13.4.45 — Instant Hymn Detail Return
 *
 * Funciones:
 * - Usar una sola instancia compartida de HymnLibraryService
 * - Sincronizar R2 antes del render inicial
 * - Soportar himnos dinámicos R2
 * - Mantener reproducción, favoritos y playlists
 * - Cerrar detalle de himno instantáneamente
 * - Restaurar Biblioteca de Himnos sin recargar la página
 */

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
  renderUploadView,
  initUploadView
} from './views/upload/renderUploadView.js';

import {
  renderMusicPlayerPro,
  initMusicPlayerPro
} from '../features/music-player-pro/index.js';

import {
  QueueService
} from '../features/queue-engine/index.js';

import {
  hymnLibraryService,
  renderHymnLibrary,
  renderHymnDetail,
  renderHymnCard,
  initHymnLibrary,
  initHymnDetail,
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

/* ==========================================================
   Views
   ========================================================== */

const views = {
  home:
    renderHomeView,

  himnos:
    route =>
      route.id
        ? renderHymnDetail(
            route.id
          )
        : renderHymnLibrary(),

  favoritos:
    renderFavoritesView,

  albumes:
    renderAlbumsView,

  playlists:
    renderPlaylistsView,

  historial:
    renderHistoryView,

  recomendados:
    renderRecommendationsView,

  devocionales:
    renderDevotionalsView,

  videos:
    renderVideosView,

  contacto:
    renderContactView,

  upload:
    renderUploadView,

  admin:
    renderAdminLayout
};

/* ==========================================================
   Queue
   ========================================================== */

const queueService =
  new QueueService();

/* ==========================================================
   Global Event Handlers
   ========================================================== */

let playlistRefreshHandler =
  null;

let hymnDetailCloseHandler =
  null;

/* ==========================================================
   Hymn Sync
   ========================================================== */

async function syncSharedHymnLibrary() {
  try {
    const result =
      await hymnLibraryService
        .syncR2Metadata();

    if (
      !result?.success
    ) {
      console.warn(
        '[Cántico] La biblioteca R2 no pudo sincronizarse. Se utilizará el catálogo base.'
      );
    }

    return result;

  } catch (error) {
    console.error(
      '[Cántico] Error al sincronizar la biblioteca compartida:',
      error
    );

    return {
      success:
        false,

      hymns:
        hymnLibraryService.list(),

      error
    };
  }
}

/* ==========================================================
   Play Handler
   ========================================================== */

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
          item.id ===
          hymn.id
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
          detail:
            hymn
        }
      )
    );
  };
}

/* ==========================================================
   Immediate Hymn Library Render
   ========================================================== */

function renderCachedHymnLibrary({
  root,
  handleHymnPlay
}) {
  const main =
    root.querySelector(
      '.cantico-main'
    );

  if (!main) {
    return false;
  }

  /*
   * Cambiamos la URL sin hacer reload.
   */

  window.history.replaceState(
    {},
    '',
    '/?page=himnos'
  );

  const route =
    resolveRoute();

  setPageSEO(
    route
  );

  /*
   * Reconstruimos inmediatamente
   * el shell de la Biblioteca.
   */

  main.innerHTML =
    renderHymnLibrary();

  /*
   * Pintamos inmediatamente los himnos
   * que YA están almacenados en la
   * instancia compartida.
   *
   * No esperamos otra petición R2 para
   * que el usuario vuelva a ver las tarjetas.
   */

  const grid =
    main.querySelector(
      '#hymnLibraryGrid'
    );

  if (grid) {
    const hymns =
      hymnLibraryService.list();

    grid.innerHTML =
      hymns
        .map(
          hymn =>
            renderHymnCard(
              hymn
            )
        )
        .join('');
  }

  /*
   * Activamos inmediatamente botones
   * de reproducción, favoritos y playlists.
   */

  initHymnCardInteractions({
    onPlay:
      handleHymnPlay
  });

  /*
   * Inicializamos el resto de la Biblioteca:
   * búsqueda, ordenamiento y carga incremental.
   *
   * Puede sincronizar R2 nuevamente en segundo
   * plano, pero las tarjetas ya están visibles.
   */

  initHymnLibrary({
    onPlay:
      handleHymnPlay
  });

  initShareButtons();

  return true;
}

/* ==========================================================
   Hymn Detail Close
   ========================================================== */

function registerHymnDetailClose({
  root,
  handleHymnPlay
}) {
  if (
    hymnDetailCloseHandler
  ) {
    window.removeEventListener(
      'cantico:hymn-detail-close',
      hymnDetailCloseHandler
    );
  }

  hymnDetailCloseHandler =
    () => {
      renderCachedHymnLibrary({
        root,
        handleHymnPlay
      });
    };

  window.addEventListener(
    'cantico:hymn-detail-close',
    hymnDetailCloseHandler
  );
}

/* ==========================================================
   Playlist Refresh
   ========================================================== */

function registerPlaylistRefresh({
  root,
  handleHymnPlay
}) {
  if (
    playlistRefreshHandler
  ) {
    window.removeEventListener(
      'cantico:playlists-refresh',
      playlistRefreshHandler
    );
  }

  playlistRefreshHandler =
    () => {
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
        onPlay:
          handleHymnPlay
      });
    };

  window.addEventListener(
    'cantico:playlists-refresh',
    playlistRefreshHandler
  );
}

/* ==========================================================
   Current View Initialization
   ========================================================== */

function initializeCurrentView({
  route,
  handleHymnPlay
}) {
  initGlobalSearch();

  initHymnCardInteractions({
    onPlay:
      handleHymnPlay
  });

  if (
    route.page ===
      'himnos' &&
    !route.id
  ) {
    initHymnLibrary({
      onPlay:
        handleHymnPlay
    });
  }

  if (
    route.page ===
      'himnos' &&
    route.id
  ) {
    initHymnDetail();
  }

  initShareButtons();

  if (
    route.page ===
    'favoritos'
  ) {
    initFavoritesView({
      onPlay:
        handleHymnPlay
    });
  }

  if (
    route.page ===
    'playlists'
  ) {
    initPlaylistsView();
  }

  if (
    route.page ===
    'historial'
  ) {
    initHistoryView();
  }

  if (
    route.page ===
    'recomendados'
  ) {
    initRecommendationsView();
  }

  if (
    route.page ===
    'admin'
  ) {
    initAdminStudio();
  }

  if (
    route.page ===
    'upload'
  ) {
    initUploadView();
  }
}

/* ==========================================================
   App Start
   ========================================================== */

export async function startUnifiedCanticoApp(
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

  /*
   * Sincronizamos antes del render inicial.
   *
   * Esto permite abrir directamente:
   *
   * ?page=himnos&id=tumba-sellada
   *
   * y encontrar el himno dinámico R2.
   */

  await syncSharedHymnLibrary();

  const renderView =
    views[
      route.page
    ] ||
    views.home;

  setPageSEO(
    route
  );

  root.innerHTML = `
    <div
      class="cantico-app-shell"
    >
      ${renderNavigation(
        appConfig.navigation,
        route.page
      )}

      <main
        class="cantico-main"
      >
        ${renderView(
          route
        )}
      </main>

      ${renderMusicPlayerPro()}

      <footer
        class="cantico-footer"
      >
        <p>
          © 2026 Cántico de Fe Music.
          Todos los derechos reservados.
        </p>
      </footer>
    </div>
  `;

  window.setTimeout(
    () => {
      initMusicPlayerPro();

      queueService.restore();

      const handleHymnPlay =
        createHymnPlayHandler();

      registerPlaylistRefresh({
        root,
        handleHymnPlay
      });

      registerHymnDetailClose({
        root,
        handleHymnPlay
      });

      initializeCurrentView({
        route,
        handleHymnPlay
      });
    },
    0
  );
}

/* ==========================================================
   Auxiliary Exports
   ========================================================== */

export {
  syncSharedHymnLibrary,
  createHymnPlayHandler,
  renderCachedHymnLibrary
};
