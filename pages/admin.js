
export function renderAdmin(data){
  const template = {
    id: "nuevo-himno",
    title: "Nuevo Himno",
    subtitle: "Subtítulo del himno",
    theme: "Fe",
    author: "Cántico de Fe Music",
    year: "2026",
    duration: "4:00",
    reference: "Salmo 96:1",
    album: "Nuevo Álbum",
    playlists: ["Fe y Esperanza"],
    tags: ["fe", "esperanza"],
    featured: false,
    popular: false,
    description: "Descripción breve del himno.",
    lyrics: ["Primera línea", "Segunda línea"],
    audioUrl: "",
    youtubeUrl: "",
    cover: ""
  };

  setTimeout(() => {
    const form = document.querySelector("#adminForm");
    const preview = document.querySelector("#jsonPreview");
    const update = () => {
      const obj = {
        ...template,
        id: document.querySelector("#newId").value || "nuevo-himno",
        title: document.querySelector("#newTitle").value || "Nuevo Himno",
        theme: document.querySelector("#newTheme").value || "Fe",
        reference: document.querySelector("#newReference").value || "Salmo 96:1",
        lyrics: (document.querySelector("#newLyrics").value || "Primera línea").split("\\n")
      };
      preview.textContent = JSON.stringify(obj, null, 2);
    };
    form.querySelectorAll("input,textarea,select").forEach(el => el.addEventListener("input", update));
    update();
  });

  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>Admin V5.3</h2>
          <p>Generador visual para crear datos limpios y pegarlos en assets/data/hymns.json.</p>
        </div>
        <div class="featured">
          <div class="panel">
            <form id="adminForm" class="admin-form">
              <input class="input" id="newId" placeholder="id-del-himno">
              <input class="input" id="newTitle" placeholder="Título del himno">
              <input class="input" id="newTheme" placeholder="Tema">
              <input class="input" id="newReference" placeholder="Referencia bíblica">
              <textarea class="full" id="newLyrics" rows="9" placeholder="Letra del himno, línea por línea"></textarea>
            </form>
          </div>
          <div class="panel">
            <p class="eyebrow">JSON generado</p>
            <pre id="jsonPreview" class="admin-preview"></pre>
          </div>
        </div>
      </div>
    </section>
  `;
}
