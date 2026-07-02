export class EventBus{
 constructor(){this.events=new Map();}
 on(name,handler){
   const list=this.events.get(name)||[];
   list.push(handler);
   this.events.set(name,list);
   return ()=>this.off(name,handler);
 }
 once(name,handler){
   const off=this.on(name,(payload)=>{off();handler(payload);});
 }
 off(name,handler){
   const list=this.events.get(name)||[];
   this.events.set(name,list.filter(h=>h!==handler));
 }
 emit(name,payload){
   (this.events.get(name)||[]).forEach(fn=>fn(payload));
   (this.events.get("*")||[]).forEach(fn=>fn({event:name,payload}));
 }
 clear(){this.events.clear();}
}
