export class Album {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.artist = data.artist ?? '';
    this.genre = data.genre ?? '';
    this.releaseDate = data.releaseDate ?? '';
    this.cover = data.cover ?? '';
    this.description = data.description ?? '';
    this.tracks = data.tracks ?? [];
  }
}
