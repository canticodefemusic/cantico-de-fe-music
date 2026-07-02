
export const Store = {
  data: { hymns: [], playlists: [], albums: [], videos: [], devotionals: [], media: [], seo: {}, dashboard: {}, settings: {} },
  async load(){
    const [hymns, playlists, albums, videos, devotionals, media, seo, dashboard, settings] = await Promise.all([
      fetch("/api/hymns.json").then(r=>r.json()), fetch("/api/playlists.json").then(r=>r.json()),
      fetch("/api/albums.json").then(r=>r.json()), fetch("/api/videos.json").then(r=>r.json()),
      fetch("/api/devotionals.json").then(r=>r.json()), fetch("/api/media.json").then(r=>r.json()),
      fetch("/api/seo.json").then(r=>r.json()), fetch("/api/dashboard.json").then(r=>r.json()),
      fetch("/api/settings.json").then(r=>r.json())
    ]);
    const local = JSON.parse(localStorage.getItem("cantico_hymns_drafts") || "[]");
    this.data = { hymns, playlists, albums, videos, devotionals, media, seo, dashboard, settings, localDrafts: local };
    return this.data;
  }
};
