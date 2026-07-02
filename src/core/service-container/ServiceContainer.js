export class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  register(name, factory) {
    this.services.set(name, factory);
  }

  singleton(name, factory) {
    this.singletons.set(name, { factory, instance: null });
  }

  resolve(name) {
    if (this.singletons.has(name)) {
      const item = this.singletons.get(name);
      if (!item.instance) item.instance = item.factory(this);
      return item.instance;
    }
    if (this.services.has(name)) {
      return this.services.get(name)(this);
    }
    throw new Error(`Service '${name}' not registered`);
  }

  has(name) {
    return this.services.has(name) || this.singletons.has(name);
  }
}
