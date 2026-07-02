import { CACHE_DEFAULTS } from './cache.constants.js';
import { MemoryCacheStore } from './cache.memory.js';
import { StorageCacheStore } from './cache.storage.js';

export class CacheEngine {
  constructor(options = {}) {
    this.options = { ...CACHE_DEFAULTS, ...options };
    this.memory = new MemoryCacheStore();
    this.storage = new StorageCacheStore(this.options.namespace);
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      expired: 0
    };
  }

  createEntry(value, options = {}) {
    const ttl = options.ttl ?? this.options.defaultTtl;
    const now = Date.now();

    return {
      value,
      createdAt: now,
      expiresAt: ttl > 0 ? now + ttl : null,
      persist: Boolean(options.persist ?? this.options.persist)
    };
  }

  isExpired(entry) {
    return Boolean(entry?.expiresAt && Date.now() > entry.expiresAt);
  }

  set(key, value, options = {}) {
    this.assertKey(key);
    const entry = this.createEntry(value, options);

    this.memory.set(key, entry);

    if (entry.persist) {
      this.storage.set(key, entry);
    }

    this.metrics.sets += 1;
    return value;
  }

  get(key, fallbackValue = null) {
    this.assertKey(key);

    let entry = this.memory.get(key);

    if (!entry) {
      entry = this.storage.get(key);
      if (entry) this.memory.set(key, entry);
    }

    if (!entry) {
      this.metrics.misses += 1;
      return fallbackValue;
    }

    if (this.isExpired(entry)) {
      this.delete(key);
      this.metrics.expired += 1;
      this.metrics.misses += 1;
      return fallbackValue;
    }

    this.metrics.hits += 1;
    return entry.value;
  }

  has(key) {
    return this.get(key, undefined) !== undefined;
  }

  delete(key) {
    this.assertKey(key);
    const deleted = this.memory.delete(key);
    this.storage.delete(key);
    this.metrics.deletes += 1;
    return deleted;
  }

  clear() {
    this.memory.clear();
    this.storage.clear();
    return true;
  }

  clearExpired() {
    let removed = 0;

    this.keys().forEach((key) => {
      const entry = this.memory.get(key) || this.storage.get(key);
      if (this.isExpired(entry)) {
        this.delete(key);
        removed += 1;
      }
    });

    this.metrics.expired += removed;
    return removed;
  }

  keys() {
    return Array.from(new Set([...this.memory.keys(), ...this.storage.keys()]));
  }

  stats() {
    return {
      ...this.metrics,
      memorySize: this.memory.size(),
      persistentKeys: this.storage.keys().length,
      storageAvailable: this.storage.available
    };
  }

  assertKey(key) {
    if (typeof key !== 'string' || key.trim() === '') {
      throw new Error('[CacheEngine] key must be a non-empty string.');
    }
  }
}

export const cacheEngine = new CacheEngine();
