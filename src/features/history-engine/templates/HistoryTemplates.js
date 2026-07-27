/**
 * V9.2.0 Listening History Engine
 * HistoryTemplates
 */

function emptyTemplate() {
  return `
    <div class="history-empty">
      <p>No hay reproducciones recientes.</p>
    </div>
  `;
}

function itemTemplate(item) {
  return `
    <article
      class="history-item"
      data-history-id="${item.id}"
    >
      <h3>${item.title}</h3>

      <p>
        Reproducciones:
        <strong>${item.playCount}</strong>
      </p>

      <p>
        Última reproducción:
        ${new Date(item.lastPlayed).toLocaleString()}
      </p>
    </article>
  `;
}

function listTemplate(items = []) {
  if (!items.length) {
    return emptyTemplate();
  }

  return `
    <section class="history-list">
      ${items
        .map(item => itemTemplate(item))
        .join('')}
    </section>
  `;
}

export const HistoryTemplates = {
  empty: emptyTemplate,
  item: itemTemplate,
  list: listTemplate
};

export default HistoryTemplates;
