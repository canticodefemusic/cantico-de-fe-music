
export function renderModules(data){
 const modules=[["PlayerService","Audio real, cola, progreso, volumen, repeat y shuffle."],["Core Store","Carga centralizada desde /api/*.json."],["Router","Rutas por query string para Cloudflare Pages."],["Services","Búsqueda y relaciones separadas."],["API JSON","Estructura preparada para base de datos."],["PWA","Manifest y service worker base."],["SEO","Sitemap, robots y Schema.org."],["Admin","Generador de JSON y Schema."],["Branch V6","Desarrollo aislado sin afectar main."]];
 return `<section class="section"><div class="container"><div class="section-head"><h2>Módulos V6.2</h2><p>Esta versión agrega el reproductor avanzado sobre la infraestructura V6.1.</p></div><div class="module-grid">${modules.map(([t,d])=>`<article class="card"><span class="status-pill">Activo</span><h3>${t}</h3><p class="muted">${d}</p></article>`).join("")}</div></div></section>`;
}
