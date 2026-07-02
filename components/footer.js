
export function renderFooter(settings){
  return `<footer class="footer"><div class="container footer-grid"><div><h3 style="color:white">${settings.siteName||"Cántico de Fe Music"}</h3><p>Plataforma modular de himnos, letras, videos, playlists y devocionales.</p></div><div><h3 style="color:white;font-size:24px">V6.1</h3><p><a href="/?page=modules">Infraestructura</a></p><p><a href="/?page=admin">Admin</a></p><p><a href="/sitemap.xml">Sitemap</a></p></div><div><h3 style="color:white;font-size:24px">Contacto</h3><p>${settings.email||"contacto@canticodefemusic.com"}</p></div></div></footer>`;
}
