import { hymnCatalog } from '../../../features/hymn-library-engine/data/hymnCatalog.js';
import { renderHymnCard } from '../../../features/hymn-library-engine/components/renderHymnCard.js';
import { RecommendationEngine } from '../../../features/recommendation-engine/index.js';
import { devotionals } from '../../data/devotionalsData.js';

export function renderHomeView() {
  const recommendations =
    RecommendationEngine.getRecommendations(4);

  const featuredHymns =
    recommendations.length
      ? recommendations
      : hymnCatalog.slice(0, 4);

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

    <section class="cantico-section">
      <div class="cantico-section__header">
        <div>
          <p class="cantico-kicker">
            Selección musical
          </p>

          <h2>
            ${
              recommendations.length
                ? 'Recomendados para ti'
                : 'Himnos destacados'
            }
          </h2>
        </div>

        <a href="/?page=recomendados">
          Ver recomendaciones
        </a>
      </div>

      <div class="hymn-library-grid">
        ${featuredHymns
          .map(hymn => renderHymnCard(hymn))
          .join('')}
      </div>
    </section>

    <section class="cantico-section">
      <h2>Devocional</h2>

      <div class="cantico-card-grid">
        ${devotionals
          .map(devotional => `
            <article class="cantico-card">
              <h3>${devotional.title}</h3>

              <p>
                <strong>${devotional.scripture}</strong>
              </p>

              <p>${devotional.content}</p>
            </article>
          `)
          .join('')}
      </div>
    </section>
  `;
}
