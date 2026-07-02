export class AlbumsModule {
  constructor() {
    this.albums = [];
  }

  create(album) {
    this.albums.push(album);
    return album;
  }

  list() {
    return [...this.albums];
  }

  find(id) {
    return this.albums.find(a => a.id === id);
  }

  update(id, changes) {
    const album = this.find(id);
    if (!album) return null;
    Object.assign(album, changes);
    return album;
  }

  remove(id) {
    this.albums = this.albums.filter(a => a.id !== id);
  }
}
