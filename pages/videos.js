
export function renderVideos(data){
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>Videos</h2>
          <p>Videos oficiales, lyric videos y shorts.</p>
        </div>
        <div class="video-grid">
          ${data.hymns.map(h => `
            <article class="card">
              <div class="video-thumb">▶</div>
              <span class="badge">${h.theme}</span>
              <h3>${h.title}</h3>
              <p class="muted">${h.description}</p>
              <a class="btn" href="/?page=hymn&id=${h.id}">Ver himno</a>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}
