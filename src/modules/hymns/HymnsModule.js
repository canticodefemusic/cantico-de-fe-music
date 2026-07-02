export class HymnsModule {
  constructor(api){
    this.api = api;
  }

  list(){
    return this.api.get('/hymns');
  }

  get(id){
    return this.api.get(`/hymns/${id}`);
  }

  create(data){
    return this.api.post('/hymns', data);
  }

  update(id, data){
    return this.api.post(`/hymns/${id}`, data);
  }

  remove(id){
    return this.api.post(`/hymns/${id}/delete`, {});
  }
}
