export class ComponentEngine {
  constructor(){
    this.registry = new Map();
  }

  register(name, component){
    this.registry.set(name, component);
  }

  get(name){
    return this.registry.get(name);
  }

  has(name){
    return this.registry.has(name);
  }

  remove(name){
    this.registry.delete(name);
  }

  list(){
    return [...this.registry.keys()];
  }
}
