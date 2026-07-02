import { appConfig } from '../../config/appConfig.js';

export function renderNavigation(items, activePage) {
  const links = items.map(item => {
    const active = item.id === activePage ? 'is-active' : '';
    return `<a class="${active}" href="${item.href}">${item.label}</a>`;
  }).join('');

  return `
    <header class="cantico-header">
      <a class="cantico-brand" href="/">
        <span class="cantico-logo">♪</span>
        <span>
          <strong>${appConfig.brand.name}</strong>
          <small>${appConfig.brand.subtitle}</small>
        </span>
      </a>

      <nav class="cantico-nav">
        ${links}
      </nav>
    </header>
  `;
}
