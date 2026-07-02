
import { musicSchema } from "/assets/js/utils/seo.js";
import { buildHymnFromForm, exportJSON, parseImportedJSON, validateLibrary, generatePlaylistFromTheme, generateAlbum } from "/assets/js/services/adminService.js";

function tabScript(){
  document.querySelectorAll(".admin-tab").forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll(".admin-tab").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".admin-section").forEach(s=>s.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`#${btn.dataset.tab}`).classList.add("active");
    };
  });
}

function renderValidation(results){
  return results.map(r=>{
    const cls = r.errors.length ? "status-bad" : (r.warnings.length ? "status-warn" : "status-good");
    const msg = r.errors.length ? r.errors.join(" ") : (r.warnings.length ? r.warnings.join(" ") : "Correcto");
    return `<div class="validation-item"><span class="status-pill ${cls}">${r.hymn.title}</span><p class="muted" style="margin:8px 0 0">${msg}</p></div>`;
  }).join("");
}

export function renderAdmin(data){
 setTimeout(()=>{
  tabScript();
  const form=document.querySelector("#adminForm"), jsonPreview=document.querySelector("#jsonPreview"), schemaPreview=document.querySelector("#schemaPreview"), idInput=document.querySelector("#hymnId"), titleInput=document.querySelector("#title");
  const update=()=>{if(!idInput.value&&titleInput.value) idInput.value=titleInput.value.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""); const h=buildHymnFromForm(); jsonPreview.textContent=JSON.stringify(h,null,2); schemaPreview.textContent=JSON.stringify(musicSchema(h),null,2);};
  form.querySelectorAll("input,textarea,select").forEach(el=>el.addEventListener("input",update));
  form.querySelectorAll("input[type=checkbox]").forEach(el=>el.addEventListener("change",update));
  document.querySelector("#copyJson").onclick=async()=>{await navigator.clipboard.writeText(jsonPreview.textContent);alert("JSON copiado")};
  document.querySelector("#copySchema").onclick=async()=>{await navigator.clipboard.writeText(schemaPreview.textContent);alert("Schema copiado")};
  document.querySelector("#exportHymns").onclick=()=>exportJSON("hymns.json",data.hymns);
  document.querySelector("#exportPlaylists").onclick=()=>exportJSON("playlists.json",data.playlists);
  document.querySelector("#exportAlbums").onclick=()=>exportJSON("albums.json",data.albums);
  document.querySelector("#validateLibrary").onclick=()=>{document.querySelector("#validationResults").innerHTML=renderValidation(validateLibrary(data.hymns));};
  document.querySelector("#importText").addEventListener("input",e=>{
    try{
      const imported=parseImportedJSON(e.target.value);
      document.querySelector("#importResults").innerHTML=`<span class="status-pill status-good">${imported.length} elemento(s) válidos</span><pre class="admin-preview">${JSON.stringify(imported,null,2)}</pre>`;
    }catch(err){
      document.querySelector("#importResults").innerHTML=`<span class="status-pill status-bad">JSON inválido</span><p class="muted">${err.message}</p>`;
    }
  });
  document.querySelector("#generatePlaylist").onclick=()=>{
    const theme=document.querySelector("#playlistTheme").value;
    const playlist=generatePlaylistFromTheme(data.hymns,theme);
    document.querySelector("#generatorResults").innerHTML=`<pre class="admin-preview">${JSON.stringify(playlist,null,2)}</pre>`;
  };
  document.querySelector("#generateAlbum").onclick=()=>{
    const title=document.querySelector("#albumTitle").value || "Nuevo Álbum";
    const album=generateAlbum(title,data.hymns);
    document.querySelector("#generatorResults").innerHTML=`<pre class="admin-preview">${JSON.stringify(album,null,2)}</pre>`;
  };
  update();
 });

 const themes=[...new Set(data.hymns.map(h=>h.theme))];
 return `<section class="section"><div class="container"><div class="section-head"><h2>Admin V6.3</h2><p>Importar, exportar, validar duplicados y generar playlists/álbumes.</p></div>
 <div class="admin-tabs">
  <button class="admin-tab active" data-tab="newHymn">Nuevo Himno</button>
  <button class="admin-tab" data-tab="importExport">Importar / Exportar</button>
  <button class="admin-tab" data-tab="validate">Validar</button>
  <button class="admin-tab" data-tab="generators">Generadores</button>
 </div>

 <section class="admin-section active" id="newHymn">
  <div class="admin-shell"><aside class="admin-nav panel"><p class="eyebrow">Nuevo himno</p><button class="btn primary">JSON + SEO</button><a class="btn" href="/?page=player">Player</a><a class="btn" href="/api/hymns.json">API Himnos</a></aside><div>
   <div class="panel"><form id="adminForm" class="admin-form">
    <div class="field"><label>Título</label><input class="input" id="title" placeholder="Fe que Mueve Montañas"></div><div class="field"><label>ID automático</label><input class="input" id="hymnId"></div>
    <div class="field"><label>Subtítulo</label><input class="input" id="subtitle"></div><div class="field"><label>Tema</label><select id="theme">${themes.map(t=>`<option>${t}</option>`).join("")}<option>Adoración</option><option>Gratitud</option><option>Oración</option></select></div>
    <div class="field"><label>Autor</label><input class="input" id="author" value="Cántico de Fe Music"></div><div class="field"><label>Año</label><input class="input" id="year" value="2026"></div>
    <div class="field"><label>Duración</label><input class="input" id="duration" placeholder="4:32"></div><div class="field"><label>Referencia bíblica</label><input class="input" id="reference" placeholder="Mateo 17:20"></div>
    <div class="field"><label>Álbum</label><input class="input" id="album"></div><div class="field"><label>Playlists</label><input class="input" id="playlists"></div>
    <div class="field"><label>Tags/Keywords</label><input class="input" id="tags"></div><div class="field"><label>Portada</label><input class="input" id="cover"></div>
    <div class="field"><label>Audio MP3</label><input class="input" id="audioUrl" placeholder="/assets/audio/nombre-del-himno.mp3"></div><div class="field"><label>YouTube</label><input class="input" id="youtubeUrl"></div>
    <div class="field full"><label>Descripción SEO</label><textarea id="description" rows="3"></textarea></div><div class="field full"><label>Letra</label><textarea id="lyrics" rows="10"></textarea></div>
    <label><input type="checkbox" id="featured"> Destacado</label><label><input type="checkbox" id="popular"> Popular</label>
   </form></div>
   <div class="featured" style="margin-top:24px"><div class="panel"><p class="eyebrow">Schema.org</p><pre id="schemaPreview" class="admin-preview"></pre><button class="btn" id="copySchema">Copiar Schema</button></div><div class="panel"><p class="eyebrow">JSON generado</p><pre id="jsonPreview" class="admin-preview"></pre><button class="btn primary" id="copyJson">Copiar JSON</button></div></div>
  </div></div>
 </section>

 <section class="admin-section" id="importExport">
  <div class="featured"><div class="panel"><p class="eyebrow">Exportar</p><p class="muted">Descarga los archivos actuales para editarlos o guardarlos como copia.</p><div class="hero-buttons"><button class="btn primary" id="exportHymns">Exportar hymns.json</button><button class="btn" id="exportPlaylists">Exportar playlists.json</button><button class="btn" id="exportAlbums">Exportar albums.json</button></div></div><div class="panel"><p class="eyebrow">Importar / Probar JSON</p><textarea id="importText" rows="10" placeholder="Pega aquí un himno JSON o un array de himnos..."></textarea><div id="importResults" style="margin-top:16px"></div></div></div>
 </section>

 <section class="admin-section" id="validate">
  <div class="panel"><p class="eyebrow">Validar biblioteca</p><p class="muted">Detecta IDs duplicados, títulos faltantes, letras vacías y campos importantes.</p><button class="btn primary" id="validateLibrary">Validar ahora</button><div id="validationResults" class="validation-list"></div></div>
 </section>

 <section class="admin-section" id="generators">
  <div class="featured"><div class="panel"><p class="eyebrow">Generar playlist por tema</p><select id="playlistTheme">${themes.map(t=>`<option>${t}</option>`).join("")}</select><button class="btn primary" id="generatePlaylist" style="margin-top:14px">Generar Playlist</button><hr style="border:0;border-top:1px solid var(--line);margin:24px 0"><p class="eyebrow">Generar álbum con todos los himnos</p><input class="input" id="albumTitle" placeholder="Nuevo Álbum"><button class="btn primary" id="generateAlbum" style="margin-top:14px">Generar Álbum</button></div><div class="panel"><p class="eyebrow">Resultado</p><div id="generatorResults"><p class="muted">Aquí aparecerá el JSON generado.</p></div></div></div>
 </section>
 </div></section>`;
}
