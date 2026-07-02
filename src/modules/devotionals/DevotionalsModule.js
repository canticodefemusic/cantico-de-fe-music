export class DevotionalsModule {
  constructor(api) {
    this.api = api;
  }

  list() {
    return this.api.get('/devotionals');
  }

  get(id) {
    return this.api.get(`/devotionals/${id}`);
  }

  create(data) {
    return this.api.post('/devotionals', data);
  }

  update(id, data) {
    return this.api.post(`/devotionals/${id}`, data);
  }

  remove(id) {
    return this.api.post(`/devotionals/${id}/delete`, {});
  }

  daily() {
    return this.api.get('/devotionals/daily');
  }
}
