
export const playerState = {
  queue: [],
  current: 0,
  playing: false
};

export function renderPlayer(){
  return `
    <div class="mini-player" id="miniPlayer">
      <button class="control" data-prev>⏮</button>
      <button class="control" data-toggle id="miniPlay">▶</button>
      <button class="control" data-next>⏭</button>
      <div class="meta">
        <strong id="miniTitle">Selecciona un himno</strong>
        <div class="progress"><span></span></div>
      </div>
    </div>
  `;
}

export function setQueue(queue, start = 0){
  playerState.queue = queue;
  playerState.current = start;
  playerState.playing = true;
  updatePlayer();
}

export function nextSong(){
  if(!playerState.queue.length) return;
  playerState.current = (playerState.current + 1) % playerState.queue.length;
  playerState.playing = true;
  updatePlayer();
}

export function prevSong(){
  if(!playerState.queue.length) return;
  playerState.current = (playerState.current - 1 + playerState.queue.length) % playerState.queue.length;
  playerState.playing = true;
  updatePlayer();
}

export function togglePlay(){
  playerState.playing = !playerState.playing;
  updatePlayer();
}

function updatePlayer(){
  const player = document.querySelector("#miniPlayer");
  const title = document.querySelector("#miniTitle");
  const play = document.querySelector("#miniPlay");
  if(!player || !title || !play) return;
  const song = playerState.queue[playerState.current];
  player.classList.add("show");
  title.textContent = song ? song.title : "Selecciona un himno";
  play.textContent = playerState.playing ? "⏸" : "▶";
}
