
import { mapItems } from "/assets/js/services/contentService.js";
export function renderPlaylists(data){
 return `<section class="section"><div class="container"><div class="section-head"><h2>Playlists</h2><p>Listas de reproducción por tema y propósito.</p></div><div class="playlist-grid">${data.playlists.map(p=>{const items=mapItems(p.items,data.hymns);return `<article class="card"><div class="cover">♫</div><span class="badge">${items.length} himnos</span><h3>${p.title}</h3><p class="muted">${p.description}</p><button class="btn primary" data-playlist="${p.id}">▶ Reproducir</button></article>`}).join("")}</div></div></section>`;
}
