export function waitFor(eventBus,eventName){
 return new Promise(resolve=>{
   eventBus.once(eventName,resolve);
 });
}
