
import { Store } from "/assets/js/core/store.js";
import { Router } from "/assets/js/core/router.js";
import { setSiteSchema } from "/assets/js/utils/seo.js";
import { mapItems } from "/assets/js/services/contentService.js";
import { renderHeader } from "/components/header.js";
import { renderFooter } from "/components/footer.js";
import { renderPlayer,setQueue,nextSong,prevSong,togglePlay } from "/components/player.js";
import { renderHome } from "/pages/home.js";
import { renderHymns,renderHymnDetail } from "/pages/hymns.js";
import { renderLyrics } from "/pages/lyrics.js";
import { renderPlaylists } from "/pages/playlists.js";
import { renderAlbums } from "/pages/albums.js";
import { renderVideos } from "/pages/videos.js";
import { renderDevotionals } from "/pages/devotionals.js";
import { renderModules } from "/pages/modules.js";
import { renderAdmin } from "/pages/admin.js";

const App={
 async start(){
  const data=await Store.load();
  setSiteSchema(data.settings);
  document.querySelector("#app").innerHTML=`${renderHeader(data.settings)}<main id="main"></main>${renderFooter(data.settings)}${renderPlayer()}`;
  document.querySelector("#main").innerHTML=this.renderRoute(data);
  this.bind(data);
 },
 renderRoute(data){
  const page=Router.page(), id=Router.id();
  const routes={
    home:()=>renderHome(data),
    hymns:()=>renderHymns(data),
    hymn:()=>renderHymnDetail(data,id),
    lyrics:()=>renderLyrics(data),
    playlists:()=>renderPlaylists(data),
    albums:()=>renderAlbums(data),
    videos:()=>renderVideos(data),
    devotionals:()=>renderDevotionals(data),
    modules:()=>renderModules(data),
    admin:()=>renderAdmin(data)
  };
  return (routes[page]||routes.home)();
 },
 bind(data){
  document.querySelector(".mobile-toggle")?.addEventListener("click",()=>document.querySelector(".menu")?.classList.toggle("open"));
  document.querySelector("#themeToggle")?.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.theme=document.body.classList.contains("dark")?"dark":"light"});
  if(localStorage.theme==="dark")document.body.classList.add("dark");
  document.addEventListener("click",event=>{
    const play=event.target.closest("[data-play]");
    if(play){const id=play.dataset.play,start=data.hymns.findIndex(h=>h.id===id);setQueue(data.hymns,start<0?0:start)}
    if(event.target.closest("[data-next]"))nextSong();
    if(event.target.closest("[data-prev]"))prevSong();
    if(event.target.closest("[data-toggle]"))togglePlay();
    const playlist=event.target.closest("[data-playlist]");
    if(playlist){const list=data.playlists.find(p=>p.id===playlist.dataset.playlist);const hymns=mapItems(list.items,data.hymns);setQueue(hymns,0)}
    const album=event.target.closest("[data-album]");
    if(album){const list=data.albums.find(a=>a.id===album.dataset.album);const hymns=mapItems(list.items,data.hymns);setQueue(hymns,0)}
  });
 }
};
window.App=App;
App.start();
