export class StorageCacheStore {
  constructor(namespace = 'cantico:v8:cache') {
    this.namespace = namespace;
    this.available = this.checkAvailability();
  }

  checkAvailability() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = `${this.namespace}:test`;
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (_error) {
      return false;
    }
  }

  buildKey(key) {
    return `${this.namespace}:${key}`;
  }

  set(key, entry) {
    if (!this.available) return false;
    try {
      window.localStorage.setItem(this.buildKey(key), JSON.stringify(entry));
      return true;
    } catch (_error) {
      return false;
    }
  }

  get(key) {
    if (!this.available) return undefined;
    try {
      const raw = window.localStorage.getItem(this.buildKey(key));
      return raw ? JSON.parse(raw) : undefined;
    } catch (_error) {
      return undefined;
    }
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    if (!this.available) return false;
    window.localStorage.removeItem(this.buildKey(key));
    return true;
  }

  clear() {
    if (!this.available) return;
    const prefix = `${this.namespace}:`;
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => window.localStorage.removeItem(key));
  }

  keys() {
    if (!this.available) return [];
    const prefix = `${this.namespace}:`;
    return Object.keys(window.localStorage)
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.replace(prefix, ''));
  }
}
