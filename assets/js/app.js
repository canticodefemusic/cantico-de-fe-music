
const $ = (s, scope=document) => scope.querySelector(s);
const $$ = (s, scope=document) => Array.from(scope.querySelectorAll(s));

document.addEventListener("DOMContentLoaded", () => {
  const menu = $(".menu-button");
  const nav = $(".nav");
  if(menu && nav){ menu.addEventListener("click", () => nav.classList.toggle("open")); }

  const theme = $(".theme-toggle");
  if(localStorage.getItem("cfmTheme") === "dark"){ document.body.classList.add("dark"); }
  if(theme){
    theme.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("cfmTheme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }

  $$("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      $$("[data-filter]").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const filter = (button.dataset.filter || "all").toLowerCase();
      $$("[data-category]").forEach(card => {
        const category = (card.dataset.category || "").toLowerCase();
        card.style.display = (filter === "all" || category.includes(filter)) ? "grid" : "none";
      });
    });
  });

  const search = $("#siteSearch");
  if(search){
    search.addEventListener("input", () => {
      const q = search.value.toLowerCase().trim();
      $$("[data-title]").forEach(card => {
        const title = (card.dataset.title || "").toLowerCase();
        card.style.display = title.includes(q) ? "grid" : "none";
      });
    });
  }

  const player = $("#audioPlayer");
  const playerTitle = $("#playerTitle");
  const playerMeta = $("#playerMeta");
  const playPause = $("#playPause");
  const closePlayer = $("#closePlayer");
  let playing = false;

  $$("[data-play-title]").forEach(btn => {
    btn.addEventListener("click", () => {
      if(player){
        player.classList.add("show");
        if(playerTitle) playerTitle.textContent = btn.dataset.playTitle || "Cántico de Fe Music";
        if(playerMeta) playerMeta.textContent = btn.dataset.playMeta || "Vista previa";
        playing = true;
        if(playPause) playPause.textContent = "❚❚";
      }
    });
  });

  if(playPause){
    playPause.addEventListener("click", () => {
      playing = !playing;
      playPause.textContent = playing ? "❚❚" : "▶";
    });
  }
  if(closePlayer){ closePlayer.addEventListener("click", () => player && player.classList.remove("show")); }

  $$("[data-video-open]").forEach(btn => {
    btn.addEventListener("click", () => alert("Aquí puedes conectar el video real de YouTube: " + (btn.dataset.videoOpen || "Video destacado")));
  });

  const contact = $("#contactForm");
  if(contact){
    contact.addEventListener("submit", e => {
      e.preventDefault();
      alert("Formulario listo. Después se puede conectar con Formspree, Cloudflare Workers o correo.");
    });
  }
});
