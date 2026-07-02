
import { simpleCard } from "/components/cards.js";
export function renderHome(data){
 const f=data.hymns.find(h=>h.featured)||data.hymns[0];
 return `<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">V6.2 Player avanzado</p><h1>${data.settings.tagline}</h1><p class="lead">Ahora la plataforma incluye reproductor global con cola, progreso, volumen, repetir, aleatorio y estructura lista para MP3 real.</p><div class="hero-buttons"><a class="btn primary" href="/?page=hymns">▶ Explorar himnos</a><a class="btn" href="/?page=player">Ver Player V6.2</a></div><div class="quick-grid"><div><strong>${data.hymns.length}</strong><span>Himnos</span></div><div><strong>${data.videos.length}</strong><span>Videos</span></div><div><strong>V6.2</strong><span>Player</span></div></div></div><div class="hero-card"><span class="note n1">♪</span><span class="note n2">♬</span><span class="note n3">♫</span><span class="note n4">♩</span></div></div></section><section class="section"><div class="container feature-cards">${[
 simpleCard("🎧","Player real","Preparado para reproducir MP3 desde audioUrl.","/?page=player"),
 simpleCard("🔁","Repetir","Botón repeat integrado en el reproductor.","/?page=player"),
 simpleCard("🔀","Aleatorio","Modo shuffle para playlists y álbumes.","/?page=player"),
 simpleCard("🔊","Volumen","Control de volumen y barra de progreso.","/?page=player")
].join("")}</div></section><section class="section"><div class="container featured"><div class="panel"><p class="eyebrow">Himno destacado</p><h3 style="font-size:34px">${f.title}</h3><p class="muted">${f.description}</p><div class="player"><button class="play" data-play="${f.id}">▶</button><div class="progress"><span></span></div><strong>${f.duration}</strong></div><a class="btn primary" href="/?page=hymn&id=${f.id}">Ver himno</a></div><div class="panel"><p class="eyebrow">Nuevo en V6.2</p><h3 style="font-size:34px">Reproductor avanzado</h3><p class="muted">Cuando agregues MP3 en audioUrl, el reproductor usará audio real automáticamente.</p><a class="btn" href="/docs/ROADMAP.md">Ver roadmap</a></div></div></section>`;
}
