export const CACHE_DEFAULTS = Object.freeze({
  namespace: 'cantico:v8:cache',
  defaultTtl: 5 * 60 * 1000,
  persist: false,
  autoClearExpired: true
});

export const CACHE_EVENTS = Object.freeze({
  SET: 'cache:set',
  HIT: 'cache:hit',
  MISS: 'cache:miss',
  DELETE: 'cache:delete',
  CLEAR: 'cache:clear',
  EXPIRED: 'cache:expired'
});
