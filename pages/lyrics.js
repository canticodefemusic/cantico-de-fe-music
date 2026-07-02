
export function renderLyrics(data){
 return `<section class="section"><div class="container"><div class="section-head"><h2>Letras</h2><p>Todas las letras organizadas para leer y compartir.</p></div><div class="list">${data.hymns.map(h=>`<article class="panel"><p class="eyebrow">${h.reference}</p><h3 style="font-size:32px">${h.title}</h3>${h.lyrics.map(l=>l?`<p>${l}</p>`:"<br>").join("")}</article>`).join("")}</div></div></section>`;
}
