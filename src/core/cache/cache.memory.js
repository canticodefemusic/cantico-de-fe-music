export class MemoryCacheStore {
  constructor() {
    this.store = new Map();
  }

  set(key, entry) {
    this.store.set(key, entry);
    return entry;
  }

  get(key) {
    return this.store.get(key);
  }

  has(key) {
    return this.store.has(key);
  }

  delete(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  keys() {
    return Array.from(this.store.keys());
  }

  values() {
    return Array.from(this.store.values());
  }

  size() {
    return this.store.size;
  }
}
