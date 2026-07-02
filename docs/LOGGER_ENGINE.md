# Cántico Core V8.0 – Logger Engine

Este módulo agrega un sistema central de logs para Cántico Core V8.0.

## Funciones principales

- Niveles de log: `silent`, `error`, `warn`, `info`, `debug`, `trace`.
- Namespaces por módulo.
- Logger hijo con `logger.child("module")`.
- Transportes para consola y memoria.
- Formato estándar con fecha, nivel y contexto.
- Eventos internos para nuevas entradas y cambio de nivel.

## Uso rápido

```js
import { LoggerEngine } from "./src/core/index.js";

const logger = LoggerEngine.create({
  level: "debug",
  namespace: "cantico:app"
});

logger.info("Aplicación iniciada");
logger.debug("Configuración cargada", { environment: "production" });
```

## Logger por módulo

```js
const playerLogger = logger.child("player");
playerLogger.info("Player listo");
```

## Entradas en memoria

```js
const entries = logger.getMemoryEntries();
logger.clearMemory();
```
