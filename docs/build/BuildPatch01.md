# Build Patch 01

## Qué hace

Este parche crea un arranque unificado para Cántico V8.0.

Registra:

- Core Engines
- Functional Modules
- Startup Manager

## Archivos principales

- `src/bootstrap/bootstrap.js`
- `src/app/app.js`
- `src/integrations/core/registerCoreEngines.js`
- `src/integrations/modules/registerFunctionalModules.js`
- `src/startup/StartupManager.js`
- `src/fixes/build-patch-01.css`

## Importante

Este parche todavía no reemplaza todo el `index.html`.
Primero permite validar que el sistema arranca y registra los módulos.
