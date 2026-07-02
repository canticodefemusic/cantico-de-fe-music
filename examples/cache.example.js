import { cacheEngine } from '../src/core/cache/index.js';

cacheEngine.set('home:hero:title', 'Cántico de Fe Music', {
  ttl: 60000,
  persist: true
});

console.log(cacheEngine.get('home:hero:title'));
console.log(cacheEngine.stats());
