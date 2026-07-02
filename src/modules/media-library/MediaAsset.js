export class MediaAsset {
  constructor(data={}){
    this.id=data.id??null;
    this.name=data.name??'';
    this.type=data.type??'';
    this.path=data.path??'';
    this.size=data.size??0;
  }
}
