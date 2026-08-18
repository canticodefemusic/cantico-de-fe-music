/**
 * Cántico de Fe Music
 * V13.4.40 — Dynamic R2 Music Player
 *
 * Funciones:
 * - Mantener compatibilidad con playerTracks
 * - Reproducir himnos dinámicos recibidos desde R2
 * - Cargar directamente el objeto hymn
 * - Mantener Queue Engine
 * - Mantener Previous / Next
 * - Mantener progreso y volumen
 * - Evitar listeners globales duplicados
 */

import {
  playerTracks
} from '../data/playerTracks.js';

import {
  MusicPlayerService
} from '../services/MusicPlayerService.js';

import {
  onQueueEvent,
  QueueEventNames
} from '../../queue-engine/index.js';

const service =
  new MusicPlayerService(
    playerTracks
  );

let progressIntervalId =
  null;

let removeQueueTrackListener =
  null;

let hymnPlayHandler =
  null;

let isSeeking =
  false;

function getPlayerService() {
  return service;
}

export function renderMusicPlayerPro() {
  const playerService =
    getPlayerService();

  const track =
    playerService
      .getCurrentTrack();

  return `
    <section
      class="music-player-pro"
      id="musicPlayerPro"
    >
      <div
        class="mpp-track"
      >
        <div
          class="mpp-cover"
        >
          ♪
        </div>

        <div>
          <strong
            id="mppTitle"
          >
            ${
              track?.title ||
              'Sin canción'
            }
          </strong>

          <span
            id="mppArtist"
          >
            ${
              track?.artist ||
              'Cántico de Fe Music'
            }
          </span>
        </div>
      </div>

      <div
        class="mpp-controls"
      >
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

      <div
        class="mpp-progress-wrap"
      >
        <input
          id="mppProgress"
          type="range"
          min="0"
          max="100"
          value="0"
          aria-label="Progreso de la canción"
        >
      </div>

      <div
        class="mpp-volume"
      >
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

  if (
    !root ||
    !playerService
  ) {
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

  function syncPlayerUI() {
    const state =
      playerService
        .getState();

    updateTrackUI(
      playerService
        .getCurrentTrack()
    );

    if (
      playButton
    ) {
      const actuallyPlaying =
        state.isPlaying &&
        !state.audio.paused;

      playButton.textContent =
        actuallyPlaying
          ? '⏸'
          : '▶';
    }

    if (
      volume
    ) {
      volume.value =
        String(
          Math.round(
            state.volume *
            100
          )
        );
    }

    if (
      progress &&
      Number.isFinite(
        state.audio.duration
      ) &&
      state.audio.duration >
        0
    ) {
      progress.value =
        String(
          (
            state.audio.currentTime /
            state.audio.duration
          ) *
          100
        );
    }
  }

  syncPlayerUI();

  playButton
    ?.addEventListener(
      'click',
      async () => {
        await playerService
          .toggle();

        syncPlayerUI();
      }
    );

  previousButton
    ?.addEventListener(
      'click',
      async () => {
        await playerService
          .previous();

        syncPlayerUI();
      }
    );

  nextButton
    ?.addEventListener(
      'click',
      async () => {
        await playerService
          .next();

        syncPlayerUI();
      }
    );

  progress
    ?.addEventListener(
      'pointerdown',
      () => {
        isSeeking =
          true;
      }
    );

  progress
    ?.addEventListener(
      'input',
      event => {
        isSeeking =
          true;

        const value =
          Number(
            event
              .currentTarget
              .value
          );

        playerService.seek(
          value / 100
        );
      }
    );

  progress
    ?.addEventListener(
      'change',
      event => {
        const value =
          Number(
            event
              .currentTarget
              .value
          );

        playerService.seek(
          value / 100
        );

        isSeeking =
          false;
      }
    );

  progress
    ?.addEventListener(
      'pointerup',
      () => {
        isSeeking =
          false;
      }
    );

  progress
    ?.addEventListener(
      'pointercancel',
      () => {
        isSeeking =
          false;
      }
    );

  volume
    ?.addEventListener(
      'input',
      event => {
        playerService
          .setVolume(
            Number(
              event
                .target
                .value
            ) /
            100
          );
      }
    );

  /*
   * Elimina el listener anterior
   * cuando la SPA se vuelve a renderizar.
   */

  if (
    hymnPlayHandler
  ) {
    window.removeEventListener(
      'cantico:hymn-play',
      hymnPlayHandler
    );
  }

  /*
   * V13.4.40
   *
   * El evento ya contiene TODO el objeto hymn.
   *
   * No usamos loadById() porque los himnos
   * dinámicos R2 pueden no existir dentro de
   * playerTracks.
   *
   * loadTrack() acepta directamente el objeto
   * dinámico y utiliza:
   *
   * track.src || track.audio
   */

  hymnPlayHandler =
    async event => {
      const hymn =
        event.detail;

      if (
        !hymn ||
        !hymn.id
      ) {
        console.warn(
          '[Music Player Pro] Evento de reproducción sin himno válido.'
        );

        return;
      }

      const audioSource =
        hymn.src ||
        hymn.audio ||
        '';

      if (
        !audioSource
      ) {
        console.warn(
          '[Music Player Pro] El himno no tiene una fuente de audio:',
          hymn.id
        );

        return;
      }

      /*
       * La cola ya fue cargada por unifiedApp.
       *
       * loadTrack() carga directamente el himno
       * dinámico sin exigir que exista previamente
       * en playerTracks.
       */

      const track =
        playerService
          .loadTrack(
            hymn
          );

      if (
        !track
      ) {
        console.warn(
          '[Music Player Pro] No se pudo cargar el himno:',
          hymn.id
        );

        return;
      }

      updateTrackUI(
        track
      );

      const played =
        await playerService
          .play();

      if (
        !played
      ) {
        console.warn(
          '[Music Player Pro] El navegador no pudo iniciar la reproducción:',
          hymn.id,
          audioSource
        );
      }

      syncPlayerUI();
    };

  window.addEventListener(
    'cantico:hymn-play',
    hymnPlayHandler
  );

  /*
   * Sincronización con Queue Engine.
   */

  if (
    removeQueueTrackListener
  ) {
    removeQueueTrackListener();
  }

  removeQueueTrackListener =
    onQueueEvent(
      QueueEventNames
        .TRACK_CHANGED,

      event => {
        const track =
          event.detail
            ?.track;

        if (!track) {
          return;
        }

        /*
         * La cola puede contener himnos dinámicos.
         * Los cargamos directamente.
         */

        playerService
          .loadTrack(
            track
          );

        updateTrackUI(
          track
        );

        syncPlayerUI();
      }
    );

  /*
   * Evita múltiples intervalos cuando
   * la SPA vuelve a renderizar.
   */

  if (
    progressIntervalId
  ) {
    clearInterval(
      progressIntervalId
    );
  }

  progressIntervalId =
    setInterval(
      () => {
        const state =
          playerService
            .getState();

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
              ) *
              100
            );
        }

        if (
          playButton
        ) {
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
    service
      ?.getCurrentTrack()
) {
  const title =
    document.getElementById(
      'mppTitle'
    );

  const artist =
    document.getElementById(
      'mppArtist'
    );

  if (
    title
  ) {
    title.textContent =
      track?.title ||
      'Sin canción';
  }

  if (
    artist
  ) {
    artist.textContent =
      track?.artist ||
      'Cántico de Fe Music';
  }
}
