import { playerTracks } from '../data/playerTracks.js';
import { MusicPlayerService } from '../services/MusicPlayerService.js';

import {
  onQueueEvent,
  QueueEventNames
} from '../../queue-engine/index.js';

let service = null;
let progressIntervalId = null;
let removeQueueTrackListener = null;
let hymnPlayHandler = null;

export function renderMusicPlayerPro() {
  service = new MusicPlayerService(playerTracks);

  const track = service.getCurrentTrack();

  return `
    <section class="music-player-pro" id="musicPlayerPro">
      <div class="mpp-track">
        <div class="mpp-cover">♪</div>

        <div>
          <strong id="mppTitle">
            ${track?.title || 'Sin canción'}
          </strong>

          <span id="mppArtist">
            ${track?.artist || 'Cántico de Fe Music'}
          </span>
        </div>
      </div>

      <div class="mpp-controls">
        <button
          type="button"
          data-mpp="previous"
          aria-label="Canción anterior"
        >
          ⏮
        </button>

        <button
          type="button"
          class="mpp-play"
          data-mpp="toggle"
          aria-label="Reproducir o pausar"
        >
          ▶
        </button>

        <button
          type="button"
          data-mpp="next"
          aria-label="Canción siguiente"
        >
          ⏭
        </button>
      </div>

      <div class="mpp-progress-wrap">
        <input
          id="mppProgress"
          type="range"
          min="0"
          max="100"
          value="0"
          aria-label="Progreso de la canción"
        >
      </div>

      <div class="mpp-volume">
        <span>Vol.</span>

        <input
          id="mppVolume"
          type="range"
          min="0"
          max="100"
          value="80"
          aria-label="Volumen"
        >
      </div>
    </section>
  `;
}

export function initMusicPlayerPro() {
  const root =
    document.getElementById('musicPlayerPro');

  if (!root || !service) {
    return;
  }

  const playButton =
    root.querySelector('[data-mpp="toggle"]');

  const previousButton =
    root.querySelector('[data-mpp="previous"]');

  const nextButton =
    root.querySelector('[data-mpp="next"]');

  const progress =
    root.querySelector('#mppProgress');

  const volume =
    root.querySelector('#mppVolume');

  playButton?.addEventListener(
    'click',
    () => {
      const playing = service.toggle();

      playButton.textContent =
        playing ? '⏸' : '▶';
    }
  );

  previousButton?.addEventListener(
    'click',
    async () => {
      const playing = await service.previous();

      updateTrackUI();

      if (playButton) {
        playButton.textContent =
          playing ? '⏸' : '▶';
      }
    }
  );

  nextButton?.addEventListener(
    'click',
    async () => {
      const playing = await service.next();

      updateTrackUI();

      if (playButton) {
        playButton.textContent =
          playing ? '⏸' : '▶';
      }
    }
  );

  progress?.addEventListener(
    'input',
    event => {
      service.seek(
        Number(event.target.value) / 100
      );
    }
  );

  volume?.addEventListener(
    'input',
    event => {
      service.setVolume(
        Number(event.target.value) / 100
      );
    }
  );

  /*
   * Evita registrar varias veces el listener
   * global si la aplicación vuelve a renderizarse.
   */
  if (hymnPlayHandler) {
    window.removeEventListener(
      'cantico:hymn-play',
      hymnPlayHandler
    );
  }

  hymnPlayHandler = async event => {
    const hymn = event.detail;

    if (!hymn?.id) {
      return;
    }

    const track = service.loadById(hymn.id);

    if (!track) {
      console.warn(
        '[Music Player Pro] No track found for hymn:',
        hymn.id
      );

      return;
    }

    updateTrackUI(track);

    const playing = await service.play();

    if (playButton) {
      playButton.textContent =
        playing ? '⏸' : '▶';
    }
  };

  window.addEventListener(
    'cantico:hymn-play',
    hymnPlayHandler
  );

  /*
   * TRACK_CHANGED ya es emitido por QueueService.
   * Aquí solamente actualizamos la interfaz.
   * No volvemos a cargar ni reproducir la pista.
   */
  if (removeQueueTrackListener) {
    removeQueueTrackListener();
  }

  removeQueueTrackListener = onQueueEvent(
    QueueEventNames.TRACK_CHANGED,
    event => {
      const track = event.detail?.track;

      if (!track) {
        return;
      }

      updateTrackUI(track);
    }
  );

  /*
   * Evita crear varios intervalos al volver
   * a inicializar el reproductor.
   */
  if (progressIntervalId) {
    clearInterval(progressIntervalId);
  }

  progressIntervalId = setInterval(
    () => {
      const state = service.getState();

      if (
        state.audio.duration &&
        progress
      ) {
        progress.value = String(
          (
            state.audio.currentTime /
            state.audio.duration
          ) * 100
        );
      }
    },
    1000
  );
}

function updateTrackUI(
  track = service?.getCurrentTrack()
) {
  const title =
    document.getElementById('mppTitle');

  const artist =
    document.getElementById('mppArtist');

  if (title) {
    title.textContent =
      track?.title || 'Sin canción';
  }

  if (artist) {
    artist.textContent =
      track?.artist ||
      'Cántico de Fe Music';
  }
}
