export class MediaLibraryModule {
  constructor(api){ this.api=api; }
  list(){ return this.api.get('/media'); }
  upload(metadata){ return this.api.post('/media/upload', metadata); }
  details(id){ return this.api.get(`/media/${id}`); }
  remove(id){ return this.api.post(`/media/${id}/delete`, {}); }
}
