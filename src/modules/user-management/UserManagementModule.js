export class UserManagementModule {
  constructor(api){
    this.api = api;
  }

  async listUsers(){
    return this.api.get('/users');
  }

  async getUser(id){
    return this.api.get(`/users/${id}`);
  }

  async createUser(data){
    return this.api.post('/users', data);
  }

  async updateUser(id, data){
    return this.api.post(`/users/${id}`, data);
  }

  async deleteUser(id){
    return this.api.post(`/users/${id}/delete`, {});
  }
}
