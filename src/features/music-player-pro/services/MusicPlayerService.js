import {
  playerState,
  syncPlayerApplicationState
} from '../state/playerState.js';

import { HistoryEngine } from '../../history-engine/index.js';
import { QueueService } from '../../queue-engine/index.js';
import { MediaSessionService } from '../../media-session/index.js';

import {
  PlayerPersistenceService
} from '../../player-persistence/index.js';

const queueService = new QueueService();

export class MusicPlayerService {
  constructor(tracks = []) {
  playerState.tracks = tracks;
  playerState.audio.volume = playerState.volume;

  const restoredSession =
    PlayerPersistenceService.restore(this);

  let restoredTrack = null;
  let pendingRestoreTime = null;

  if (restoredSession) {
    const savedVolume = Number(restoredSession.volume);

    if (
      Number.isFinite(savedVolume) &&
      savedVolume >= 0 &&
      savedVolume <= 1
    ) {
      playerState.volume = savedVolume;
      playerState.audio.volume = savedVolume;
    }

    const restoredIndex =
      playerState.tracks.findIndex(
        track => track.id === restoredSession.trackId
      );

    if (restoredIndex >= 0) {
      playerState.currentIndex = restoredIndex;
      restoredTrack = this.getCurrentTrack();

      const savedTime =
        Number(restoredSession.currentTime);

      if (
        Number.isFinite(savedTime) &&
        savedTime > 0
      ) {
        pendingRestoreTime = savedTime;
      }

      playerState.isPlaying = false;
    }
  }

  /*
   * Usamos onended en lugar de addEventListener
   * para evitar listeners duplicados si el
   * reproductor vuelve a inicializarse.
   */
  playerState.audio.onended = () => {
    this.next();
  };

  playerState.audio.ontimeupdate = () => {
    MediaSessionService.updatePosition(
      playerState.audio
    );

    syncPlayerApplicationState({
      source: 'music-player-service',
      action: 'time-update'
    });
  };

  playerState.audio.onloadedmetadata = () => {
    if (pendingRestoreTime !== null) {
      const safePosition = Math.min(
        pendingRestoreTime,
        playerState.audio.duration
      );

      playerState.audio.currentTime = safePosition;
      pendingRestoreTime = null;
    }

    syncPlayerApplicationState({
      source: 'music-player-service',
      action: 'metadata-loaded'
    });
  };

  if (restoredTrack) {
    playerState.audio.src =
      restoredTrack.src ||
      restoredTrack.audio ||
      '';

    MediaSessionService.update(restoredTrack);
  }

  syncPlayerApplicationState({
    source: 'music-player-service',
    action: 'initialize'
  });
}
  }

  getState() {
    return playerState;
  }

  getCurrentTrack() {
    return (
      playerState.tracks[playerState.currentIndex] ||
      null
    );
  }

  load(index = 0) {
    if (!playerState.tracks[index]) {
      return null;
    }

    playerState.currentIndex = index;

    const track = this.getCurrentTrack();

    playerState.audio.src =
      track.src ||
      track.audio ||
      '';
    
    MediaSessionService.update(track);
    
    syncPlayerApplicationState({
      source: 'music-player-service',
      action: 'load',
      trackId: track.id ?? null
    });

    return track;
  }

  loadTrack(track, queue = null, index = null) {
    if (!track) {
      return null;
    }

    if (Array.isArray(queue) && queue.length) {
      playerState.tracks = queue;
    }

    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < playerState.tracks.length
    ) {
      playerState.currentIndex = index;
    } else {
      const trackIndex =
        playerState.tracks.findIndex(
          item => item.id === track.id
        );

      if (trackIndex >= 0) {
        playerState.currentIndex = trackIndex;
      }
    }

    playerState.audio.src =
      track.src ||
      track.audio ||
      '';
    
    MediaSessionService.update(track);
    
    syncPlayerApplicationState({
      source: 'music-player-service',
      action: 'load-track',
      trackId: track.id ?? null
    });

    return track;
  }

  loadById(id) {
    const index = playerState.tracks.findIndex(
      track => track.id === id
    );

    if (index === -1) {
      return null;
    }

    return this.load(index);
  }

  async play(index = null) {
    if (index !== null) {
      this.load(index);
    }

    const track = this.getCurrentTrack();

    if (!track) {
      return false;
    }

    if (!playerState.audio.src) {
      playerState.audio.src =
        track.src ||
        track.audio ||
        '';
    }

    if (!playerState.audio.src) {
      console.warn(
        '[Music Player Pro] No audio source configured for:',
        track.title
      );

      return false;
    }

    try {
      await playerState.audio.play();

      playerState.isPlaying = true;
      MediaSessionService.update(track);

      MediaSessionService.setPlaybackState('playing');

      MediaSessionService.registerHandlers({
        play: () => this.play(),
        pause: () => this.pause(),
        nexttrack: () => this.next(),
        previoustrack: () => this.previous()
      });
      
      syncPlayerApplicationState({
        source: 'music-player-service',
        action: 'play',
        trackId: track.id ?? null
      });

      HistoryEngine.addPlay(track);

      PlayerPersistenceService.save({
        trackId: track.id ?? null,
        currentIndex: playerState.currentIndex,
        volume: playerState.volume,
        isPlaying: playerState.isPlaying
      });
      
      return true;
    } catch (error) {
      playerState.isPlaying = false;

      syncPlayerApplicationState({
        source: 'music-player-service',
        action: 'play-error',
        trackId: track.id ?? null
      });

      console.error(
        '[Music Player Pro] No se pudo reproducir el audio:',
        error
      );

      return false;
    }
  }

  pause() {
    playerState.audio.pause();
    playerState.isPlaying = false;
    
    MediaSessionService.setPlaybackState('paused');
    
    syncPlayerApplicationState({
      source: 'music-player-service',
      action: 'pause'
    });
  
    PlayerPersistenceService.save({
      trackId: this.getCurrentTrack()?.id ?? null,
      currentIndex: playerState.currentIndex,
      currentTime: playerState.audio.currentTime,
      volume: playerState.volume,
      isPlaying: false
    });
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
    const track = queueService.next();

    if (!track) {
      playerState.isPlaying = false;

      MediaSessionService.clear();
      
      syncPlayerApplicationState({
        source: 'music-player-service',
        action: 'queue-ended'
      });

      return null;
    }

    this.loadTrack(
      track,
      queueService.all(),
      queueService.index()
    );

    return this.play();
  }

  previous() {
    const track = queueService.previous();

    if (!track) {
      return null;
    }

    this.loadTrack(
      track,
      queueService.all(),
      queueService.index()
    );

    return this.play();
  }

  seek(percent) {
    if (!playerState.audio.duration) {
      return;
    }

    playerState.audio.currentTime =
      playerState.audio.duration * percent;

    syncPlayerApplicationState({
      source: 'music-player-service',
      action: 'seek'
    });
  }

  setVolume(value) {
    const volume = Math.max(
      0,
      Math.min(1, value)
    );

    playerState.volume = volume;
    playerState.audio.volume = volume;

    syncPlayerApplicationState({
      source: 'music-player-service',
      action: 'set-volume'
    });

    PlayerPersistenceService.save({
      volume: playerState.volume
    });
  }
}
