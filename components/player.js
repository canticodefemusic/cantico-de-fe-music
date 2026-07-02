
export function renderPlayer(){
  return `<div class="mini-player" id="miniPlayer">
    <div class="player-cover">♪</div>
    <button class="control" data-player-prev>⏮</button>
    <button class="control" data-player-toggle id="miniPlay">▶</button>
    <button class="control" data-player-next>⏭</button>
    <button class="control" data-player-shuffle id="shuffleBtn">🔀</button>
    <button class="control" data-player-repeat id="repeatBtn">🔁</button>
    <div class="meta">
      <strong id="miniTitle">Selecciona un himno</strong>
      <small id="miniSubtitle">Cántico de Fe Music</small>
      <div class="player-warning" id="playerWarning"></div>
    </div>
    <div class="seek-wrap">
      <span class="time" id="currentTime">0:00</span>
      <input class="seek" id="miniSeek" type="range" min="0" max="100" value="0" data-player-seek>
      <span class="time" id="durationTime">0:00</span>
      <input class="volume" type="range" min="0" max="100" value="85" data-player-volume title="Volumen">
    </div>
  </div>`;
}
