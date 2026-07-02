
import { simpleCard } from "/components/cards.js";
export function renderHome(data){
 const f=data.hymns.find(h=>h.featured)||data.hymns[0];
 return `<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">V6.1 Infraestructura</p><h1>${data.settings.tagline}</h1><p class="lead">Base organizada por servicios, componentes, páginas, API JSON y PWA para construir la plataforma completa sin romper el sitio.</p><div class="hero-buttons"><a class="btn primary" href="/?page=hymns">▶ Explorar himnos</a><a class="btn" href="/?page=modules">Ver infraestructura</a></div><div class="quick-grid"><div><strong>${data.hymns.length}</strong><span>Himnos</span></div><div><strong>${data.videos.length}</strong><span>Videos</span></div><div><strong>V6.1</strong><span>Infraestructura</span></div></div></div><div class="hero-card"><span class="note n1">♪</span><span class="note n2">♬</span><span class="note n3">♫</span><span class="note n4">♩</span></div></div></section><section class="section"><div class="container feature-cards">${[
 simpleCard("🧱","Infraestructura","Core, router, store y servicios separados.","/?page=modules"),
 simpleCard("📚","API JSON","Datos duplicados en /api para futura conexión.","/api/hymns.json"),
 simpleCard("🎵","Player","Reproductor global listo para MP3 real.","/?page=hymns"),
 simpleCard("⚙","Admin","Generador de contenido y SEO.","/?page=admin")
].join("")}</div></section><section class="section"><div class="container featured"><div class="panel"><p class="eyebrow">Himno destacado</p><h3 style="font-size:34px">${f.title}</h3><p class="muted">${f.description}</p><div class="player"><button class="play" data-play="${f.id}">▶</button><div class="progress"><span></span></div><strong>${f.duration}</strong></div><a class="btn primary" href="/?page=hymn&id=${f.id}">Ver himno</a></div><div class="panel"><p class="eyebrow">Nuevo en V6.1</p><h3 style="font-size:34px">Servicios separados</h3><p class="muted">SearchService, ContentService, Router y Store ahora están separados para crecer mejor.</p><a class="btn" href="/docs/ROADMAP.md">Ver roadmap</a></div></div></section>`;
}
