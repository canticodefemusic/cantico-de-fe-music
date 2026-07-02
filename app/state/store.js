export function createStore(initial){
 let state=structuredClone(initial);
 const listeners=new Set();
 return{
  getState:()=>state,
  setState(update){
    state={...state,...update};
    listeners.forEach(fn=>fn(state));
  },
  subscribe(fn){
    listeners.add(fn);
    return()=>listeners.delete(fn);
  },
  reset(){
    state=structuredClone(initial);
    listeners.forEach(fn=>fn(state));
  }
 };
}
