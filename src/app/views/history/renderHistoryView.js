import { HistoryEngine } from '../../../features/history-engine/index.js';

function renderItem(item) {
  const label =
    item.playCount === 1
      ? 'reproducción'
      : 'reproducciones';

  return `
    <article class="history-card">
      <h3>${item.title}</h3>

      <p>
        ${item.playCount} ${label}
      </p>
    </article>
  `;
}

export function renderHistoryView() {
  const items = HistoryEngine.getMostPlayed(100);

  return `
    <section class="history-page">

      <header>
        <h1>Historial de reproducción</h1>

        <p>
          Número de reproducciones de cada himno.
        </p>
      </header>

      <section class="history-grid">
        ${
          items.length
            ? items.map(renderItem).join('')
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
