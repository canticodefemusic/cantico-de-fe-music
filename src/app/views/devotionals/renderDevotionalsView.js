import { devotionals } from '../../data/siteData.js';
import { renderCards } from '../../components/cards/renderCards.js';

export function renderDevotionalsView() {
  return `
    <section class="cantico-section">
      <h1>Devocionales</h1>
      <p>Lecturas breves para fortalecer la fe cada día.</p>
      ${renderCards(devotionals, devotional => `
        <article class="cantico-card">
          <h3>${devotional.title}</h3>
          <p><strong>${devotional.scripture}</strong></p>
          <p>${devotional.content}</p>
        </article>
      `)}
    </section>
  `;
}
