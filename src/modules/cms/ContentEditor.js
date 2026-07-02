export class ContentEditor{
  constructor(){ this.content=''; }
  setContent(v){ this.content=v; }
  getContent(){ return this.content; }
  clear(){ this.content=''; }
}
