
import { validateMediaLibrary, mediaTemplate } from "/assets/js/services/mediaService.js";

function mediaCard(item){
 const icon = item.type==="audio" ? "🎧" : item.type==="video" ? "🎬" : "🖼";
 const cls = item.type==="audio" ? "audio" : item.type==="video" ? "video-art" : "cover-art";
 return `<article class="card"><div class="media-thumb ${cls}">${icon}</div><span class="badge">${item.type}</span><h3>${item.title}</h3><p class="muted">Estado: ${item.status}</p><span class="media-path">${item.path}</span></article>`;
}
export function renderMedia(data){
 const report=validateMediaLibrary(data.hymns);
 return `<section class="library-hero"><div class="container"><p class="eyebrow">V6.4</p><h1 style="font-size:clamp(50px,6vw,78px)">Media Library</h1><p class="lead">Organiza portadas, MP3 y videos con rutas consistentes.</p><div class="library-stats"><div class="stat"><strong>${data.media.length}</strong><p>Items</p></div><div class="stat"><strong>${data.hymns.length}</strong><p>Himnos</p></div><div class="stat"><strong>MP3</strong><p>Listo</p></div><div class="stat"><strong>Cover</strong><p>Listo</p></div></div></div></section>
 <section class="section"><div class="container">
  <div class="featured"><div class="panel"><p class="eyebrow">Carpetas</p><p><strong>Portadas:</strong> <span class="media-path">/assets/img/covers/</span></p><p><strong>Audio:</strong> <span class="media-path">/assets/audio/</span></p><p><strong>Video:</strong> <span class="media-path">/assets/video/</span></p><p class="muted">Usa nombres sin acentos ni espacios, igual al ID del himno.</p></div><div class="panel"><p class="eyebrow">Regla de nombres</p><pre class="admin-preview">fe-que-mueve-montanas.jpg
fe-que-mueve-montanas.mp3
fe-que-mueve-montanas.mp4</pre></div></div>
  <h3 style="font-size:34px;margin:34px 0 16px">Media registrada</h3><div class="media-grid">${data.media.map(mediaCard).join("")}</div>
  <h3 style="font-size:34px;margin:34px 0 16px">Rutas sugeridas por himno</h3><div class="list">${report.map(r=>`<article class="panel"><h3 style="font-size:26px">${r.title}</h3><div class="media-check"><span class="status-pill ${r.status.cover==='connected'?'status-good':'status-warn'}">Cover: ${r.status.cover}</span><span class="media-path">${r.cover}</span></div><div class="media-check"><span class="status-pill ${r.status.audio==='connected'?'status-good':'status-warn'}">Audio: ${r.status.audio}</span><span class="media-path">${r.audio}</span></div><div class="media-check"><span class="status-pill ${r.status.video==='youtube'?'status-good':'status-warn'}">Video: ${r.status.video}</span><span class="media-path">${r.video}</span></div></article>`).join("")}</div>
 </div></section>`;
}
