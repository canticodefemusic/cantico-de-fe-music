
export function renderModules(data){
 const modules=[
  ["Core","Router, Store y carga de datos separados."],
  ["Componentes","Header, footer y reproductor reutilizables."],
  ["Biblioteca","Himnos buscables por tema, letra y referencia."],
  ["Admin","Generador de JSON y SEO para contenido."],
  ["SEO","Sitemap, robots, Open Graph y Schema.org."],
  ["PWA","Manifest y base para app instalable."]
 ];
 return `<section class="section"><div class="container"><div class="section-head"><h2>Módulos V6.0</h2><p>La plataforma queda dividida por módulos para crecer sin romper el sitio.</p></div><div class="module-grid">${modules.map(([t,d])=>`<article class="card"><span class="status-pill">Activo</span><h3>${t}</h3><p class="muted">${d}</p></article>`).join("")}</div></div></section>`;
}
