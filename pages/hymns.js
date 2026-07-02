
function badges(h){
  return `
    <div class="badges">
      <span class="badge">${h.theme}</span>
      <span class="badge">${h.reference}</span>
      <span class="badge">${h.album}</span>
      <span class="badge">${h.year}</span>
    </div>
  `;
}

function row(h){
  return `
    <article class="hymn-row" data-title="${h.title} ${h.theme} ${h.reference} ${h.lyrics.join(" ")}">
      <div class="thumb">▶</div>
      <div>
        <h3 style="font-size:22px;margin:0">${h.title}</h3>
        <p class="muted" style="margin:5px 0 0">${h.subtitle}</p>
        ${badges(h)}
      </div>
      <div class="btns" style="display:flex;gap:8px;align-items:center">
        <button class="btn" data-play="${h.id}">▶</button>
        <a class="btn" href="/?page=hymn&id=${h.id}">Ver</a>
      </div>
    </article>
  `;
}

export function renderHymns(data){
  const themes = [...new Set(data.hymns.map(h => h.theme))];
  setTimeout(() => {
    const search = document.querySelector("#hymnSearch");
    const theme = document.querySelector("#themeFilter");
    const list = document.querySelector("#hymnList");

    function draw(){
      const q = (search.value || "").toLowerCase();
      const t = theme.value || "";
      let items = [...data.hymns];
      if(q){
        items = items.filter(h => [
          h.title, h.subtitle, h.theme, h.reference, h.album, h.author, h.lyrics.join(" ")
        ].join(" ").toLowerCase().includes(q));
      }
      if(t) items = items.filter(h => h.theme === t);
      list.innerHTML = items.map(row).join("") || `<div class="panel">No se encontraron himnos.</div>`;
    }

    search.addEventListener("input", draw);
    theme.addEventListener("input", draw);
    draw();
  });

  return `
    <section class="library-hero">
      <div class="container">
        <p class="eyebrow">Biblioteca modular V5.3</p>
        <h1 style="font-size:clamp(50px,6vw,78px)">Himnos</h1>
        <p class="lead">Busca por título, letra, referencia bíblica, tema, álbum o autor.</p>
        <div class="library-stats">
          <div class="stat"><strong>${data.hymns.length}</strong><p>Himnos</p></div>
          <div class="stat"><strong>${themes.length}</strong><p>Temas</p></div>
          <div class="stat"><strong>${data.playlists.length}</strong><p>Playlists</p></div>
          <div class="stat"><strong>${data.albums.length}</strong><p>Álbumes</p></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container music-shell">
        <aside class="music-side panel">
          <h3>Explorar</h3>
          <a href="/?page=playlists">Playlists <span>›</span></a>
          <a href="/?page=albums">Álbumes <span>›</span></a>
          <a href="/?page=videos">Videos <span>›</span></a>
        </aside>
        <div>
          <div class="filters" style="grid-template-columns:1fr 220px">
            <input id="hymnSearch" class="input" placeholder="Buscar himno, palabra de letra o referencia...">
            <select id="themeFilter">
              <option value="">Todos los temas</option>
              ${themes.map(t => `<option>${t}</option>`).join("")}
            </select>
          </div>
          <div id="hymnList" class="list">${data.hymns.map(row).join("")}</div>
        </div>
      </div>
    </section>
  `;
}

export function renderHymnDetail(data, id){
  const h = data.hymns.find(x => x.id === id) || data.hymns[0];
  const related = data.hymns.filter(x => x.theme === h.theme && x.id !== h.id).slice(0, 3);
  return `
    <section class="section">
      <div class="container">
        <a class="muted" href="/?page=hymns">← Volver a Himnos</a>
        <div class="section-head" style="margin-top:20px">
          <h2>${h.title}</h2>
          <p>${h.subtitle}</p>
        </div>
        <div class="featured">
          <div class="panel">
            <p class="eyebrow">Audio</p>
            <div class="player"><button class="play" data-play="${h.id}">▶</button><div class="progress"><span></span></div><strong>${h.duration}</strong></div>
            <p><strong>Referencia:</strong> ${h.reference}</p>
            <p><strong>Tema:</strong> ${h.theme}</p>
            <p><strong>Álbum:</strong> ${h.album}</p>
            <p><strong>Autor:</strong> ${h.author}</p>
          </div>
          <div class="panel">
            <p class="eyebrow">Letra</p>
            ${h.lyrics.map(l => l ? `<p>${l}</p>` : "<br>").join("")}
          </div>
        </div>
        <section class="section">
          <h3 style="font-size:34px;margin-bottom:16px">Relacionados</h3>
          <div class="list">${related.map(row).join("")}</div>
        </section>
      </div>
    </section>
  `;
}
