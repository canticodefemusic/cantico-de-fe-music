export class DependencyInjector {
  constructor(container){
    this.container = container;
  }

  get(serviceName){
    return this.container.resolve(serviceName);
  }

  inject(target, mapping){
    const deps = {};
    for(const [prop, service] of Object.entries(mapping)){
      deps[prop] = this.container.resolve(service);
    }
    return Object.assign(target, deps);
  }
}
