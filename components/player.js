
export const playerState={queue:[],current:0,playing:false};
export function renderPlayer(){return `<div class="mini-player" id="miniPlayer"><button class="control" data-prev>⏮</button><button class="control" data-toggle id="miniPlay">▶</button><button class="control" data-next>⏭</button><div class="meta"><strong id="miniTitle">Selecciona un himno</strong><div class="progress"><span></span></div></div></div>`}
export function setQueue(queue,start=0){playerState.queue=queue;playerState.current=start;playerState.playing=true;updatePlayer()}
export function nextSong(){if(!playerState.queue.length)return;playerState.current=(playerState.current+1)%playerState.queue.length;playerState.playing=true;updatePlayer()}
export function prevSong(){if(!playerState.queue.length)return;playerState.current=(playerState.current-1+playerState.queue.length)%playerState.queue.length;playerState.playing=true;updatePlayer()}
export function togglePlay(){playerState.playing=!playerState.playing;updatePlayer()}
function updatePlayer(){const p=document.querySelector("#miniPlayer"),t=document.querySelector("#miniTitle"),b=document.querySelector("#miniPlay");if(!p||!t||!b)return;const s=playerState.queue[playerState.current];p.classList.add("show");t.textContent=s?s.title:"Selecciona un himno";b.textContent=playerState.playing?"⏸":"▶"}
