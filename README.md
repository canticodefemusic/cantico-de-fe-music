# Cántico Core V8.0 – Logger Engine

ZIP funcional del motor de logs para Cántico Core V8.0.

## Estructura

```txt
src/
  logger/
    LoggerEngine.js
    LogFormatter.js
    ConsoleTransport.js
    MemoryTransport.js
    logLevels.js
  core/
    index.js
examples/
  basic-usage.js
tests/
  logger-engine.test.js
docs/
  LOGGER_ENGINE.md
```

## Comandos

```bash
npm install
npm test
npm start
```

## Qué incluye

- Motor `LoggerEngine`.
- Niveles de log configurables.
- Transportes de consola y memoria.
- Logger hijo por módulo.
- Formateador estándar.
- Ejemplo funcional.
- Prueba básica con Node.js.
