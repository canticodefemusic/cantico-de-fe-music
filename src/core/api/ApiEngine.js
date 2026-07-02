export class ApiEngine {
  constructor(baseUrl=''){
    this.baseUrl=baseUrl;
    this.headers={'Content-Type':'application/json'};
  }
  setHeader(k,v){this.headers[k]=v;}
  async get(path){
    const r=await fetch(this.baseUrl+path,{headers:this.headers});
    return r.json();
  }
  async post(path,data){
    const r=await fetch(this.baseUrl+path,{
      method:'POST',
      headers:this.headers,
      body:JSON.stringify(data)
    });
    return r.json();
  }
}
