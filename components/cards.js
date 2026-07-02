
export function hymnRow(h){
  return `<article class="hymn-row"><div class="thumb">▶</div><div><h3 style="font-size:22px;margin:0">${h.title}</h3><p class="muted" style="margin:5px 0 0">${h.subtitle}</p><div class="badges"><span class="badge">${h.theme}</span><span class="badge">${h.reference}</span><span class="badge">${h.album}</span><span class="badge">Player V6.2</span></div></div><div class="btns" style="display:flex;gap:8px;align-items:center"><button class="btn" data-play="${h.id}">▶</button><a class="btn" href="/?page=hymn&id=${h.id}">Ver</a></div></article>`;
}
export function simpleCard(icon, title, text, href){
  return `<a class="card" href="${href||'#'}"><div class="big">${icon}</div><h3>${title}</h3><p class="muted">${text}</p></a>`;
}
