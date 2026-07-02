export class Playlist{
 constructor(data={}){this.id=data.id??null;this.name=data.name??'';this.description=data.description??'';this.tracks=data.tracks??[];}
}
