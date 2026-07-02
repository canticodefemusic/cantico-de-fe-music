
export const Store = {
  data: { hymns: [], playlists: [], albums: [], videos: [], devotionals: [], settings: {} },
  async load(){
    const [hymns, playlists, albums, videos, devotionals, settings] = await Promise.all([
      fetch("/api/hymns.json").then(r=>r.json()),
      fetch("/api/playlists.json").then(r=>r.json()),
      fetch("/api/albums.json").then(r=>r.json()),
      fetch("/api/videos.json").then(r=>r.json()),
      fetch("/api/devotionals.json").then(r=>r.json()),
      fetch("/api/settings.json").then(r=>r.json())
    ]);
    this.data = { hymns, playlists, albums, videos, devotionals, settings };
    return this.data;
  }
};
