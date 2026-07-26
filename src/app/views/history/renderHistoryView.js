import { HistoryEngine } from '../../../features/history-engine/index.js';

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function renderCard(item) {
  return `
    <article class="history-card">

      <h3>${item.title}</h3>

      <p>
        Reproducciones:
        <strong>${item.playCount}</strong>
      </p>

      <p>
        Última vez:
        ${formatDate(item.lastPlayed)}
      </p>

      <button
        data-history-play="${item.id}"
        class="button"
      >
        ▶ Reproducir
      </button>

    </article>
  `;
}

export function renderHistoryView() {

  const recent =
    HistoryEngine.getRecent(25);

  return `
    <section class="history-page">

      <header>

        <h1>
          Historial de reproducción
        </h1>

        <p>
          Tus himnos escuchados recientemente.
        </p>

      </header>

      <section class="history-grid">

        ${
          recent.length
            ? recent
                .map(renderCard)
                .join('')
            : `
              <p>
                Aún no hay reproducciones.
              </p>
            `
        }

      </section>

    </section>
  `;
}

export default renderHistoryView;
