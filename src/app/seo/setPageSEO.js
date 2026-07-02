import { appConfig } from '../config/appConfig.js';

const titles = {
  home: 'Inicio',
  himnos: 'Himnos',
  albumes: 'Álbumes',
  playlists: 'Playlists',
  videos: 'Videos',
  devocionales: 'Devocionales',
  contacto: 'Contacto'
};

export function setPageSEO(route) {
  const title = titles[route.page] || 'Inicio';
  const fullTitle = `${title} | ${appConfig.brand.name}`;
  const description = appConfig.brand.description;
  const url = route.page === 'home'
    ? appConfig.brand.url
    : `${appConfig.brand.url}/?page=${route.page}`;

  document.title = fullTitle;
  upsertMeta('description', description);
  upsertMeta('twitter:card', 'summary_large_image');
  upsertMeta('twitter:title', fullTitle);
  upsertMeta('twitter:description', description);
  upsertProperty('og:title', fullTitle);
  upsertProperty('og:description', description);
  upsertProperty('og:url', url);
  upsertProperty('og:type', 'website');
  setCanonical(url);
}

function upsertMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}
