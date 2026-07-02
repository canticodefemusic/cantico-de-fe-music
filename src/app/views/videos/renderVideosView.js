import { videos } from '../../data/siteData.js';
import { renderCards } from '../../components/cards/renderCards.js';

export function renderVideosView() {
  return `
    <section class="cantico-section">
      <h1>Videos</h1>
      <p>Videos oficiales y contenido visual de Cántico de Fe Music.</p>
      ${renderCards(videos, video => `
        <article class="cantico-card">
          <h3>${video.title}</h3>
          <p>${video.description}</p>
        </article>
      `)}
    </section>
  `;
}
