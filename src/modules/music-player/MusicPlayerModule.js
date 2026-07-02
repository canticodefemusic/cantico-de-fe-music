export class MusicPlayerModule {
  constructor() {
    this.audio = new Audio();
    this.currentTrack = null;
    this.queue = [];
  }

  load(track) {
    this.currentTrack = track;
    this.audio.src = track.url;
  }

  play() {
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  addToQueue(track) {
    this.queue.push(track);
  }

  next() {
    if (!this.queue.length) return;
    this.load(this.queue.shift());
    return this.play();
  }
}
