
export const PlayerService = {
  queue: [],
  currentIndex: 0,
  audio: null,
  playing: false,
  repeat: false,
  shuffle: false,

  init(){
    if(this.audio) return;
    this.audio = new Audio();
    this.audio.preload = "metadata";
    this.audio.addEventListener("timeupdate", () => this.updateUI());
    this.audio.addEventListener("loadedmetadata", () => this.updateUI());
    this.audio.addEventListener("ended", () => this.next());
  },

  setQueue(queue, start = 0){
    this.init();
    this.queue = queue || [];
    this.currentIndex = start < 0 ? 0 : start;
    this.playing = true;
    this.loadCurrent();
  },

  current(){
    return this.queue[this.currentIndex];
  },

  loadCurrent(){
    const song = this.current();
    const player = document.querySelector("#miniPlayer");
    if(player) player.classList.add("show");
    if(song?.audioUrl){
      this.audio.src = song.audioUrl;
      this.audio.play().catch(() => {});
    } else {
      this.audio.removeAttribute("src");
      this.audio.load();
    }
    this.updateUI();
  },

  playPause(){
    this.init();
    const song = this.current();
    if(!song && this.queue.length) this.currentIndex = 0;
    if(this.playing){
      this.audio.pause();
      this.playing = false;
    } else {
      if(song?.audioUrl) this.audio.play().catch(()=>{});
      this.playing = true;
    }
    this.updateUI();
  },

  next(){
    if(!this.queue.length) return;
    if(this.shuffle){
      this.currentIndex = Math.floor(Math.random() * this.queue.length);
    } else if(this.repeat){
      this.currentIndex = this.currentIndex;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.queue.length;
    }
    this.playing = true;
    this.loadCurrent();
  },

  prev(){
    if(!this.queue.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
    this.playing = true;
    this.loadCurrent();
  },

  seek(value){
    if(!this.audio || !this.audio.duration) return;
    this.audio.currentTime = (Number(value) / 100) * this.audio.duration;
    this.updateUI();
  },

  setVolume(value){
    this.init();
    this.audio.volume = Number(value) / 100;
  },

  toggleRepeat(){
    this.repeat = !this.repeat;
    this.updateUI();
  },

  toggleShuffle(){
    this.shuffle = !this.shuffle;
    this.updateUI();
  },

  formatTime(seconds){
    if(!seconds || Number.isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  },

  updateUI(){
    const song = this.current();
    const title = document.querySelector("#miniTitle");
    const subtitle = document.querySelector("#miniSubtitle");
    const playBtn = document.querySelector("#miniPlay");
    const seek = document.querySelector("#miniSeek");
    const currentTime = document.querySelector("#currentTime");
    const duration = document.querySelector("#durationTime");
    const warning = document.querySelector("#playerWarning");
    const repeatBtn = document.querySelector("#repeatBtn");
    const shuffleBtn = document.querySelector("#shuffleBtn");

    if(title) title.textContent = song?.title || "Selecciona un himno";
    if(subtitle) subtitle.textContent = song?.reference || "Cántico de Fe Music";
    if(playBtn) playBtn.textContent = this.playing ? "⏸" : "▶";
    if(repeatBtn) repeatBtn.classList.toggle("active", this.repeat);
    if(shuffleBtn) shuffleBtn.classList.toggle("active", this.shuffle);

    const dur = this.audio?.duration || 0;
    const cur = this.audio?.currentTime || 0;
    if(seek) seek.value = dur ? Math.round((cur / dur) * 100) : 0;
    if(currentTime) currentTime.textContent = this.formatTime(cur);
    if(duration) duration.textContent = song?.duration || this.formatTime(dur);
    if(warning) warning.textContent = song?.audioUrl ? "" : "Demo: agrega un MP3 en audioUrl para escuchar audio real.";
  }
};
