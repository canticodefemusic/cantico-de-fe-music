
export const slugify=text=>text.toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
export function buildHymn(values){
  const title=values.title||"Nuevo Himno";
  const id=values.id||slugify(title);
  const theme=values.theme||"Fe";
  const reference=values.reference||"Salmo 96:1";
  const description=values.description||`${title} es un himno cristiano de ${theme.toLowerCase()} inspirado en ${reference}.`;
  const cover=values.cover || `/assets/img/covers/${id}.jpg`;
  const audioUrl=values.audioUrl || `/assets/audio/${id}.mp3`;
  return {
    id,title,subtitle:values.subtitle||`Himno cristiano de ${theme.toLowerCase()}`,theme,
    author:values.author||"Cántico de Fe Music",year:values.year||"2026",duration:values.duration||"4:00",reference,
    album:values.album||"Nuevo Álbum",
    playlists:(values.playlists||"Fe y Esperanza").split(",").map(x=>slugify(x.trim())).filter(Boolean),
    tags:(values.tags||`${theme}, himno cristiano, música cristiana`).split(",").map(x=>x.trim()).filter(Boolean),
    featured:Boolean(values.featured),popular:Boolean(values.popular),description,
    lyrics:(values.lyrics||"Primera línea").split("\n"),
    audioUrl,youtubeUrl:values.youtubeUrl||"",cover,
    media:{coverStatus:cover?"connected":"pending",audioStatus:audioUrl?"connected":"pending",videoStatus:values.youtubeUrl?"youtube":"pending",coverPath:cover,audioPath:audioUrl},
    seo:{title:`${title} | Himno Cristiano`,description,keywords:[title,theme,reference,"himno cristiano","música cristiana","Cántico de Fe Music"],canonical:`/?page=hymn&id=${id}`,ogType:"music.song"}
  };
}
export function getSaved(){return JSON.parse(localStorage.getItem("cantico_hymns_drafts")||"[]")}
export function saveHymn(hymn){const items=getSaved();const i=items.findIndex(x=>x.id===hymn.id);if(i>=0)items[i]=hymn;else items.push(hymn);localStorage.setItem("cantico_hymns_drafts",JSON.stringify(items));return items}
export function deleteSaved(id){const items=getSaved().filter(x=>x.id!==id);localStorage.setItem("cantico_hymns_drafts",JSON.stringify(items));return items}
export function exportHymns(filename, baseHymns=[]){const all=[...baseHymns,...getSaved()];const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(all,null,2)],{type:"application/json"}));a.download=filename;a.click();URL.revokeObjectURL(a.href)}
export function copyText(text){return navigator.clipboard.writeText(text)}
