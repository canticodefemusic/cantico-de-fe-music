export class BasicPlayer {
  constructor() {
    this.audio = new Audio();
    this.currentTrack = null;
  }

  load(track) {
    this.currentTrack = track;
    this.audio.src = track.audio || track.url || '';
  }

  play() {
    if (!this.audio.src) return Promise.resolve(false);
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setVolume(value) {
    this.audio.volume = Math.max(0, Math.min(1, value));
  }
}
