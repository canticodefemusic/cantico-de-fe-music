
import { buildHymn, saveHymn, deleteSaved, getSaved, exportHymns, copyText } from "/assets/js/services/cmsService.js";
import { seoScore } from "/assets/js/services/seoService.js";

function values(){
  const v=id=>document.querySelector(id)?.value?.trim()||"";
  return {
    title:v("#cmsTitle"),id:v("#cmsId"),subtitle:v("#cmsSubtitle"),theme:v("#cmsTheme"),
    reference:v("#cmsReference"),album:v("#cmsAlbum"),duration:v("#cmsDuration"),
    author:v("#cmsAuthor"),year:v("#cmsYear"),playlists:v("#cmsPlaylists"),tags:v("#cmsTags"),
    cover:v("#cmsCover"),audioUrl:v("#cmsAudio"),youtubeUrl:v("#cmsYoutube"),
    description:v("#cmsDescription"),lyrics:v("#cmsLyrics"),
    featured:document.querySelector("#cmsFeatured")?.checked,
    popular:document.querySelector("#cmsPopular")?.checked
  };
}
function preview(h){
  const score=seoScore(h).score;
  return `<div class="cms-preview-card">
    <div class="cms-preview-cover">${h.cover ? `<span>🖼</span>` : "♪"}</div>
    <span class="status-pill ${score>=80?'status-good':score>=55?'status-warn':'status-bad'}">SEO ${score}</span>
    <h3 style="font-size:34px;margin-top:12px">${h.title}</h3>
    <p class="muted">${h.subtitle}</p>
    <div class="badges"><span class="badge">${h.theme}</span><span class="badge">${h.reference}</span><span class="badge">${h.duration}</span></div>
    <p>${h.description}</p>
    <div class="media-path">${h.cover}</div>
    <div class="media-path">${h.audioUrl}</div>
  </div>`;
}
function savedHtml(items){
  return items.length ? items.map(h=>`<div class="saved-item"><div><strong>${h.title}</strong><br><small class="muted">${h.id}</small></div><button class="btn danger" data-delete-draft="${h.id}">Borrar</button></div>`).join("") : `<p class="muted">Todavía no tienes himnos guardados.</p>`;
}
export function renderCms(data){
  setTimeout(()=>{
    const form=document.querySelector("#cmsForm"), out=document.querySelector("#cmsPreview"), json=document.querySelector("#cmsJson"), saved=document.querySelector("#savedList"), toast=document.querySelector("#cmsToast");
    const draw=()=>{const h=buildHymn(values());out.innerHTML=preview(h);json.textContent=JSON.stringify(h,null,2)};
    form.querySelectorAll("input,textarea,select").forEach(el=>el.addEventListener("input",draw));
    form.querySelectorAll("input[type=checkbox]").forEach(el=>el.addEventListener("change",draw));
    document.querySelector("#cmsTitle").addEventListener("input",()=>{const t=document.querySelector("#cmsTitle").value; const id=t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""); if(!document.querySelector("#cmsId").dataset.manual){document.querySelector("#cmsId").value=id;document.querySelector("#cmsCover").value=`/assets/img/covers/${id}.jpg`;document.querySelector("#cmsAudio").value=`/assets/audio/${id}.mp3`}});
    document.querySelector("#cmsId").addEventListener("input",e=>e.target.dataset.manual="1");
    document.querySelector("#saveDraft").onclick=()=>{const h=buildHymn(values());const items=saveHymn(h);saved.innerHTML=savedHtml(items);toast.textContent="✓ Himno guardado en tu navegador";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2500)};
    document.querySelector("#downloadJson").onclick=()=>exportHymns("hymns.json",data.hymns);
    document.querySelector("#copyJson").onclick=async()=>{await copyText(json.textContent);toast.textContent="✓ JSON copiado";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2500)};
    document.addEventListener("click",e=>{const b=e.target.closest("[data-delete-draft]");if(b){saved.innerHTML=savedHtml(deleteSaved(b.dataset.deleteDraft));}});
    saved.innerHTML=savedHtml(getSaved());
    draw();
  });
  return `<section class="library-hero"><div class="container"><p class="eyebrow">V7.1</p><h1 style="font-size:clamp(50px,6vw,78px)">CMS Fácil</h1><p class="lead">Crea himnos sin editar código. Guarda borradores y descarga hymns.json listo para subirlo a GitHub.</p><div class="library-stats"><div class="stat"><strong>1</strong><p>Llena</p></div><div class="stat"><strong>2</strong><p>Guarda</p></div><div class="stat"><strong>3</strong><p>Descarga</p></div><div class="stat"><strong>4</strong><p>Sube</p></div></div></div></section>
  <section class="section"><div class="container">
    <div class="help-box"><strong>Importante:</strong> por seguridad del navegador, el sitio no puede escribir directamente en GitHub. Pero sí puede guardar borradores y descargar el archivo <strong>hymns.json</strong> listo para reemplazarlo en GitHub.</div>
    <div id="cmsToast" class="cms-toast"></div>
    <div class="cms-layout" style="margin-top:24px">
      <div class="panel">
        <div class="cms-steps"><span class="cms-step active">Datos</span><span class="cms-step">Media</span><span class="cms-step">SEO</span><span class="cms-step">Guardar</span></div>
        <form id="cmsForm" class="admin-form">
          <div class="field"><label>Título del himno</label><input class="input" id="cmsTitle" placeholder="Fe que Mueve Montañas"></div>
          <div class="field"><label>ID automático</label><input class="input" id="cmsId" placeholder="fe-que-mueve-montanas"></div>
          <div class="field"><label>Subtítulo</label><input class="input" id="cmsSubtitle" placeholder="Himno de fe y esperanza"></div>
          <div class="field"><label>Tema</label><select id="cmsTheme"><option>Fe</option><option>Esperanza</option><option>Adoración</option><option>Oración</option><option>Gratitud</option></select></div>
          <div class="field"><label>Referencia bíblica</label><input class="input" id="cmsReference" placeholder="Mateo 17:20"></div>
          <div class="field"><label>Duración</label><input class="input" id="cmsDuration" placeholder="4:00"></div>
          <div class="field"><label>Álbum</label><input class="input" id="cmsAlbum" placeholder="Nuevo Álbum"></div>
          <div class="field"><label>Año</label><input class="input" id="cmsYear" value="2026"></div>
          <div class="field"><label>Autor</label><input class="input" id="cmsAuthor" value="Cántico de Fe Music"></div>
          <div class="field"><label>Playlists</label><input class="input" id="cmsPlaylists" placeholder="Fe y Esperanza, Historias Bíblicas"></div>
          <div class="field"><label>Keywords</label><input class="input" id="cmsTags" placeholder="fe, esperanza, himno cristiano"></div>
          <div class="field"><label>Portada</label><input class="input" id="cmsCover" placeholder="/assets/img/covers/id.jpg"></div>
          <div class="field"><label>MP3</label><input class="input" id="cmsAudio" placeholder="/assets/audio/id.mp3"></div>
          <div class="field"><label>YouTube</label><input class="input" id="cmsYoutube" placeholder="https://youtube.com/..."></div>
          <div class="field full"><label>Descripción</label><textarea id="cmsDescription" rows="3" placeholder="Descripción breve para SEO..."></textarea></div>
          <div class="field full"><label>Letra</label><textarea id="cmsLyrics" rows="9" placeholder="Escribe la letra línea por línea"></textarea></div>
          <label><input type="checkbox" id="cmsFeatured"> Destacado</label>
          <label><input type="checkbox" id="cmsPopular"> Popular</label>
        </form>
        <div class="cms-actions">
          <button class="btn success" id="saveDraft">💾 Guardar himno</button>
          <button class="btn primary" id="downloadJson">⬇ Descargar hymns.json</button>
          <button class="btn" id="copyJson">Copiar JSON</button>
        </div>
      </div>
      <aside>
        <div id="cmsPreview"></div>
        <div class="panel" style="margin-top:18px"><p class="eyebrow">Himnos guardados</p><div id="savedList" class="saved-list"></div></div>
      </aside>
    </div>
    <details class="panel" style="margin-top:24px"><summary><strong>Ver JSON técnico</strong></summary><pre id="cmsJson" class="admin-preview"></pre></details>
  </div></section>`;
}
