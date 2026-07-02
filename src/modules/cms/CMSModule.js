export class CMSModule{
  constructor(api){
    this.api=api;
  }
  list(){ return this.api.get('/cms'); }
  get(id){ return this.api.get(`/cms/${id}`); }
  create(data){ return this.api.post('/cms',data); }
  update(id,data){ return this.api.post(`/cms/${id}`,data); }
  remove(id){ return this.api.post(`/cms/${id}/delete`,{}); }
}
