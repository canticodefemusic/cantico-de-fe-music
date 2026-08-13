import { playerTracks } from '../data/playerTracks.js';
import { MusicPlayerService } from '../services/MusicPlayerService.js';

import {
  onQueueEvent,
  QueueEventNames
} from '../../queue-engine/index.js';

const service =
  new MusicPlayerService(playerTracks);

let progressIntervalId = null;
let removeQueueTrackListener = null;
let hymnPlayHandler = null;
let isSeeking = false;

function getPlayerService() {
  if (!service) {
    service =
      new MusicPlayerService(
        playerTracks
      );
  }

  return service;
}

export function renderMusicPlayerPro() {
  const playerService =
    getPlayerService();

  const track =
    playerService.getCurrentTrack();

  return `
    <section
      class="music-player-pro"
      id="musicPlayerPro"
    >
      <div class="mpp-track">
        <div class="mpp-cover">
          ♪
        </div>

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
        <span>
          Vol.
        </span>

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
    document.getElementById(
      'musicPlayerPro'
    );

  const playerService =
    getPlayerService();

  if (!root || !playerService) {
    return;
  }

  const playButton =
    root.querySelector(
      '[data-mpp="toggle"]'
    );

  const previousButton =
    root.querySelector(
      '[data-mpp="previous"]'
    );

  const nextButton =
    root.querySelector(
      '[data-mpp="next"]'
    );

  const progress =
    root.querySelector(
      '#mppProgress'
    );

  const volume =
    root.querySelector(
      '#mppVolume'
    );

  /*
   * Sincroniza la nueva interfaz renderizada
   * con el estado real y persistente del audio.
   */
  const syncPlayerUI = () => {
    const state =
      playerService.getState();

    updateTrackUI(
      playerService.getCurrentTrack()
    );

    if (playButton) {
      const actuallyPlaying =
        state.isPlaying &&
        !state.audio.paused;

      playButton.textContent =
        actuallyPlaying
          ? '⏸'
          : '▶';
    }

    if (volume) {
      volume.value =
        String(
          Math.round(
            state.volume * 100
          )
        );
    }

    if (
      progress &&
      Number.isFinite(
        state.audio.duration
      ) &&
      state.audio.duration > 0
    ) {
      progress.value =
        String(
          (
            state.audio.currentTime /
            state.audio.duration
          ) * 100
        );
    }
  };

  syncPlayerUI();

  playButton?.addEventListener(
    'click',
    async () => {
      await playerService.toggle();

      syncPlayerUI();
    }
  );

  previousButton?.addEventListener(
    'click',
    async () => {
      await playerService.previous();

      syncPlayerUI();
    }
  );

  nextButton?.addEventListener(
    'click',
    async () => {
      await playerService.next();

      syncPlayerUI();
    }
  );

  progress?.addEventListener(
    'pointerdown',
    event => {
      isSeeking = true;

      console.log(
        '[Progress Diagnostic] pointerdown',
        {
          value:
            event.currentTarget.value,
          isSeeking
        }
      );
    }
  );

  progress?.addEventListener(
    'input',
    event => {
      isSeeking = true;

      const value =
        Number(
          event.currentTarget.value
        );

      const percent =
        value / 100;

      console.log(
        '[Progress Diagnostic] input',
        {
          value,
          percent,
          isSeeking
        }
      );

      playerService.seek(
        percent
      );

      console.log(
        '[Progress Diagnostic] after seek',
        {
          currentTime:
            playerService
              .getState()
              .audio
              .currentTime,

          duration:
            playerService
              .getState()
              .audio
              .duration
        }
      );
    }
  );

  progress?.addEventListener(
    'change',
    event => {
      const value =
        Number(
          event.currentTarget.value
        );

      const percent =
        value / 100;

      console.log(
        '[Progress Diagnostic] change',
        {
          value,
          percent
        }
      );

      playerService.seek(
        percent
      );

      isSeeking = false;
    }
  );

  progress?.addEventListener(
    'pointerup',
    () => {
      isSeeking = false;

      console.log(
        '[Progress Diagnostic] pointerup',
        {
          currentTime:
            playerService
              .getState()
              .audio
              .currentTime,

          duration:
            playerService
              .getState()
              .audio
              .duration
        }
      );
    }
  );

  progress?.addEventListener(
    'pointercancel',
    () => {
      isSeeking = false;

      console.log(
        '[Progress Diagnostic] pointercancel'
      );
    }
  );

  volume?.addEventListener(
    'input',
    event => {
      playerService.setVolume(
        Number(
          event.target.value
        ) / 100
      );
    }
  );

  /*
   * Evita listeners globales duplicados
   * cuando la SPA vuelve a renderizar.
   */
  if (hymnPlayHandler) {
    window.removeEventListener(
      'cantico:hymn-play',
      hymnPlayHandler
    );
  }

  hymnPlayHandler =
    async event => {
      const hymn =
        event.detail;

      if (!hymn?.id) {
        return;
      }

      const track =
        playerService.loadById(
          hymn.id
        );

      if (!track) {
        console.warn(
          '[Music Player Pro] No track found for hymn:',
          hymn.id
        );

        return;
      }

      updateTrackUI(
        track
      );

      await playerService.play();

      syncPlayerUI();
    };

  window.addEventListener(
    'cantico:hymn-play',
    hymnPlayHandler
  );

  /*
   * TRACK_CHANGED ya es emitido
   * por QueueService.
   *
   * Aquí únicamente sincronizamos
   * la interfaz.
   */
  if (removeQueueTrackListener) {
    removeQueueTrackListener();
  }

  removeQueueTrackListener =
    onQueueEvent(
      QueueEventNames.TRACK_CHANGED,
      event => {
        const track =
          event.detail?.track;

        if (!track) {
          return;
        }

        updateTrackUI(
          track
        );

        syncPlayerUI();
      }
    );

  /*
   * Evita varios intervalos cuando
   * la SPA vuelve a renderizar.
   */
  if (progressIntervalId) {
    clearInterval(
      progressIntervalId
    );
  }

  progressIntervalId =
    setInterval(
      () => {
        const state =
          playerService.getState();

        if (
          state.audio.duration &&
          progress &&
          !isSeeking
        ) {
          progress.value =
            String(
              (
                state.audio.currentTime /
                state.audio.duration
              ) * 100
            );
        }

        /*
         * Mantiene Play/Pause sincronizado
         * incluso después de navegar
         * entre vistas.
         */
        if (playButton) {
          const actuallyPlaying =
            state.isPlaying &&
            !state.audio.paused;

          playButton.textContent =
            actuallyPlaying
              ? '⏸'
              : '▶';
        }
      },
      1000
    );
}

function updateTrackUI(
  track =
    service?.getCurrentTrack()
) {
  const title =
    document.getElementById(
      'mppTitle'
    );

  const artist =
    document.getElementById(
      'mppArtist'
    );

  if (title) {
    title.textContent =
      track?.title ||
      'Sin canción';
  }

  if (artist) {
    artist.textContent =
      track?.artist ||
      'Cántico de Fe Music';
  }
}
