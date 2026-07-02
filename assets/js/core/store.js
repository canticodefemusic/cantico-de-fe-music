
export const Store = {
  data: { hymns: [], devotionals: [], playlists: [], albums: [], settings: {} },
  async load(){
    const [hymns, devotionals, playlists, albums, settings] = await Promise.all([
      fetch("/assets/data/hymns.json").then(r=>r.json()),
      fetch("/assets/data/devotionals.json").then(r=>r.json()),
      fetch("/assets/data/playlists.json").then(r=>r.json()),
      fetch("/assets/data/albums.json").then(r=>r.json()),
      fetch("/assets/data/settings.json").then(r=>r.json())
    ]);
    this.data = { hymns, devotionals, playlists, albums, settings };
    return this.data;
  }
};
