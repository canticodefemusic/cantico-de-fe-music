export class AuthenticationModule{
  constructor(api){
    this.api=api;
    this.user=null;
    this.token=null;
  }
  async login(credentials){
    const r=await this.api.post('/auth/login',credentials);
    this.user=r.user;
    this.token=r.token;
    return r;
  }
  logout(){
    this.user=null;
    this.token=null;
  }
  isAuthenticated(){
    return !!this.token;
  }
}
