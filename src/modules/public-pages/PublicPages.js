import { siteContent } from '../site-data/siteContent.js';

export class PublicPages {
  constructor(root) {
    this.root = root;
  }

  render(page = 'home') {
    const html = {
      home: this.home(),
      himnos: this.hymns(),
      videos: this.simple('Videos', 'Próximamente videos de himnos y alabanzas.'),
      albumes: this.simple('Álbumes', 'Próximamente álbumes de Cántico de Fe Music.'),
      playlists: this.simple('Playlists', 'Próximamente listas de reproducción.'),
      devocionales: this.devotionals(),
      contacto: this.simple('Contacto', 'Para contacto, usa los canales oficiales de Cántico de Fe Music.')
    }[page] || this.home();

    this.root.innerHTML = html;
  }

  layout(content) {
    return `
      <main class="cantico-page">
        <header class="cantico-hero">
          <h1>Cántico de Fe Music</h1>
          <p>Himnos, alabanzas y música cristiana original.</p>
          <nav>
            <a href="/">Inicio</a>
            <a href="/?page=himnos">Himnos</a>
            <a href="/?page=videos">Videos</a>
            <a href="/?page=albumes">Álbumes</a>
            <a href="/?page=playlists">Playlists</a>
            <a href="/?page=devocionales">Devocionales</a>
          </nav>
        </header>
        <section class="cantico-content">${content}</section>
      </main>
    `;
  }

  home() {
    return this.layout(`
      <h2>Bienvenido</h2>
      <p>${siteContent.brand.description}</p>
      <p>Explora himnos, devocionales, videos, álbumes y playlists.</p>
    `);
  }

  hymns() {
    const items = siteContent.hymns.map(h => `
      <article class="cantico-card">
        <h3>${h.title}</h3>
        <p><strong>Referencia:</strong> ${h.scripture}</p>
        <p>${h.description}</p>
      </article>
    `).join('');

    return this.layout(`<h2>Himnos</h2>${items}`);
  }

  devotionals() {
    const items = siteContent.devotionals.map(d => `
      <article class="cantico-card">
        <h3>${d.title}</h3>
        <p><strong>Referencia:</strong> ${d.scripture}</p>
        <p>${d.content}</p>
      </article>
    `).join('');

    return this.layout(`<h2>Devocionales</h2>${items}`);
  }

  simple(title, text) {
    return this.layout(`<h2>${title}</h2><p>${text}</p>`);
  }
}
