
export function renderHome(data){
  const featured = data.hymns.find(h => h.featured) || data.hymns[0];
  return `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">Música cristiana original</p>
          <h1>${data.settings.tagline || "Himnos que tocan el corazón"}</h1>
          <p class="lead">Canciones de fe, esperanza y amor para fortalecer el alma y compartir un mensaje de paz.</p>
          <div class="hero-buttons">
            <a class="btn primary" href="/?page=hymns">▶ Explorar himnos</a>
            <a class="btn" href="/?page=playlists">Ver playlists</a>
          </div>
          <div class="quick-grid">
            <div><strong>${data.hymns.length}</strong><span>Himnos</span></div>
            <div><strong>${data.playlists.length}</strong><span>Playlists</span></div>
            <div><strong>${data.albums.length}</strong><span>Álbumes</span></div>
          </div>
        </div>
        <div class="hero-card">
          <span class="note n1">♪</span><span class="note n2">♬</span><span class="note n3">♫</span><span class="note n4">♩</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container cards">
        <a class="card" href="/?page=hymns"><div class="big">♫</div><h3>Biblioteca V5.3</h3><p>Base modular para crecer sin romper el sitio.</p></a>
        <a class="card" href="/?page=playlists"><div class="big">▤</div><h3>Playlists</h3><p>Listas por tema.</p></a>
        <a class="card" href="/?page=albums"><div class="big">▣</div><h3>Álbumes</h3><p>Colecciones de himnos.</p></a>
        <a class="card" href="/?page=admin"><div class="big">⚙</div><h3>Admin</h3><p>Generador visual de datos.</p></a>
      </div>
    </section>

    <section class="section">
      <div class="container featured">
        <div class="panel">
          <p class="eyebrow">Himno destacado</p>
          <h3 style="font-size:34px">${featured.title}</h3>
          <p class="muted">${featured.description}</p>
          <div class="player"><button class="play" data-play="${featured.id}">▶</button><div class="progress"><span></span></div><strong>${featured.duration}</strong></div>
          <a class="btn primary" href="/?page=hymn&id=${featured.id}">Ver himno</a>
        </div>
        <div class="panel">
          <p class="eyebrow">Nueva base</p>
          <h3 style="font-size:34px">Componentes reutilizables</h3>
          <p class="muted">Header, footer, reproductor, páginas y datos están separados para futuras versiones.</p>
          <a class="btn" href="/docs/">Ver estructura</a>
        </div>
      </div>
    </section>
  `;
}
