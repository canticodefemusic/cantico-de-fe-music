import { appConfig } from './config/appConfig.js';
import { resolveRoute } from './router/routeResolver.js';
import { renderNavigation } from './components/navigation/renderNavigation.js';
import { setPageSEO } from './seo/setPageSEO.js';

import { renderHomeView } from './views/home/renderHomeView.js';
import { renderHymnsView } from './views/hymns/renderHymnsView.js';
import { renderAlbumsView } from './views/albums/renderAlbumsView.js';
import { renderPlaylistsView } from './views/playlists/renderPlaylistsView.js';
import { renderDevotionalsView } from './views/devotionals/renderDevotionalsView.js';
import { renderVideosView } from './views/videos/renderVideosView.js';
import { renderContactView } from './views/contact/renderContactView.js';

import {
  renderMusicPlayerPro,
  initMusicPlayerPro
} from '../features/music-player-pro/index.js';

import {
  renderHymnLibrary,
  renderHymnDetail,
  initHymnLibrary
} from '../features/hymn-library-engine/index.js';

const views = {
  home: renderHomeView,
  himnos: (route) =>
  route.id
    ? renderHymnDetail(route.id)
    : renderHymnLibrary(),
  albumes: renderAlbumsView,
  playlists: renderPlaylistsView,
  devocionales: renderDevotionalsView,
  videos: renderVideosView,
  contacto: renderContactView
};

export function startUnifiedCanticoApp(rootSelector = '#app') {
  const root = document.querySelector(rootSelector);

  if (!root) {
    console.error('[Cántico V8.1] Root element not found:', rootSelector);
    return;
  }

  const route = resolveRoute();
  const renderView = views[route.page] || views.home;

  setPageSEO(route);

  root.innerHTML = `
    <div class="cantico-app-shell">
      ${renderNavigation(appConfig.navigation, route.page)}
      <main class="cantico-main">
        ${renderView(route)}
      </main>
      ${renderMusicPlayerPro()}
      <footer class="cantico-footer">
        <p>© 2026 Cántico de Fe Music. Todos los derechos reservados.</p>
      </footer>
    </div>
  `;

  setTimeout(() => {
  const player = initMusicPlayerPro();

  initHymnLibrary({
    onPlay: (hymn) => {
      window.dispatchEvent(new CustomEvent('cantico:hymn-play', { detail: hymn }));
    }
  });
}, 0);
}
