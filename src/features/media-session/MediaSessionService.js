/**
 * Cántico de Fe Music
 * V10.0 — Media Session Service
 */

export class MediaSessionService {
  static isSupported() {
    return 'mediaSession' in navigator;
  }

  static update(track = {}) {
    if (!this.isSupported()) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title ?? '',
      artist: track.author ?? 'Cántico de Fe Music',
      album: track.album ?? '',
      artwork: this.buildArtwork(track)
    });
  }

  static buildArtwork(track = {}) {
    const image =
      track.cover ||
      track.image ||
      '/assets/images/default-social-cover.png';

    return [
      {
        src: image,
        sizes: '512x512',
        type: 'image/png'
      }
    ];
  }

  static registerHandlers(handlers = {}) {
    if (!this.isSupported()) {
      return;
    }

    const actions = [
  'play',
  'pause',
  'previoustrack',
  'nexttrack',
  'seekbackward',
  'seekforward',
  'seekto'
];

    actions.forEach(action => {
  try {
    if (typeof handlers[action] === 'function') {
      navigator.mediaSession.setActionHandler(
        action,
        handlers[action]
      );
    }
  } catch (error) {
    // Algunos navegadores aún no soportan
    // determinadas acciones de Media Session.
  }
});
  }

  static setPlaybackState(state = 'none') {
    if (!this.isSupported()) {
      return;
    }

    navigator.mediaSession.playbackState = state;
  }

  static clear() {
    if (!this.isSupported()) {
      return;
    }

    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = 'none';
  }
}
