
export function setSiteSchema(settings){
  const node = document.querySelector("#schemaData");
  if(!node) return;
  node.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": settings.siteName,
    "url": settings.siteUrl,
    "description": "Himnos cristianos originales, letras, videos, playlists y devocionales."
  });
}
export function setPageMeta(title, description){
  if(title) document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if(meta && description) meta.setAttribute("content", description);
}
