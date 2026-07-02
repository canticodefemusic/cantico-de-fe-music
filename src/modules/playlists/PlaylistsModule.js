export class PlaylistsModule {
  constructor(){ this.playlists=[]; }
  create(name){ const p={id:crypto.randomUUID?.()??Date.now().toString(),name,tracks:[]}; this.playlists.push(p); return p; }
  list(){ return [...this.playlists]; }
  addTrack(id,track){ const p=this.playlists.find(x=>x.id===id); if(p) p.tracks.push(track); return p; }
  removeTrack(id,trackId){ const p=this.playlists.find(x=>x.id===id); if(p) p.tracks=p.tracks.filter(t=>t.id!==trackId); return p; }
}
