import { RecommendationEngine } from '../../../features/recommendation-engine/index.js';

function renderRecommendation(hymn) {
  const coverMarkup = hymn.cover
    ? `
      <img
        class="recommendation-card__cover"
        src="${hymn.cover}"
        alt="Portada de ${hymn.title}"
        loading="lazy"
      >
    `
    : `
      <div
        class="recommendation-card__cover recommendation-card__cover--placeholder"
        aria-hidden="true"
      >
        ♪
      </div>
    `;

  return `
    <article class="recommendation-card">
      ${coverMarkup}

      <div class="recommendation-card__content">
        <p class="recommendation-card__label">
          Recomendado para ti
        </p>

        <h2 class="recommendation-card__title">
          ${hymn.title}
        </h2>

        <p class="recommendation-card__description">
          ${hymn.subtitle || hymn.description || ''}
        </p>

        <div class="recommendation-card__actions">
          <button
            type="button"
            class="recommendation-card__play"
            data-recommendation-play="${hymn.id}"
          >
            ▶ Reproducir
          </button>

          <a
            class="recommendation-card__link"
            href="?page=himnos&id=${hymn.id}"
          >
            Ver himno
          </a>
        </div>
      </div>
    </article>
  `;
}

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
              class="recommendations-grid"
              aria-label="Himnos recomendados"
            >
              ${recommendations
                .map(renderRecommendation)
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
