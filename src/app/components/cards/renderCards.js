export function renderCards(items, renderItem) {
  if (!items.length) {
    return '<p class="cantico-empty">No hay contenido disponible todavía.</p>';
  }

  return `
    <div class="cantico-card-grid">
      ${items.map(renderItem).join('')}
    </div>
  `;
}
