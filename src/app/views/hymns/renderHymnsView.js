import { hymns } from '../../data/siteData.js';
import { renderCards } from '../../components/cards/renderCards.js';

export function renderHymnsView(route) {
  const selected = route.id ? hymns.find(h => h.id === route.id) : null;

  if (selected) {
    return `
      <section class="cantico-section">
        <a href="/?page=himnos">← Volver a himnos</a>
        <article class="cantico-detail">
          <h1>${selected.title}</h1>
          <p><strong>Referencia bíblica:</strong> ${selected.scripture}</p>
          <p>${selected.description}</p>
          <p><strong>Categoría:</strong> ${selected.category}</p>
        </article>
      </section>
    `;
  }

  return `
    <section class="cantico-section">
      <h1>Himnos</h1>
      <p>Explora los himnos originales de Cántico de Fe Music.</p>
      ${renderCards(hymns, h => `
        <article class="cantico-card">
          <h3>${h.title}</h3>
          <p><strong>${h.scripture}</strong></p>
          <p>${h.description}</p>
          <a href="/?page=himnos&id=${h.id}">Ver himno</a>
        </article>
      `)}
    </section>
  `;
}
