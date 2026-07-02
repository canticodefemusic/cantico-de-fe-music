export class Hymn {
  constructor(data = {}){
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.author = data.author ?? '';
    this.lyrics = data.lyrics ?? '';
    this.chords = data.chords ?? '';
    this.scripture = data.scripture ?? '';
    this.category = data.category ?? '';
    this.audio = data.audio ?? '';
    this.video = data.video ?? '';
    this.sheetMusic = data.sheetMusic ?? '';
    this.tags = data.tags ?? [];
  }
}
