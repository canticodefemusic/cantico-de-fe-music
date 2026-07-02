export class Track {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.artist = data.artist ?? '';
    this.album = data.album ?? '';
    this.duration = data.duration ?? 0;
    this.url = data.url ?? '';
    this.cover = data.cover ?? '';
  }
}
