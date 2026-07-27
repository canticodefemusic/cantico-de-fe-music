import { RecommendationEngine } from '../../../features/recommendation-engine/index.js';

function renderRecommendation(hymn) {
  return `
    <article class="recommendation-card">
      <h3>${hymn.title}</h3>

      <p>${hymn.subtitle || hymn.description || ''}</p>

      <a href="?page=hymn&id=${hymn.id}">
        Ver himno
      </a>
    </article>
  `;
}

export function renderRecommendationsView() {
  const recommendations =
    RecommendationEngine.getRecommendations(8);

  return `
    <section class="recommendations-page">
      <header>
        <h1>Recomendados para ti</h1>

        <p>
          Himnos recomendados según tus favoritos,
          playlists y reproducciones.
        </p>
      </header>

      <section class="recommendations-grid">
        ${
          recommendations.length
            ? recommendations
                .map(renderRecommendation)
                .join('')
            : `
              <p>
                Escucha himnos, agrégalos a favoritos
                o guárdalos en playlists para recibir
                recomendaciones.
              </p>
            `
        }
      </section>
    </section>
  `;
}

export default renderRecommendationsView;
