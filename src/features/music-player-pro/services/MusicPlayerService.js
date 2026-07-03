import { playerState } from '../state/playerState.js';

export class MusicPlayerService {
  constructor(tracks = []) {
    playerState.tracks = tracks;
    playerState.audio.volume = playerState.volume;

    playerState.audio.addEventListener('ended', () => {
      if (playerState.repeat) {
        this.play();
      } else {
        this.next();
      }
    });
  }

  getState() {
    return playerState;
  }

  getCurrentTrack() {
    return playerState.tracks[playerState.currentIndex] || null;
  }

  load(index = 0) {
    if (!playerState.tracks[index]) return null;
    playerState.currentIndex = index;
    const track = this.getCurrentTrack();
    playerState.audio.src = track.src || '';
    return track;
  }

  async play(index = null) {
    if (index !== null) this.load(index);
    const track = this.getCurrentTrack();

    if (!track) return false;

    if (!playerState.audio.src && track.src) {
      playerState.audio.src = track.src;
    }

    if (!playerState.audio.src) {
      console.warn('[Music Player Pro] No audio source configured for:', track.title);
      return false;
    }

    await playerState.audio.play();
    playerState.isPlaying = true;
    return true;
  }

  pause() {
    playerState.audio.pause();
    playerState.isPlaying = false;
  }

  toggle() {
    if (playerState.isPlaying) {
      this.pause();
      return false;
    }
    this.play();
    return true;
  }

  next() {
    if (!playerState.tracks.length) return null;
    playerState.currentIndex = (playerState.currentIndex + 1) % playerState.tracks.length;
    this.load(playerState.currentIndex);
    return this.play();
  }

  previous() {
    if (!playerState.tracks.length) return null;
    playerState.currentIndex =
      (playerState.currentIndex - 1 + playerState.tracks.length) % playerState.tracks.length;
    this.load(playerState.currentIndex);
    return this.play();
  }

  seek(percent) {
    if (!playerState.audio.duration) return;
    playerState.audio.currentTime = playerState.audio.duration * percent;
  }

  setVolume(value) {
    const volume = Math.max(0, Math.min(1, value));
    playerState.volume = volume;
    playerState.audio.volume = volume;
  }
}
