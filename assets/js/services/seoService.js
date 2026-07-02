
export function seoScore(item){let score=0,checks=[];const title=item.seo?.title||item.title||"",desc=item.seo?.description||item.description||"",keywords=item.seo?.keywords||item.tags||[],cover=item.cover||item.media?.coverPath||"",canonical=item.seo?.canonical||"";const add=(ok,label,points)=>{if(ok)score+=points;checks.push({ok,label,points})};add(title.length>=20&&title.length<=65,"Título SEO entre 20 y 65 caracteres",20);add(desc.length>=70&&desc.length<=160,"Descripción SEO entre 70 y 160 caracteres",25);add(keywords.length>=4,"Mínimo 4 keywords",15);add(Boolean(cover),"Imagen Open Graph o portada definida",15);add(Boolean(canonical),"Canonical definido",10);add(Boolean(item.reference),"Referencia bíblica definida",10);add(Boolean(item.lyrics?.length),"Letra presente",5);return{score:Math.min(score,100),checks}}
export function pageSeoPreview(item,siteUrl){const title=item.seo?.title||item.title,desc=item.seo?.description||item.description,url=`${siteUrl}/?page=hymn&id=${item.id}`;return{title,desc,url}}
export function generateMetaTags(item,siteUrl){const p=pageSeoPreview(item,siteUrl),image=item.cover||item.media?.coverPath||"/assets/img/covers/default-og.jpg";return `<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${p.url}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:type" content="${item.seo?.ogType||"music.song"}">
<meta property="og:url" content="${p.url}">
<meta property="og:image" content="${siteUrl}${image}">
<meta name="twitter:card" content="summary_large_image">`}
