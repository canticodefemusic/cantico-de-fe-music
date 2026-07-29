import {
  MusicPlayerService,
  playerTracks
} from '../../../features/music-player-pro/index.js';

const player = new MusicPlayerService(playerTracks);

export function initHistoryView() {
  document
    .querySelectorAll('[data-history-play]')
    .forEach(button => {

      button.addEventListener('click', async () => {

        const id =
          button.dataset.historyPlay;

        const track =
          player.loadById(id);

        if (!track) {
          console.warn(
            '[History View] Himno no encontrado:',
            id
          );
          return;
        }

        await player.play();

      });

    });
}

export default initHistoryView;
