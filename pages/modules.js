
export function renderModules(data){
 const modules=[
  ["Core Store","Carga centralizada de datos desde /api/*.json."],
  ["Router","Rutas por query string para Cloudflare Pages."],
  ["Services","searchService y contentService para separar lógica."],
  ["Components","Header, footer, cards y reproductor reutilizables."],
  ["API JSON","Estructura preparada para futura base de datos."],
  ["PWA","Manifest y service worker base."],
  ["SEO","Sitemap, robots, Open Graph y Schema.org."],
  ["Admin","Generador de JSON y Schema para contenido."],
  ["Branch V6","Desarrollo aislado sin afectar main."]
 ];
 return `<section class="section"><div class="container"><div class="section-head"><h2>Infraestructura V6.1</h2><p>Esta versión organiza el proyecto para construir módulos profesionales encima.</p></div><div class="module-grid">${modules.map(([t,d])=>`<article class="card"><span class="status-pill">Activo</span><h3>${t}</h3><p class="muted">${d}</p></article>`).join("")}</div></div></section>`;
}
