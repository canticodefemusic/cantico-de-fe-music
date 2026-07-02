# Cántico Core V8.0 – Cache Engine

Motor de caché interno para Cántico Core V8.0.

## Ubicación recomendada

Copia la carpeta `cache` dentro de:

```text
src/core/cache/
```

Debe quedar así:

```text
src/
└── core/
    ├── configuration/
    ├── logger/
    └── cache/
```

## Funciones principales

- Guardar datos temporales en memoria.
- Guardar datos persistentes en `localStorage` cuando esté disponible.
- Soportar expiración por tiempo (`ttl`).
- Limpiar datos vencidos automáticamente.
- Trabajar seguro aunque el navegador no permita `localStorage`.
- Integrarse después con Configuration Engine y Logger Engine.

## Archivos incluidos

```text
src/core/cache/
├── cache.engine.js
├── cache.memory.js
├── cache.storage.js
├── cache.constants.js
└── index.js
```

## Uso básico

```js
import { cacheEngine } from './src/core/cache/index.js';

cacheEngine.set('site:title', 'Cántico de Fe Music', { ttl: 60000 });

const title = cacheEngine.get('site:title');
console.log(title);
```

## Métodos principales

```js
cacheEngine.set(key, value, options);
cacheEngine.get(key, fallbackValue);
cacheEngine.has(key);
cacheEngine.delete(key);
cacheEngine.clear();
cacheEngine.clearExpired();
cacheEngine.keys();
cacheEngine.stats();
```

## Opciones de `set`

```js
{
  ttl: 60000,          // tiempo en milisegundos
  persist: false       // true para usar localStorage
}
```

## Nota

Este módulo pertenece al Core V8.0. No hagas Compare & Pull Request todavía hasta completar todo el Core V8.
