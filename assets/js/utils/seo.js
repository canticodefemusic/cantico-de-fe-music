
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
export function musicSchema(hymn){
  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": hymn.title,
    "byArtist": {"@type":"MusicGroup","name":hymn.author},
    "inAlbum": hymn.album,
    "duration": hymn.duration,
    "description": hymn.description,
    "keywords": (hymn.seo?.keywords || hymn.tags || []).join(", ")
  };
}
