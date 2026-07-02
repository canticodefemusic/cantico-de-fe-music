
export function setSiteSchema(settings){const n=document.querySelector("#schemaData");if(!n)return;n.textContent=JSON.stringify({"@context":"https://schema.org","@type":"MusicGroup","name":settings.siteName,"url":settings.siteUrl,"description":"Himnos cristianos originales, letras, videos, playlists y devocionales.","sameAs":[]})}
export function setPageMeta(title, description, image, canonical){
  if(title) document.title=title;
  const set=(selector,attr,value)=>{const el=document.querySelector(selector); if(el&&value) el.setAttribute(attr,value)};
  set('meta[name="description"]',"content",description);
  set('meta[property="og:title"]',"content",title);
  set('meta[property="og:description"]',"content",description);
  set('meta[name="twitter:title"]',"content",title);
  set('meta[name="twitter:description"]',"content",description);
  set('meta[property="og:image"]',"content",image);
  const link=document.querySelector('link[rel="canonical"]'); if(link&&canonical) link.setAttribute("href",canonical);
}
export function musicSchema(hymn, siteUrl="https://canticodefemusic.com"){return {"@context":"https://schema.org","@type":"MusicRecording","name":hymn.title,"url":`${siteUrl}/?page=hymn&id=${hymn.id}`,"byArtist":{"@type":"MusicGroup","name":hymn.author},"inAlbum":hymn.album,"duration":hymn.duration,"description":hymn.description,"keywords":(hymn.seo?.keywords||hymn.tags||[]).join(", ")}}
export function breadcrumbSchema(items){return {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":items.map((item,index)=>({"@type":"ListItem","position":index+1,"name":item.name,"item":item.url}))}}
