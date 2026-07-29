import { applicationState } from "../../core/state/index.js";

const audio = new Audio();

export const playerState = {
  audio,
  tracks: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.8,
  repeat: false,
  shuffle: false
};

/**
 * Sincroniza el estado actual del reproductor
 * con el Application State Engine.
 */
export function syncPlayerApplicationState(
  metadata = { source: "music-player-pro" }
) {
  const currentTrack =
    playerState.tracks[playerState.currentIndex] ?? null;

  return applicationState.updateSection(
    "player",
    {
      currentTrack,
      isPlaying: playerState.isPlaying,
      currentTime: Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : 0,
      duration: Number.isFinite(audio.duration)
        ? audio.duration
        : 0,
      volume: playerState.volume,
      muted: audio.muted,
      repeatMode: playerState.repeat ? "all" : "off",
      shuffleEnabled: playerState.shuffle
    },
    metadata
  );
}

syncPlayerApplicationState({
  source: "music-player-pro",
  action: "initialize-player-state"
});
