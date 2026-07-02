import { PublicPages } from '../../modules/public-pages/PublicPages.js';
import { SEOManager } from '../../modules/seo/SEOManager.js';

export function launchReadyApp(rootSelector = '#app') {
  const root = document.querySelector(rootSelector);
  if (!root) {
    console.warn('Cántico Launch Ready: root element not found.');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || 'home';

  const seo = new SEOManager();
  const titles = {
    home: 'Inicio',
    himnos: 'Himnos',
    videos: 'Videos',
    albumes: 'Álbumes',
    playlists: 'Playlists',
    devocionales: 'Devocionales',
    contacto: 'Contacto'
  };

  seo.setMeta({
    title: titles[page] || 'Inicio',
    description: 'Cántico de Fe Music: himnos, alabanzas y música cristiana original.',
    path: page === 'home' ? '/' : `/?page=${page}`
  });

  const pages = new PublicPages(root);
  pages.render(page);
}
