
import { seoScore, pageSeoPreview, generateMetaTags } from "/assets/js/services/seoService.js";
import { musicSchema } from "/assets/js/utils/seo.js";

function scoreCard(h, siteUrl){
 const s=seoScore(h), p=pageSeoPreview(h, siteUrl);
 return `<article class="panel"><div class="featured" style="grid-template-columns:150px 1fr"><div><div class="seo-score">${s.score}</div><span class="status-pill ${s.score>=80?'status-good':s.score>=55?'status-warn':'status-bad'}">SEO Score</span></div><div><h3 style="font-size:30px">${h.title}</h3><div class="seo-preview"><div class="seo-preview-title">${p.title}</div><div class="seo-preview-url">${p.url}</div><div class="seo-preview-desc">${p.desc}</div></div><div class="validation-list">${s.checks.map(c=>`<div class="checkline"><span class="status-pill ${c.ok?'status-good':'status-warn'}">${c.ok?'✓':'!'}</span> ${c.label}</div>`).join("")}</div></div></div></article>`;
}
export function renderSeo(data){
 const siteUrl=data.settings.siteUrl;
 return `<section class="library-hero"><div class="container"><p class="eyebrow">V6.5</p><h1 style="font-size:clamp(50px,6vw,78px)">SEO Avanzado</h1><p class="lead">Revisión de SEO, metadata, Schema.org, Open Graph y checklist para Google Search Console.</p><div class="library-stats"><div class="stat"><strong>${data.hymns.length}</strong><p>Himnos</p></div><div class="stat"><strong>Schema</strong><p>Activo</p></div><div class="stat"><strong>OG</strong><p>Activo</p></div><div class="stat"><strong>XML</strong><p>Sitemap</p></div></div></div></section>
 <section class="section"><div class="container">
  <div class="featured"><div class="panel"><p class="eyebrow">Archivos SEO</p><p><strong>Sitemap:</strong> <span class="media-path">/sitemap.xml</span></p><p><strong>Robots:</strong> <span class="media-path">/robots.txt</span></p><p><strong>Config:</strong> <span class="media-path">/api/seo.json</span></p><a class="btn primary" href="/seo/seo-checklist.md">Checklist SEO</a></div><div class="panel"><p class="eyebrow">Google Preview</p><div class="seo-preview"><div class="seo-preview-title">${data.seo.defaultTitle}</div><div class="seo-preview-url">${siteUrl}</div><div class="seo-preview-desc">${data.seo.defaultDescription}</div></div></div></div>
  <h3 style="font-size:34px;margin:34px 0 16px">SEO por himno</h3><div class="list">${data.hymns.map(h=>scoreCard(h,siteUrl)).join("")}</div>
  <h3 style="font-size:34px;margin:34px 0 16px">Meta Tags del primer himno</h3><pre class="admin-preview">${generateMetaTags(data.hymns[0], siteUrl).replaceAll("<","&lt;").replaceAll(">","&gt;")}</pre>
  <h3 style="font-size:34px;margin:34px 0 16px">Schema del primer himno</h3><pre class="admin-preview">${JSON.stringify(musicSchema(data.hymns[0], siteUrl), null, 2)}</pre>
 </div></section>`;
}
