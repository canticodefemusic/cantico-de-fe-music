import { hymns, devotionals } from '../../data/siteData.js';

export function renderHomeView() {
  return `
    <section class="cantico-hero">
      <div>
        <p class="cantico-kicker">Himnos cristianos originales</p>
        <h1>Cántico de Fe Music</h1>
        <p>Canciones de fe, esperanza y amor para fortalecer el alma y compartir un mensaje de paz.</p>
        <div class="cantico-actions">
          <a class="cantico-button primary" href="/?page=himnos">Explorar himnos</a>
          <a class="cantico-button" href="/?page=devocionales">Leer devocionales</a>
        </div>
      </div>
    </section>

    <section class="cantico-section">
      <h2>Himnos destacados</h2>
      <div class="cantico-card-grid">
        ${hymns.slice(0, 2).map(h => `
          <article class="cantico-card">
            <h3>${h.title}</h3>
            <p><strong>Referencia:</strong> ${h.scripture}</p>
            <p>${h.description}</p>
            <a href="/?page=himnos&id=${h.id}">Ver himno</a>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="cantico-section">
      <h2>Devocional</h2>
      <div class="cantico-card-grid">
        ${devotionals.map(d => `
          <article class="cantico-card">
            <h3>${d.title}</h3>
            <p><strong>${d.scripture}</strong></p>
            <p>${d.content}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}
