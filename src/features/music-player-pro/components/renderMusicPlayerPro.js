import { playerTracks } from '../data/playerTracks.js';
import { MusicPlayerService } from '../services/MusicPlayerService.js';

let service = null;

export function renderMusicPlayerPro() {
  service = new MusicPlayerService(playerTracks);
  service.load(0);
  const track = service.getCurrentTrack();

  return `
    <section class="music-player-pro" id="musicPlayerPro">
      <div class="mpp-track">
        <div class="mpp-cover">♪</div>
        <div>
          <strong id="mppTitle">${track?.title || 'Sin canción'}</strong>
          <span id="mppArtist">${track?.artist || 'Cántico de Fe Music'}</span>
        </div>
      </div>

      <div class="mpp-controls">
        <button type="button" data-mpp="previous">⏮</button>
        <button type="button" class="mpp-play" data-mpp="toggle">▶</button>
        <button type="button" data-mpp="next">⏭</button>
      </div>

      <div class="mpp-progress-wrap">
        <input id="mppProgress" type="range" min="0" max="100" value="0">
      </div>

      <div class="mpp-volume">
        <span>Vol</span>
        <input id="mppVolume" type="range" min="0" max="100" value="80">
      </div>
    </section>
  `;
}

export function initMusicPlayerPro() {
  const root = document.getElementById('musicPlayerPro');
  if (!root || !service) return;

  const playButton = root.querySelector('[data-mpp="toggle"]');
  const previousButton = root.querySelector('[data-mpp="previous"]');
  const nextButton = root.querySelector('[data-mpp="next"]');
  const progress = root.querySelector('#mppProgress');
  const volume = root.querySelector('#mppVolume');

  playButton?.addEventListener('click', async () => {
    const playing = service.toggle();
    playButton.textContent = playing ? '⏸' : '▶';
  });

  previousButton?.addEventListener('click', () => {
    service.previous();
    updateTrackUI();
  });

  nextButton?.addEventListener('click', () => {
    service.next();
    updateTrackUI();
  });

  progress?.addEventListener('input', event => {
    service.seek(Number(event.target.value) / 100);
  });

  volume?.addEventListener('input', event => {
    service.setVolume(Number(event.target.value) / 100);
  });
  
window.addEventListener('cantico:hymn-play', async event => {
  const hymn = event.detail;
  if (!hymn?.id) return;

  const track = service.loadById(hymn.id);

  if (!track) {
    console.warn('[Music Player Pro] No track found for hymn:', hymn.id);
    return;
  }

  updateTrackUI();

  const playing = await service.play();
  if (playButton) {
    playButton.textContent = playing ? '⏸' : '▶';
  }
});
  
  setInterval(() => {
    const state = service.getState();
    if (state.audio.duration && progress) {
      progress.value = String((state.audio.currentTime / state.audio.duration) * 100);
    }
  }, 1000);
}

function updateTrackUI() {
  const track = service.getCurrentTrack();
  const title = document.getElementById('mppTitle');
  const artist = document.getElementById('mppArtist');

  if (title) title.textContent = track?.title || 'Sin canción';
  if (artist) artist.textContent = track?.artist || 'Cántico de Fe Music';
}
