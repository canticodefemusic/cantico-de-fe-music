import { devotionals } from '../../data/devotionalsData.js';
import { renderCards } from '../../components/cards/renderCards.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderDevotionalsView() {
  const devotionalCount = Array.isArray(devotionals)
    ? devotionals.length
    : 0;

  return `
    <section class="cantico-section devotionals-page">

      <header class="devotionals-hero">
        <span class="devotionals-eyebrow">
          PARA FORTALECER TU FE
        </span>

        <h1>Devocionales</h1>

        <p class="devotionals-intro">
          Lecturas breves para fortalecer la fe cada día.
        </p>
      </header>

      <div class="devotionals-section-header">
        <div>
          <span class="devotionals-section-eyebrow">
            REFLEXIONES
          </span>

          <h2>
            Lecturas para cada día
          </h2>
        </div>
      </div>

      ${
        devotionalCount
          ? renderCards(
              devotionals,
              devotional => `
                <article class="cantico-card devotional-card">

                  <div class="devotional-card__top">
                    <div
                      class="devotional-card__icon"
                      aria-hidden="true"
                    >
                      ✦
                    </div>

                    <span class="devotional-card__badge">
                      Devocional
                    </span>
                  </div>

                  <h3>
                    ${escapeHtml(devotional.title)}
                  </h3>

                  <p class="devotional-card__scripture">
                    ${escapeHtml(devotional.scripture)}
                  </p>

                  <p class="devotional-card__content">
                    ${escapeHtml(devotional.content)}
                  </p>

                </article>
              `
            )
          : `
            <div class="devotionals-empty">
              <div
                class="devotionals-empty__icon"
                aria-hidden="true"
              >
                ✦
              </div>

              <div>
                <h3>
                  Próximamente habrá nuevos devocionales
                </h3>

                <p>
                  Estamos preparando nuevas lecturas
                  para fortalecer tu fe cada día.
                </p>
              </div>
            </div>
          `
      }

    </section>
  `;
}
