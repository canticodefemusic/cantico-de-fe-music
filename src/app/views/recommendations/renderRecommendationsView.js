import { RecommendationEngine } from '../../../features/recommendation-engine/index.js';
import { renderHymnCard } from '../../../features/hymn-library-engine/components/renderHymnCard.js';

export function renderRecommendationsView() {
  const recommendations =
    RecommendationEngine.getRecommendations(8);

  return `
    <section class="recommendations-page">
      <header class="recommendations-page__header">
        <p class="recommendations-page__eyebrow">
          Selección personalizada
        </p>

        <h1>Recomendados para ti</h1>

        <p>
          Himnos seleccionados según tus favoritos,
          playlists y reproducciones.
        </p>
      </header>

      ${
        recommendations.length
          ? `
            <section
  id="hymnLibraryGrid"
  class="hymn-library-grid"
  aria-label="Himnos recomendados"
>
              ${recommendations
                .map(hymn => renderHymnCard(hymn))
                .join('')}
            </section>
          `
          : `
            <div class="recommendations-empty">
              <h2>Aún no tenemos recomendaciones</h2>

              <p>
                Escucha himnos, agrégalos a favoritos
                o guárdalos en playlists para crear
                recomendaciones personalizadas.
              </p>

              <a href="?page=himnos">
                Explorar himnos
              </a>
            </div>
          `
      }
    </section>
  `;
}

export default renderRecommendationsView;
