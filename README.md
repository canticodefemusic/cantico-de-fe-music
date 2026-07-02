# Cántico Core V8.0 – Configuration Engine

ZIP funcional del motor de configuración para Cántico Core V8.0.

## Estructura

```txt
src/
  config/
    ConfigurationEngine.js
    ConfigValidator.js
    configSchema.js
    defaultConfig.js
  core/
    index.js
  utils/
    deepMerge.js
    deepFreeze.js
examples/
  basic-usage.js
tests/
  configuration-engine.test.js
docs/
  CONFIGURATION_ENGINE.md
```

## Comandos

```bash
npm install
npm test
npm start
```

## Qué incluye

- Motor `ConfigurationEngine`.
- Configuración predeterminada.
- Validador de configuración.
- Sistema simple de eventos internos.
- Ejemplo funcional.
- Prueba básica con Node.js.
